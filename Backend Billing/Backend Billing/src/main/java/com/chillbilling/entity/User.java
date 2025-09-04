package com.chillbilling.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {
	
	public enum Role {
        ADMIN, ACCOUNTANT, CUSTOMER
    }
	
	public enum Status {
        ACTIVE, INACTIVE, BLOCKED
    }
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;
	
	@Column(nullable = false, length = 255)
	private String fullName;
	
	@Email(message = "Invalid email")
	@Column(nullable = false, unique = true, length = 255)
	private String emailId;
	
	@Pattern(regexp = "^[6-9][0-9]{9}$", message = "Invalid mobile number")
	@Column(nullable = false, unique = true, length = 10)
	private String phoneNumber;
	
	@Column(nullable = false, unique = true, length = 50)
    private String username;
	
	@Column(nullable = false)
    private String passwordHash;
	
	
	@Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.CUSTOMER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @LastModifiedDate
    private LocalDateTime updatedAt = LocalDateTime.now();
    private String verificationToken;
    private LocalDateTime tokenExpiry;
}
