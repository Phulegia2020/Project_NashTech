package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByAccount(String account);
}
