package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.entity.embedded.ImportDetailsKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportDetailsRepository extends JpaRepository<ImportDetails, ImportDetailsKey> {
    ImportDetails findByKey_Imp_IdAndKey_Product_Id(Long imp_id, Long pro_id);

    List<ImportDetails> findByKey_Imp_Id(Long imp_id);

    Page<ImportDetails> findByKey_Imp_Id(Long imp_id, Pageable pageable);
}
