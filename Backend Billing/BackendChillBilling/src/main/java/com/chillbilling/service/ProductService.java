package com.chillbilling.service;

import com.chillbilling.entity.Product;
import com.chillbilling.exception.BusinessException;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Long findProductIdByName(String productName) {
    	Product existingProduct = productRepository.findByProductName(productName)
    			.orElseThrow(() -> new ResourceNotFoundException("Product not found with name: " + productName));
    	return existingProduct.getProductId();
    }

    public Product addProduct(Product product) {
        if (productRepository.findByProductName(product.getProductName()).isPresent()) {
            throw new BusinessException("Product with name already exists.");
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Product updatedProduct) {
        Product existingProduct = productRepository.findById(productId)
        		.orElseThrow(() -> new ResourceNotFoundException("Product not found "));

        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setType(updatedProduct.getType());
        existingProduct.setPrice(updatedProduct.getPrice());

        return productRepository.save(existingProduct);
    }
    

    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        productRepository.deleteById(productId);
    }
}
