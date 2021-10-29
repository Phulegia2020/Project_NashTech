package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Import;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface ImportService {
    public List<Import> retrieveImports();

    public List<Import> getImportsPage(ProductPage productPage);

    public Import getImport(Long importId);

    public List<Import> getImportsDone();

    public List<Import> getImportSearch(String id);

    public List<Import> getImportSearchPage(String id, ProductPage productPage);

    public List<Import> getImportStatus();

    public List<Import> getImportStatusPage(ProductPage productPage);

    public Import saveImport(Import imp);

    public void deleteImport(Long importId);

    public void updateImport(Import imp);
}
