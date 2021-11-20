package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Boolean existsByNameAndStatus(String name, String status);

    Boolean existsByPhoneAndStatus(String phone, String status);

//    List<Supplier> findByNameContains(String name);
//
//    Page<Supplier> findByNameContains(String name, Pageable pageable);

    List<Supplier> findByStatus(String status);

    Page<Supplier> findByStatus(String status, Pageable pageable);

    List<Supplier> findByNameContainsAndStatus(String name, String status);

    Page<Supplier> findByNameContainsAndStatus(String name, String status, Pageable pageable);
}
