package com.chillbilling.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.User;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

	List<Invoice> findByCustomer(User customer);
}
