package com.chillbilling.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {
	
    @NotBlank(message = "Email must not be empty")
    private String email;
}
