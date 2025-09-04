package com.chillbilling.controller;

import com.chillbilling.dto.InvoiceNumberRequest;
import com.chillbilling.dto.InvoiceRequest;
import com.chillbilling.entity.Invoice;
import com.chillbilling.service.InvoiceService;
import com.chillbilling.validation.OnCreate;
import com.chillbilling.validation.OnUpdate;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNTANT')")
    @PostMapping
    public ResponseEntity<String> createInvoice(@Validated(OnCreate.class) @RequestBody InvoiceRequest request) {
        invoiceService.createInvoice(request);
        return ResponseEntity.ok("Invoice generated successfully");
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNTANT')")
    @PutMapping
    public ResponseEntity<String> updateInvoice(@Validated(OnUpdate.class) @RequestBody InvoiceRequest request) {
    	Invoice updated = invoiceService.updateInvoice(request);
    	if (updated.getPaidAmount() > updated.getTotalAmount()) {
            double refundAmount = updated.getPaidAmount() - updated.getTotalAmount();
            return ResponseEntity.ok("Invoice updated. The paid is greater than total, A mail related to refund of ₹" + refundAmount + " sent to customer");
        }
        return ResponseEntity.ok("Invoice updated successfully");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @DeleteMapping
    public ResponseEntity<String> deleteInvoice(@RequestBody InvoiceNumberRequest invoiceNumberRequest) {
    	String invoiceNumber=invoiceNumberRequest.getInvoiceNumber();
        invoiceService.deleteInvoice(invoiceNumber);
        return ResponseEntity.ok("Invoice deleted successfully");
    }


    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNTANT','CUSTOMER')")
    @PostMapping("/by-invoice-number")
    public Invoice getInvoice(@RequestBody InvoiceNumberRequest invoiceNumberRequest, Authentication auth) {
    	
    	String invoiceNumber=invoiceNumberRequest.getInvoiceNumber();

        Invoice invoice = invoiceService.getInvoice(invoiceNumber);

        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))) {
            String email = auth.getName();
            if (!invoice.getCustomer().getEmailId().equals(email)) {
                throw new AccessDeniedException("Access denied: You can only view your own invoices.");
            }
        }

        return invoice;
    }


    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNTANT')")
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<Invoice> getInvoicesForCurrentCustomer(Authentication auth) {
        String email = auth.getName();
        return invoiceService.getInvoicesByCustomerEmail(email);
    }
}
