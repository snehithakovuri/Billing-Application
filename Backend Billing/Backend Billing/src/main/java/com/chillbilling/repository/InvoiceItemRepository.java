package com.chillbilling.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chillbilling.entity.InvoiceItem;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
    List<InvoiceItem> findByInvoice_InvoiceId(Long invoiceId);
}
