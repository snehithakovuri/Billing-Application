package com.chillbilling.controller;

import com.chillbilling.dto.AuthResponse;
import com.chillbilling.dto.EmailRequest;
import com.chillbilling.dto.LoginRequest;
import com.chillbilling.dto.NotifyRequest;
import com.chillbilling.dto.RegisterRequest;
import com.chillbilling.dto.RegisterResponse;
import com.chillbilling.dto.ResetPasswordRequest;
import com.chillbilling.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verified. You can now login.");
    }
    
    @PostMapping("/notify")
    public ResponseEntity<?> notify(@RequestBody NotifyRequest request) {
    	authService.sendOverdueInvoiceNotification(request.getEmail(), request.getInvoiceNumber());
    	return ResponseEntity.ok("Notification sent successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody EmailRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(token, request.getNewPassword());
        return ResponseEntity.ok("Password successfully reset");
    }

}
