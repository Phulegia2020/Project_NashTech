package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Boolean existsByName(String name);

    Boolean existsByPhone(String phone);

    List<Supplier> findByNameContains(String name);

    Page<Supplier> findByNameContains(String name, Pageable pageable);
}
