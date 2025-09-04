package com.chillbilling.dto;

import java.time.LocalDate;
import java.util.List;

import com.chillbilling.validation.OnCreate;
import com.chillbilling.validation.OnUpdate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InvoiceRequest {
	
	@NotBlank(message = "Invoice number is required", groups = OnUpdate.class)
    private String invoiceNumber;
	
	@Email(message = "Invalid email format", groups = OnCreate.class)
    @NotBlank(message = "Customer email is required", groups = OnCreate.class)
    private String customerEmail;
	
	@NotNull(message = "Due date is required")
    private LocalDate dueDate;
	
    @NotNull(message = "Paid amount must be provided")
    @DecimalMin(value = "0.0", inclusive = true, message = "Paid amount cannot be negative")
    private Double paidAmount;
    
    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
    	
        @NotBlank(message = "Product name is required")
        private String productName;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
