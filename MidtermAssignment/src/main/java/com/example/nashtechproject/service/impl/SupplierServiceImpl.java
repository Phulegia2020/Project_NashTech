package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.repository.SupplierRepository;
import com.example.nashtechproject.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
