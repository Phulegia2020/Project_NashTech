package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Supplier;

import java.util.List;

public interface SupplierService {
    public List<Supplier> retrieveSuppliers();

    public Supplier getSupplier(Long supplierId);

    public Supplier saveSupplier(Supplier supplier);

    public void deleteSupplier(Long supplierId);

    public void updateSupplier(Supplier supplier);
}
