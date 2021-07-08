package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
