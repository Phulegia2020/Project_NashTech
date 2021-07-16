package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.BillDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillDetailsRepository extends JpaRepository<BillDetails, Long> {
    public BillDetails findByBillIdAndProductId(Long bill_id, Long product_id);
}
