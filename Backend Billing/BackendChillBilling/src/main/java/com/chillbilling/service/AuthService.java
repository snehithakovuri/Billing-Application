package com.chillbilling.service;

import com.chillbilling.dto.AuthResponse;
import com.chillbilling.dto.LoginRequest;
import com.chillbilling.dto.RegisterRequest;
import com.chillbilling.dto.RegisterResponse;
import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.User;
import com.chillbilling.exception.BusinessException;
import com.chillbilling.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final InvoiceService invoiceService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailId(request.getIdentifier())
                        .or(() -> userRepository.findByUsername(request.getIdentifier()))
                        .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("User is not active");
        }

        String token = tokenService.generateToken(user);

        return new AuthResponse(token, user.getRole().name(), user.getUsername());
    }
    
    public RegisterResponse register(RegisterRequest request) {
    	
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Passwords do not match");
        }
        
        if (userRepository.findByEmailId(request.getEmail()).isPresent()) {
            throw new BusinessException("Email already in use");
        }
        userRepository.findByUsername(request.getUsername()).ifPresent(u -> {
            throw new BusinessException("Username already in use");
        });
        userRepository.findByPhoneNumber(request.getPhoneNumber()).ifPresent(u -> {
            throw new BusinessException("Phone number already in use");
        });

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmailId(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        user.setStatus(User.Status.INACTIVE); 

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmailId(), token);

        return new RegisterResponse(
                user.getEmailId(),
                user.getStatus().name(),
                "User registered. Please check your email to verify your account."
        );
    }

    
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessException("Invalid verification token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Token expired");
        }

        user.setStatus(User.Status.ACTIVE);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }
    
    public void forgotPassword(String email) {
        User user = userRepository.findByEmailId(email)
                .orElseThrow(() -> new BusinessException("User not found"));

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmailId(), token);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessException("Invalid reset token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Reset token expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }

    public void sendOverdueInvoiceNotification(String email, String invoiceNumber) {
        Invoice invoice = invoiceService.getInvoice(invoiceNumber);

        if (!invoice.getCustomer().getEmailId().equals(email)) {
            throw new IllegalArgumentException("Invoice does not belong to the provided email.");
        }

        emailService.notifyOverdueInvoice(
                email,
                invoice.getInvoiceNumber(),
                invoice.getBalance(),
                invoice.getDueDate()
        );
    }

}
