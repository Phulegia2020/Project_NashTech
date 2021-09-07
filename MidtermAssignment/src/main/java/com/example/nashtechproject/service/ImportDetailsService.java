package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.ImportDetails;

import java.util.List;

public interface ImportDetailsService {
    public List<ImportDetails> retrieveImportDetails();

    public ImportDetails getImportDetails(Long importDetailsId);

    public ImportDetails getByImportAndProduct(Long imp_id, Long product_id);

    public List<ImportDetails> getImportDetailsByImport(Long imp_id);

    public ImportDetails saveImportDetails(ImportDetails importDetails);

    public void deleteImportDetails(Long importDetailsId);

    public void updateImportDetails(ImportDetails importDetails);
}
