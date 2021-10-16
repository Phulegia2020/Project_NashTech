package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findAllByOrderByIdAsc();

//    List<Bill> findAllByBillStatusId(Long id);
    List<Bill> findAllByStatus(String status);

    List<Bill> findByUserNameContains(String name);

    Page<Bill> findByUserNameContains(String name, Pageable pageable);
}
