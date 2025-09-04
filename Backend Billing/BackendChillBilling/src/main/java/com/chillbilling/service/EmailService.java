package com.chillbilling.service;

import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDate;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your account";
        String link = "http://localhost:8080/api/auth/verify?token=" + token;
        String body = "Click the link to verify your account: " + link;

        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Reset your password";
        String link = "http://localhost:5173/reset-password?token=" + token;
        String body = "Click the link to reset your password: " + link;

        sendEmail(to, subject, body);
    }
    
    public void notifyOverdueInvoice(String email, String invoiceNumber, Double balance, LocalDate dueDate) {
        String subject = "Payment Due Invoice Reminder - " + invoiceNumber;
        String body = "Dear Customer,\n\n"
                + "This is a reminder that payment for your invoice *" + invoiceNumber + "* is due.\n"
                + "Outstanding Balance: ₹" + balance + "\n"
                + "Due Date: " + dueDate + "\n\n"
                + "Please make the payment immediately to avoid further actions.\n\n"
                + "Thank you,\n"
                + "Chill Billing Team";

        sendEmail(email, subject, body);
    }
    
    public void sendRefundInitiated(String email, String invoiceNumber, Double amount) {
        String subject = "OverPaid against - " + invoiceNumber;
        String body = "Dear Customer,\n\n"
                + "Unfortunately you paid more than actual amount.\n"
                + "OverPaid amount is : ₹" + amount + "\n"
                + "Refund initiated and the amount will be credited to you in 3 working days.\n\n"
                + "Thank you,\n"
                + "Chill Billing Team";

        sendEmail(email, subject, body);
    }
    

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
