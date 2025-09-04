package com.chillbilling.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chillbilling.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailId(String emailId);
    Optional<User> findByUsername(String username);
    Optional<User> findByPhoneNumber(String phoneNumber);
	Optional<User> findByVerificationToken(String token);

}
