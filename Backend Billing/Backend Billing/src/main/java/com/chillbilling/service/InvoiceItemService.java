package com.chillbilling.service;

import com.chillbilling.dto.InvoiceRequest;
import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.InvoiceItem;
import com.chillbilling.entity.Product;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.InvoiceItemRepository;
import com.chillbilling.repository.InvoiceRepository;
import com.chillbilling.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class InvoiceItemService {

    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final InvoiceItemRepository invoiceItemRepository;

    public InvoiceItemService(InvoiceRepository invoiceRepository,
                              ProductRepository productRepository,
                              InvoiceItemRepository invoiceItemRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.invoiceItemRepository = invoiceItemRepository;
    }
    
    public List<InvoiceItem> createItems(Invoice invoice, List<InvoiceRequest.ItemRequest> itemsRequest) {
        double totalAmount = 0.0;
        List<InvoiceItem> items = new ArrayList<>();

        for (InvoiceRequest.ItemRequest itemReq : itemsRequest) {
            Product product = productRepository.findByProductName(itemReq.getProductName())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductName()));

            double lineTotal = product.getPrice() * itemReq.getQuantity();

            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(lineTotal);

            items.add(item);
            totalAmount += lineTotal;
        }

        invoice.setItems(items);
        invoice.setTotalAmount(totalAmount);
        invoice.setPaidAmount(0.0);
        invoice.setBalance(totalAmount);

        return items;
    }

    public List<InvoiceItem> getItemsByInvoiceNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));
        return invoice.getItems();
    }

    public void updateItems(String invoiceNumber, List<InvoiceRequest.ItemRequest> itemsRequest) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));

        double totalAmount = 0.0;

        invoice.getItems().clear();
        
        for (InvoiceRequest.ItemRequest itemReq : itemsRequest) {
            Product product = productRepository.findByProductName(itemReq.getProductName())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found: " + itemReq.getProductName()));

            double lineTotal = product.getPrice() * itemReq.getQuantity();

            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(lineTotal);

            invoice.getItems().add(item);
            totalAmount += lineTotal;
        }

        invoice.setTotalAmount(totalAmount);
        
        invoiceRepository.save(invoice);
    }

    public void deleteItemsByInvoiceNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));
        invoiceItemRepository.deleteAll(invoice.getItems());
        invoice.getItems().clear();
        invoice.setTotalAmount(0.0);
        invoice.setBalance(invoice.getTotalAmount() - invoice.getPaidAmount());
        invoiceRepository.save(invoice);
    }
}
