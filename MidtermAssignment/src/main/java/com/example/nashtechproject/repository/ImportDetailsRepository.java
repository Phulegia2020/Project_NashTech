package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportDetailsRepository extends JpaRepository<ImportDetails, Long> {
    public ImportDetails findByImpIdAndProductId(Long imp_id, Long pro_id);

    List<ImportDetails> findByImpId(Long imp_id);
}
