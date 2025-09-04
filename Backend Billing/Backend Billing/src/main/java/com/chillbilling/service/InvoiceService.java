package com.chillbilling.service;

import com.chillbilling.dto.InvoiceRequest;
import com.chillbilling.dto.PaymentRecord;
import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.User;
import com.chillbilling.entity.Payment;
import com.chillbilling.exception.BusinessException;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.InvoiceRepository;
import com.chillbilling.repository.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final InvoiceItemService invoiceItemService;
    private final PaymentService paymentService;
    private final EmailService emailService;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          UserRepository userRepository,
                          InvoiceItemService invoiceItemService,
                          PaymentService paymentService,
                          EmailService emailService) {
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.invoiceItemService = invoiceItemService;
        this.paymentService = paymentService;
        this.emailService=emailService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void updateOverdueInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();

        LocalDate today = LocalDate.now();
        for (Invoice invoice : invoices) {
            if (invoice.getStatus() != Invoice.Status.PAID && invoice.getDueDate().isBefore(today)) {
                if (invoice.getPaidAmount() == 0) {
                    invoice.setStatus(Invoice.Status.OVERDUE);
                } else if (invoice.getPaidAmount() < invoice.getTotalAmount()) {
                    invoice.setStatus(Invoice.Status.OVERDUE);
                }
                invoiceRepository.save(invoice);
            }
        }
    }

    
    private synchronized String generateInvoiceNumber() {
        String invoiceNumber;
        do {
            int number = 100000 + new Random().nextInt(900000);
            invoiceNumber = "INV" + number;
        } while (invoiceRepository.findByInvoiceNumber(invoiceNumber).isPresent());

        return invoiceNumber;
    }
    
    
    public Invoice createInvoice(InvoiceRequest request) {
        User customer = userRepository.findByEmailId(request.getCustomerEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with email: " + request.getCustomerEmail()));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new BusinessException("Invoice can only be generated for customers.");
        }

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setCustomer(customer);
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setDueDate(request.getDueDate());

        invoiceItemService.createItems(invoice, request.getItems());

        updateInvoiceStatus(invoice);

        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(InvoiceRequest request) {
        String invoiceNumber = request.getInvoiceNumber();

        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));

        invoice.setDueDate(request.getDueDate());

        invoiceItemService.updateItems(invoiceNumber, request.getItems());

        invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found after item update."));

        double totalAmount = invoice.getTotalAmount();
        double oldPaidAmount = invoice.getPaidAmount();
        Double newPaidAmount = request.getPaidAmount();

        if (newPaidAmount == null || newPaidAmount < 0) {
            throw new BusinessException("Paid amount must be provided and >= 0.");
        }

        if (newPaidAmount < oldPaidAmount) {
            throw new BusinessException("Paid amount cannot be reduced.");
        }

        if (newPaidAmount > oldPaidAmount) {
            double paymentDifference = newPaidAmount - oldPaidAmount;

            PaymentRecord record = new PaymentRecord();
            record.setInvoiceNumber(invoiceNumber);
            record.setAmount(paymentDifference);
            record.setStatus(Payment.Status.SUCCESS);
            record.setMethod(Payment.Method.CASH);
            record.setTransactionId(null);
            record.setPaymentDate(LocalDateTime.now());

            paymentService.recordPayment(record);
        }

        if (newPaidAmount > totalAmount) {
            invoice.setPaidAmount(newPaidAmount);
            invoice.setBalance(0.0);
            invoice.setStatus(Invoice.Status.PAID);
            
            double refundAmount = newPaidAmount - totalAmount;
            String email = invoice.getCustomer().getEmailId();
            emailService.sendRefundInitiated(email, invoice.getInvoiceNumber(), refundAmount);

            return invoiceRepository.save(invoice);
        }

        invoice.setPaidAmount(newPaidAmount);
        invoice.setBalance(Math.max(0, totalAmount - newPaidAmount));

        LocalDate today = LocalDate.now();
        boolean isOverdue = invoice.getDueDate() != null && invoice.getDueDate().isBefore(today);

        if (newPaidAmount == 0) {
            invoice.setStatus(isOverdue ? Invoice.Status.OVERDUE : Invoice.Status.UNPAID);
        } else if (newPaidAmount < totalAmount) {
            invoice.setStatus(isOverdue ? Invoice.Status.OVERDUE : Invoice.Status.PARTIALLY_PAID);
        } else {
            invoice.setStatus(Invoice.Status.PAID);
        }

        return invoiceRepository.save(invoice);
    }




    public void deleteInvoice(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));
        invoiceRepository.delete(invoice);
    }

    public Invoice getInvoice(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));
    }
    
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
    
    public List<Invoice> getInvoicesByCustomerEmail(String email) {
        User customer = userRepository.findByEmailId(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new BusinessException("Only customers can fetch their invoices.");
        }

        return invoiceRepository.findByCustomer(customer);
    }

    private void updateInvoiceStatus(Invoice invoice) {
        if (invoice.getBalance() == 0) {
            invoice.setStatus(Invoice.Status.PAID);
        } else if (invoice.getPaidAmount() == 0) {
            if (invoice.getDueDate().isBefore(LocalDate.now())) {
                invoice.setStatus(Invoice.Status.OVERDUE);
            } else {
                invoice.setStatus(Invoice.Status.UNPAID);
            }
        } else {
            if (invoice.getDueDate().isBefore(LocalDate.now())) {
                invoice.setStatus(Invoice.Status.OVERDUE);
            } else {
                invoice.setStatus(Invoice.Status.PARTIALLY_PAID);
            }
        }
    }
}
