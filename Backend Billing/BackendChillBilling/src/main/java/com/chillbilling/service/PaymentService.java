package com.chillbilling.service;

import com.chillbilling.dto.PaymentRecord;
import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.Payment;
import com.chillbilling.exception.BusinessException;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.InvoiceRepository;
import com.chillbilling.repository.PaymentRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentService(PaymentRepository paymentRepository, InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }
    
    public boolean invoiceBelongsToCustomer(String invoiceNumber, String customerEmail) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .map(invoice -> invoice.getCustomer().getEmailId().equals(customerEmail))
                .orElse(false);
    }


    public Payment recordPayment(PaymentRecord record) {
    	System.out.println("Recording payment: " + record);
    	Invoice invoice = invoiceRepository.findByInvoiceNumber(record.getInvoiceNumber())
    	        .orElseThrow(() -> new ResourceNotFoundException(
    	                "Invoice not found with number: " + record.getInvoiceNumber()));

        if (record.getStatus() == Payment.Status.SUCCESS) {
            if (record.getAmount() <= 0) {
                throw new BusinessException("Payment amount must be greater than 0.");
            }
            if (record.getAmount() > invoice.getBalance()) {
                throw new BusinessException("Payment amount cannot exceed remaining balance.");
            }
        }

        if (record.getTransactionId() != null && !record.getTransactionId().isBlank()) {
            boolean exists = paymentRepository.existsByTransactionId(record.getTransactionId());
            if (exists) {
                throw new BusinessException("Duplicate transaction ID: " + record.getTransactionId());
            }
        }
        
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(record.getAmount());
        payment.setMethod(record.getMethod());
        payment.setStatus(record.getStatus());
        payment.setTransactionId(record.getTransactionId());
        payment.setPaymentDate(record.getPaymentDate() != null 
                ? record.getPaymentDate() 
                : java.time.LocalDateTime.now());

        paymentRepository.save(payment);

        if (record.getStatus() == Payment.Status.SUCCESS) {
            double newPaidAmount = invoice.getPaidAmount() + record.getAmount();
            double newBalance = invoice.getTotalAmount() - newPaidAmount;

            if (newBalance < 0) {
                throw new BusinessException("Calculated balance cannot be negative.");
            }
            
            invoice.setPaidAmount(newPaidAmount);
            invoice.setBalance(newBalance);

            if (newBalance == 0) {
                invoice.setStatus(Invoice.Status.PAID);
            } else if (newPaidAmount == 0) {
                invoice.setStatus(invoice.getDueDate().isBefore(java.time.LocalDate.now())
                        ? Invoice.Status.OVERDUE
                        : Invoice.Status.UNPAID);
            } else {
                invoice.setStatus(invoice.getDueDate().isBefore(java.time.LocalDate.now())
                        ? Invoice.Status.OVERDUE
                        : Invoice.Status.PARTIALLY_PAID);
            }

        }

        invoiceRepository.save(invoice);
        return payment;
    }
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByInvoiceNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));
        return paymentRepository.findByInvoice_InvoiceId(invoice.getInvoiceId());
    }

    public List<Payment> getPaymentsByCustomerEmail(String email) {
        return paymentRepository.findByInvoice_Customer_EmailId(email);
    }
}
