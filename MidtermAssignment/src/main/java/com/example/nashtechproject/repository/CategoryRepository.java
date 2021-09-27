package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Boolean existsByName(String name);

    List<Category> findByNameContains(String name);

    Page<Category> findByNameContains(String name, Pageable pageable);
}
