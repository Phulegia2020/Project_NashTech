package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface UserRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByAccount(String account);

    Boolean existsByAccount(String account);

    Boolean existsByEmail(String email);
}
