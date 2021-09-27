package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface ImportDetailsService {
    public List<ImportDetails> retrieveImportDetails();

    public ImportDetails getByImportAndProduct(Long imp_id, Long product_id);

    public List<ImportDetails> getImportDetailsByImport(Long imp_id);

    public List<ImportDetails> getImportDetailsByImportPages(Long imp_id, ProductPage productPage);

    public ImportDetails saveImportDetails(ImportDetails importDetails);

    public void deleteImportDetails(Long imp_id, Long product_id);

    public void updateImportDetails(ImportDetails importDetails);
}
