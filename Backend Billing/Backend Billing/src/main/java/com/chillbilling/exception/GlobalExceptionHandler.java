package com.chillbilling.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "NOT_FOUND");
        error.put("errorCode", "RESOURCE_NOT_FOUND");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusiness(BusinessException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "BUSINESS_ERROR");
        error.put("errorCode", deriveErrorCode(ex.getMessage()));
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "INTERNAL_SERVER_ERROR");
        error.put("errorCode", "GENERIC_ERROR");
        error.put("message", "Something went wrong. Please try again later.");
        
        ex.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private String deriveErrorCode(String message) {
        if (message == null) return "UNKNOWN_ERROR";
        if (message.contains("cannot be reduced")) return "PAID_AMOUNT_REDUCED";
        if (message.contains("must be provided")) return "INVALID_PAID_AMOUNT";
        if (message.contains("exceed total amount")) return "OVERPAYMENT_NOT_ALLOWED";
        return "BUSINESS_RULE_VIOLATION";
    }
}
