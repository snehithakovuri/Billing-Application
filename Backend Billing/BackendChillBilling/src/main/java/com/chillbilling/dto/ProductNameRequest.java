package com.chillbilling.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductNameRequest {
	
    @NotBlank(message = "Product name must not be empty")
    private String productName;
}
