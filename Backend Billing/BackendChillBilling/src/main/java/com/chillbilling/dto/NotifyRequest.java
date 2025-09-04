package com.chillbilling.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotifyRequest {
	@NotBlank(message = "Email must not be empty")
    private String email;
	private String invoiceNumber;

}
