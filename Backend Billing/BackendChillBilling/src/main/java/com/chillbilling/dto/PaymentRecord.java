package com.chillbilling.dto;

import com.chillbilling.entity.Payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentRecord {
	
	@NotBlank(message = "Invoice number is required")
    @Size(max = 20, message = "Invoice number must not exceed 20 characters")
    private String invoiceNumber;
	
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Payment amount must be greater than 0")
    private Double amount;
    
    @NotNull(message = "Payment method is required")
    private Payment.Method method;
    
    @NotNull(message = "Payment status is required")
    private Payment.Status status;
    
    @Size(max = 30, message = "Transaction ID must not exceed 30 characters")
    private String transactionId;
    
    @PastOrPresent(message = "Payment date cannot be in the future")
    private LocalDateTime paymentDate;
}
