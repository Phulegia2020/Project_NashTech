package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.SupplierRepository;
import com.example.nashtechproject.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    public void setSupplierRepository(SupplierRepository supplierRepository)
    {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> retrieveSuppliers()
    {
        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers;
    }

    public Supplier getSupplier(Long supplierId)
    {
        Supplier sup = supplierRepository.findById(supplierId).get();
        return sup;
    }

    public List<Supplier> getSuppliersPage(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Supplier> list = supplierRepository.findAll(pageable).getContent();
        return list;
    }

    public List<Supplier> getSupplierByName(String name)
    {
        List<Supplier> suppliers = supplierRepository.findByNameContains(name);
        return suppliers;
    }

    public List<Supplier> getSupplierByNamePage(String name, ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Supplier> list = supplierRepository.findByNameContains(name, pageable).getContent();
        return list;
    }

    public boolean existPhone(String phone)
    {
        if (supplierRepository.existsByPhone(phone))
        {
            return true;
        }
        return false;
    }

    public boolean existName(String name)
    {
        if (supplierRepository.existsByName(name))
        {
            return true;
        }
        return false;
    }

    @Override
    public Supplier saveSupplier(Supplier sup) {
        return supplierRepository.save(sup);
    }

    @Override
    public void deleteSupplier(Long supplierId) {
        Supplier sup = supplierRepository.findById(supplierId).get();

        supplierRepository.delete(sup);
    }

    @Override
    public void updateSupplier(Supplier sup) {
        supplierRepository.save(sup);
    }
}
