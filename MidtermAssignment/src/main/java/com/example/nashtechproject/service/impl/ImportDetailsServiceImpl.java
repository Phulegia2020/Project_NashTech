package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.ImportDetailsRepository;
import com.example.nashtechproject.service.ImportDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ImportDetailsServiceImpl implements ImportDetailsService {
    @Autowired
    private ImportDetailsRepository importDetailsRepository;

    public void setImportDetailsRepository(ImportDetailsRepository importDetailsRepository)
    {
        this.importDetailsRepository = importDetailsRepository;
    }

    public List<ImportDetails> retrieveImportDetails()
    {
        List<ImportDetails> importDetails = importDetailsRepository.findAll();
        return importDetails;
    }

    public ImportDetails getByImportAndProduct(Long imp_id, Long product_id)
    {
        ImportDetails importDetails = importDetailsRepository.findByKey_Imp_IdAndKey_Product_Id(imp_id, product_id);
        return importDetails;
    }

    public List<ImportDetails> getImportDetailsByImport(Long imp_id)
    {
        List<ImportDetails> importDetails = importDetailsRepository.findByKey_Imp_Id(imp_id);
        return importDetails;
    }

    public List<ImportDetails> getImportDetailsByImportPages(Long imp_id, ProductPage productPage)
    {
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize());
        Page<ImportDetails> page = importDetailsRepository.findByKey_Imp_Id(imp_id, pageable);
        return page.getContent();
    }

    @Override
    public ImportDetails saveImportDetails(ImportDetails importDetails) {
        return importDetailsRepository.save(importDetails);
    }

    @Override
    public void deleteImportDetails(Long imp_id, Long product_id) {
        ImportDetails importDetails = importDetailsRepository.findByKey_Imp_IdAndKey_Product_Id(imp_id, product_id);

        importDetailsRepository.delete(importDetails);
    }

    @Override
    public void updateImportDetails(ImportDetails importDetails) {
        importDetailsRepository.save(importDetails);
    }
}
