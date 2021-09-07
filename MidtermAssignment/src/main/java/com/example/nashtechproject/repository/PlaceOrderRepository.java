package com.example.nashtechproject.repository;

import com.example.nashtechproject.dto.PlaceOrderDTO;
import com.example.nashtechproject.entity.PlaceOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceOrderRepository extends JpaRepository<PlaceOrder, Long> {
    List<PlaceOrder> findByStatus(String status);
}
