package com.chillbilling.service;

import com.chillbilling.entity.User;
import com.chillbilling.exception.BusinessException;
import com.chillbilling.exception.ResourceNotFoundException;
import com.chillbilling.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerCustomer(User user) {
        validateUser(user);
        user.setRole(User.Role.CUSTOMER);
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public User addUser(User user) {
        validateUser(user);
        user.setStatus(User.Status.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailId(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public void deleteUserByEmail(String email) {
        User user = getUserByEmail(email);
        userRepository.delete(user);
    }

    public User updateUser(User updatedUser) {
        User existing = getUserByEmail(updatedUser.getEmailId());

        existing.setFullName(updatedUser.getFullName());

        if (!existing.getUsername().equals(updatedUser.getUsername())
                && userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new BusinessException("Username is already taken.");
        }
        existing.setUsername(updatedUser.getUsername());
        
        if (updatedUser.getRole() != null) {
            existing.setRole(updatedUser.getRole());
        }
        
        if (updatedUser.getStatus() != null) {
            existing.setStatus(updatedUser.getStatus());
        }

        return userRepository.save(existing);
    }

    public List<User> getAllCustomers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .toList();
    }
    
    public User getCustomerByEmail(String email) {
        User user = getUserByEmail(email);
        if (user.getRole() != User.Role.CUSTOMER) {
            throw new BusinessException("Accountant can only view customers.");
        }
        return user;
    }

    public User updateCustomer(User updatedUser) {
        User existing = getUserByEmail(updatedUser.getEmailId());

        if (existing.getRole() != User.Role.CUSTOMER) {
            throw new BusinessException("Accountant can only manage customers.");
        }

        existing.setFullName(updatedUser.getFullName());

        if (!existing.getUsername().equals(updatedUser.getUsername())
                && userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new BusinessException("Username is already taken.");
        }
        existing.setUsername(updatedUser.getUsername());
        
        existing.setStatus(updatedUser.getStatus());

        return userRepository.save(existing);
    }

    public void deleteCustomerByEmail(String email) {
        User user = getUserByEmail(email);
        if (user.getRole() != User.Role.CUSTOMER) {
            throw new BusinessException("Accountant can only delete customers.");
        }
        userRepository.delete(user);
    }

    private void validateUser(User user) {
        if (userRepository.findByEmailId(user.getEmailId()).isPresent()) {
            throw new BusinessException("Email is already registered.");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new BusinessException("Username is already taken.");
        }
        
        String phone = user.getPhoneNumber();
        if (phone == null || phone.isBlank()) {
            throw new BusinessException("Phone number is required.");
        }

        if (!phone.matches("\\d{10}")) {
            throw new BusinessException("Phone number must be exactly 10 digits.");
        }

        if (userRepository.findByPhoneNumber(phone).isPresent()) {
            throw new BusinessException("Phone number is already registered.");
        }
    }
    
    public User getUserByIdentifier(String identifier) {
        if (identifier.contains("@")) {
            return userRepository.findByEmailId(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + identifier));
        } else {
            return userRepository.findByUsername(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + identifier));
        }
    }

    public Long findUserIdByEmail(String email) {
        return getUserByEmail(email).getUserId();
    }
}