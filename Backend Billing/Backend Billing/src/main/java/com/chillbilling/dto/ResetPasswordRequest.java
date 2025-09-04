package com.chillbilling.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String newPassword;
}