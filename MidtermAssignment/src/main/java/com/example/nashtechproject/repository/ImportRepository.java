package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportRepository extends JpaRepository<Import, Long> {
    List<Import> findByStatus(String status);

    List<Import> findByStatusNot(String status);

    Page<Import> findByStatusNot(String status, Pageable pageable);

    List<Import> findByIdAndStatusNot(Long id, String status);

    Page<Import> findByIdAndStatusNot(Long id, String status, Pageable pageable);
}
