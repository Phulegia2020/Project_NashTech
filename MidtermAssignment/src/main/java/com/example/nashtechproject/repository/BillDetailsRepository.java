package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.embedded.BillDetailsKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillDetailsRepository extends JpaRepository<BillDetails, BillDetailsKey> {
    BillDetails findByKey_Bill_IdAndKey_Product_Id(Long bill_id, Long product_id);

    List<BillDetails> findByKey_Bill_Id(Long bill_id);

    Page<BillDetails> findByKey_Bill_Id(Long bill_id, Pageable pageable);
}
