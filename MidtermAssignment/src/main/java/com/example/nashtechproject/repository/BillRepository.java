package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findAllByOrderByIdAsc();

    List<Bill> findAllByStatus(String status);

    List<Bill> findByStatusNot(String status);

    Page<Bill> findByStatusNot(String status, Pageable pageable);

    List<Bill> findByUserNameContains(String name);

    Page<Bill> findByUserNameContains(String name, Pageable pageable);
}
