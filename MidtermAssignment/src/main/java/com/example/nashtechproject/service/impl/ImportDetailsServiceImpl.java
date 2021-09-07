package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.repository.ImportDetailsRepository;
import com.example.nashtechproject.service.ImportDetailsService;
import com.example.nashtechproject.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
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

    public ImportDetails getImportDetails(Long importDetailsId)
    {
        ImportDetails importDetails = importDetailsRepository.findById(importDetailsId).get();
        return importDetails;
    }

    public ImportDetails getByImportAndProduct(Long imp_id, Long product_id)
    {
        ImportDetails importDetails = importDetailsRepository.findByImpIdAndProductId(imp_id, product_id);
        return importDetails;
    }

    public List<ImportDetails> getImportDetailsByImport(Long imp_id)
    {
        List<ImportDetails> importDetails = importDetailsRepository.findByImpId(imp_id);
        return importDetails;
    }

    @Override
    public ImportDetails saveImportDetails(ImportDetails importDetails) {
        return importDetailsRepository.save(importDetails);
    }

    @Override
    public void deleteImportDetails(Long importDetailsId) {
        ImportDetails importDetails = importDetailsRepository.findById(importDetailsId).get();

        importDetailsRepository.delete(importDetails);
    }

    @Override
    public void updateImportDetails(ImportDetails importDetails) {
        importDetailsRepository.save(importDetails);
    }
}
