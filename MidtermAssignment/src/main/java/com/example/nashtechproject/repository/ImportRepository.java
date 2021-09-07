package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Import;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportRepository extends JpaRepository<Import, Long> {
    List<Import> findByStatus(String status);
}
