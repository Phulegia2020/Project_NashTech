package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
