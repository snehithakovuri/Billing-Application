package com.chillbilling.controller;

import com.chillbilling.dto.InvoiceNumberRequest;
import com.chillbilling.dto.PaymentRecord;
import com.chillbilling.entity.Invoice;
import com.chillbilling.entity.Payment;
import com.chillbilling.entity.User;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.InvoiceRepository;
import com.chillbilling.service.PaymentService;
import com.chillbilling.service.UserService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.validation.Valid;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
	
	 @Autowired
	    private RazorpayClient razorpayClient;
	
    private final PaymentService paymentService;
    private final UserService userService;
    private final InvoiceRepository invoiceRepository;

    public PaymentController(PaymentService paymentService, UserService userService, InvoiceRepository invoiceRepository) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.invoiceRepository=invoiceRepository;
    }

   

    @Value("${razorpay.keyId}")
    private String razorpayKeyId;

    @Value("${razorpay.webhookSecret}")
    private String webhookSecret;

    private Payment.Status mapStatus(String razorpayStatus) {
        if (razorpayStatus == null) return Payment.Status.FAILED;
        switch (razorpayStatus.toLowerCase()) {
            case "captured": 
                return Payment.Status.SUCCESS;
            case "authorized": 
                return Payment.Status.PENDING; 
            case "pending":  
                return Payment.Status.PENDING;
            case "failed":   
                return Payment.Status.FAILED;
            default:         
                return Payment.Status.FAILED;
        }
    }


    private Payment.Method mapMethod(String razorpayMethod) {
        if (razorpayMethod == null) return Payment.Method.CASH;
        switch (razorpayMethod.toLowerCase()) {
            case "upi":        return Payment.Method.UPI;
            case "netbanking": return Payment.Method.BANK_TRANSFER;
            case "card":       return Payment.Method.CREDIT_CARD; 
            case "qr":         return Payment.Method.QR;
            case "wallet":     return Payment.Method.UPI;         
            default:           return Payment.Method.CASH; 
        }
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> requestData) throws RazorpayException {
        Number amountRupeesNum = (Number) requestData.get("amount");
        String invoiceNumber = requestData.get("invoiceNumber") != null
                ? requestData.get("invoiceNumber").toString()
                : null;

        if (amountRupeesNum == null || invoiceNumber == null) {
            throw new IllegalArgumentException("amount and invoiceNumber are required");
        }

        BigDecimal amountRupees = new BigDecimal(amountRupeesNum.toString());
        if (amountRupees.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("amount must be > 0");
        }

        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceNumber));

        if (amountRupees.doubleValue() > invoice.getBalance()) {
            throw new IllegalArgumentException("Payment amount cannot exceed balance.");
        }

        long amountPaise = amountRupees.multiply(BigDecimal.valueOf(100))
                .setScale(0, BigDecimal.ROUND_HALF_UP).longValue();

        JSONObject options = new JSONObject();
        options.put("amount", amountPaise);
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        JSONObject notes = new JSONObject();
        notes.put("invoiceNumber", invoiceNumber);
        options.put("notes", notes);

        Order order = razorpayClient.orders.create(options);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("currency", "INR");
        response.put("amount", amountPaise);
        response.put("key", razorpayKeyId);
        response.put("invoiceNumber", invoiceNumber);

        return response;
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!isValid) {
                return ResponseEntity.status(400).body("Invalid signature");
            }

            JSONObject root = new JSONObject(payload);
            JSONObject paymentEntity = root.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String razorpayPaymentId = paymentEntity.optString("id", null);
            String razorpayStatus = paymentEntity.optString("status", null);
            String razorpayMethod = paymentEntity.optString("method", null);
            long amountPaise = paymentEntity.optLong("amount", 0L);

            String invoiceNumber = paymentEntity.optJSONObject("notes") != null
                    ? paymentEntity.getJSONObject("notes").optString("invoiceNumber", null)
                    : null;

            if (invoiceNumber == null || invoiceNumber.isBlank()) {
                return ResponseEntity.ok("IGNORED_NO_INVOICE_NUMBER");
            }

            Payment.Status status = mapStatus(razorpayStatus);
            Payment.Method method = mapMethod(razorpayMethod);

            if (status == Payment.Status.SUCCESS || status == Payment.Status.FAILED) {
                PaymentRecord record = new PaymentRecord();
                record.setInvoiceNumber(invoiceNumber);
                record.setAmount(amountPaise / 100.0); 
                record.setMethod(method);
                record.setStatus(status);
                record.setTransactionId(razorpayPaymentId);

                paymentService.recordPayment(record);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("FAILURE");
        }

        return ResponseEntity.ok("SUCCESS");
    }




    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @PostMapping
    public ResponseEntity<String> recordPayment(@Valid @RequestBody PaymentRecord record) {
        paymentService.recordPayment(record);
        return ResponseEntity.ok("Payment recorded successfully");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @PostMapping("/by-invoice")
    public List<Payment> getPaymentsByInvoiceNumber(@RequestBody InvoiceNumberRequest request) {
        return paymentService.getPaymentsByInvoiceNumber(request.getInvoiceNumber());
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<Payment> getCurrentCustomerPayments(Authentication auth) {
        User loggedInUser = userService.getUserByIdentifier(auth.getName());
        String email = loggedInUser.getEmailId();
        return paymentService.getPaymentsByCustomerEmail(email);
    }
    
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/my-invoice-payments")
    public List<Payment> getMyPaymentsByInvoiceNumber(
            Authentication auth,
            @RequestBody InvoiceNumberRequest request
    ) {
        User loggedInUser = userService.getUserByIdentifier(auth.getName());
        String invoiceNumber = request.getInvoiceNumber();

        boolean ownsInvoice = paymentService.invoiceBelongsToCustomer(invoiceNumber, loggedInUser.getEmailId());
        if (!ownsInvoice) {
            throw new SecurityException("You are not authorized to view payments for this invoice.");
        }

        return paymentService.getPaymentsByInvoiceNumber(invoiceNumber);
    }
}
