package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findAllByOrderByIdAsc();

    List<Bill> findAllByBillStatusId(Long id);
}
