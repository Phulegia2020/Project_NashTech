package com.example.nashtechproject.repository;

import com.example.nashtechproject.dto.ProductDTO;
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

    Optional<Product> findByNameAndStatus(String name, String status);

    Boolean existsByName(String name);

    List<Product> findByStatus(String status);

    Page<Product> findByStatus(String status, Pageable pageable);

    List<Product> findByOrderByTotalratingDesc();

    List<Product> findByPriceLessThanAndStatus(int price, String status);

    Page<Product> findByPriceLessThanAndStatus(int price, String status, Pageable pageable);

    List<Product> findByPriceBetweenAndStatus(int price1, int price2, String status);

    Page<Product> findByPriceBetweenAndStatus(int price1, int price2, String status, Pageable pageable);

    List<Product> findByPriceGreaterThanAndStatus(int price, String status);

    Page<Product> findByPriceGreaterThanAndStatus(int price, String status, Pageable pageable);
}
