package com.chillbilling.controller;

import com.chillbilling.dto.EmailRequest;
import com.chillbilling.entity.User;
import com.chillbilling.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerCustomer(@RequestBody User user) {
        return userService.registerCustomer(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<String> addUser(@RequestBody User user) {
        userService.addUser(user);
        return ResponseEntity.ok("User registered successfully");
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/by-email")
    public User getUserByEmail(@RequestBody EmailRequest request) {
    	
        return userService.getUserByEmail(request.getEmail());
    }
    
    @PreAuthorize("hasRole('ACCOUNTANT')")
    @GetMapping("/my-profile")
    public User getUserByUsername(Authentication auth) {
    	User existingUser=userService.getUserByIdentifier(auth.getName());
        return userService.getUserByEmail(existingUser.getEmailId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<String> updateUser(@RequestBody User updatedUser) {
        userService.updateUser(updatedUser);
        return ResponseEntity.ok("User updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<String> deleteUserByEmail(@RequestBody EmailRequest request) {
        userService.deleteUserByEmail(request.getEmail());
        return ResponseEntity.ok("User deleted successfully");
    }

    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    @PostMapping("/customers")
    public ResponseEntity<String> createCustomer(@RequestBody User user) {
        user.setRole(User.Role.CUSTOMER);
        userService.addUser(user);
        return ResponseEntity.ok("Customer created successfully");
    }

    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        return userService.getAllCustomers();
    }

    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    @PostMapping("/customers/by-email")
    public User getCustomerByEmail(@RequestBody EmailRequest request) {
        return userService.getCustomerByEmail(request.getEmail());
    }

    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    @PutMapping("/customers")
    public ResponseEntity<String> updateCustomer(@RequestBody User updatedUser) {
        userService.updateCustomer(updatedUser);
        return ResponseEntity.ok("Customer updated successfully");
    }

    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    @DeleteMapping("/customers")
    public ResponseEntity<String> deleteCustomerByEmail(@RequestBody EmailRequest request) {
        userService.deleteCustomerByEmail(request.getEmail());
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public User getMyProfile(Authentication auth) {
    	String email = auth.getName();
        return userService.getUserByEmail(email);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(@RequestBody User updatedUser, Authentication auth) {
        User loggedInUser = userService.getUserByIdentifier(auth.getName());
        updatedUser.setEmailId(loggedInUser.getEmailId());
        userService.updateCustomer(updatedUser);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
