package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public List<Product> findByCategoryId(Long categoryId);
}
