package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Import;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.repository.ImportRepository;
import com.example.nashtechproject.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImportServiceImpl implements ImportService {
    @Autowired
    private ImportRepository importRepository;

    public void setImportRepository(ImportRepository importRepository)
    {
        this.importRepository = importRepository;
    }

    public List<Import> retrieveImports()
    {
        List<Import> imports = importRepository.findAll();
        return imports;
    }

    public List<Import> getImportsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Import> imports = importRepository.findAll(pageable).getContent();
        return imports;
    }

    public Import getImport(Long importId)
    {
        Import imp = importRepository.findById(importId).get();
        return imp;
    }

    public List<Import> getImportsDone()
    {
        List<Import> imports = importRepository.findByStatus(STATE.DONE);
        return imports;
    }

    public List<Import> getImportSearch(String id)
    {
        List<Import> list = importRepository.findByIdAndStatusNot(Long.parseLong(id), STATE.CANCEL);
        return list;
    }

    public List<Import> getImportSearchPage(String id, ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Import> imports = importRepository.findByIdAndStatusNot(Long.parseLong(id), STATE.CANCEL, pageable);
        return imports.getContent();
    }

    public List<Import> getImportStatus()
    {
        List<Import> list = importRepository.findByStatusNot(STATE.CANCEL);
        return list;
    }

    public List<Import> getImportStatusPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Import> list = importRepository.findByStatusNot(STATE.CANCEL, pageable).getContent();
        return list;
    }

    @Override
    public Import saveImport(Import imp) {
        return importRepository.save(imp);
    }

    @Override
    public void deleteImport(Long importId) {
        Import imp = importRepository.findById(importId).get();

        importRepository.delete(imp);
    }

    @Override
    public void updateImport(Import imp) {
        importRepository.save(imp);
    }
}
