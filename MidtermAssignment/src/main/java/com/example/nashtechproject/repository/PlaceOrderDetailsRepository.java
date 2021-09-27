package com.example.nashtechproject.repository;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.entity.embedded.PlaceOrderDetailsKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceOrderDetailsRepository extends JpaRepository<PlaceOrderDetails, PlaceOrderDetailsKey> {
    public PlaceOrderDetails findByKey_PlaceOrder_IdAndKey_Product_Id(Long po_id, Long pro_id);

    List<PlaceOrderDetails> findByKey_PlaceOrder_Id(Long po_id);

    Page<PlaceOrderDetails> findByKey_PlaceOrder_Id(Long pro_id, Pageable pageable);
}
