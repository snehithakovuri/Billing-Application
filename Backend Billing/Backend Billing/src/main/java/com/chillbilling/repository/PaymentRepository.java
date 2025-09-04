package com.chillbilling.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chillbilling.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoice_InvoiceId(Long invoiceId);
    List<Payment> findByStatus(Payment.Status status);
	boolean existsByTransactionId(String transactionId);
	List<Payment> findByInvoice_Customer_EmailId(String email);
}
