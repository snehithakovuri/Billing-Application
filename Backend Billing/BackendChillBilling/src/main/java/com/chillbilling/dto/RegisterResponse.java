package com.chillbilling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private String email;
    private String status; 
    private String message;  
}
