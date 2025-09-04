package com.chillbilling.controller;

import com.chillbilling.dto.ProductNameRequest;
import com.chillbilling.entity.Product;
import com.chillbilling.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<String> addProduct(@RequestBody Product product) {
        productService.addProduct(product);
        return ResponseEntity.ok("Product/Service added successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<String> updateProduct(@RequestBody Product product) {
        productService.updateProduct(product.getProductId(), product);
        return ResponseEntity.ok("Product/Service updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/by-name")
    public Product getProductByName(@RequestBody ProductNameRequest request) {
        String productName = request.getProductName();
        Long productId = productService.findProductIdByName(productName);
        return productService.getProductById(productId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNTANT')")
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<String> deleteProduct(@RequestBody ProductNameRequest request) {
        String productName = request.getProductName();
        Long productId = productService.findProductIdByName(productName);
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product/Service deleted successfully");
    }
}
