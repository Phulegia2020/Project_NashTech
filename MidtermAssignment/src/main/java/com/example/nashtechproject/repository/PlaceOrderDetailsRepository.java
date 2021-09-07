package com.example.nashtechproject.repository;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceOrderDetailsRepository extends JpaRepository<PlaceOrderDetails, Long> {
    public PlaceOrderDetails findByPlaceOrderIdAndProductId(Long po_id, Long pro_id);

    List<PlaceOrderDetails> findByPlaceOrderId(Long po_id);

    List<PlaceOrderDetails> findByProductId(Long pro_id);
}
