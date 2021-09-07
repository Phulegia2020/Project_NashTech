package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIdAndStatus(Long categoryId, String status);

    Page<Product> findByCategoryIdAndStatus(Long categoryId, String status, Pageable pageable);

    List<Product> findByNameContainsAndStatus(String pro_name, String status);

    Page<Product> findByNameContainsAndStatus(String pro_name, String status, Pageable pageable);

    Boolean existsByName(String name);

    List<Product> findByStatus(String status);

    Page<Product> findByStatus(String status, Pageable pageable);

    List<Product> findByOrderByTotalratingDesc();
}
