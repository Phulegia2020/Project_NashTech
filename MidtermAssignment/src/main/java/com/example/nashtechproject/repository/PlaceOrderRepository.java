package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.PlaceOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceOrderRepository extends JpaRepository<PlaceOrder, Long> {
    List<PlaceOrder> findByStatus(String status);

    List<PlaceOrder> findByStatusNot(String status);

    Page<PlaceOrder> findByStatusNot(String status, Pageable pageable);

    List<PlaceOrder> findByIdAndStatusNot(Long id, String status);

    Page<PlaceOrder> findByIdAndStatusNot(Long id, String status, Pageable pageable);
}
