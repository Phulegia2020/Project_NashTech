package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/suppliers")
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAllSupplier()
    {
        List<Supplier> suppliers = supplierService.retrieveSuppliers();
        return suppliers;
    }

    @GetMapping("/{supplierId}")
    public Supplier findSupplier(@PathVariable Long supplierId)
    {
        Supplier sup = supplierService.getSupplier(supplierId);
        if (sup == null)
        {
            throw new SupplierException(supplierId);
        }
        return supplierService.getSupplier(supplierId);
    }

    @PostMapping
    public Supplier saveSupplier(@RequestBody Supplier supplier)
    {
//        List<Supplier> categories = SupplierService.retrieveCategories();
//        for (Supplier emp:categories) {
//            if (Supplier.getName().equals(emp.getName()))
//            {
//                throw new SupplierException(Supplier.getName());
//            }
//        }
        return supplierService.saveSupplier(supplier);
    }

    @PutMapping("/{supplierId}")
    public Supplier updateSupplier(@PathVariable(name = "supplierId") Long supplierId, @Validated @RequestBody Supplier supplierDetails)
    {
        Supplier supplier = supplierService.getSupplier(supplierId);
        if (supplier == null)
        {
            throw new SupplierException(supplierId);
        }
        else
        {
            supplier.setName(supplierDetails.getName());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setPhone(supplierDetails.getPhone());
            supplierService.updateSupplier(supplier);
        }
        return supplier;
    }

    @DeleteMapping("/{supplierId}")
    public HashMap<String, String> deleteSupplier(@PathVariable(name = "supplierId") Long supplierId)
    {
        Supplier supplier = supplierService.getSupplier(supplierId);
        if (supplier == null)
        {
            throw new SupplierException(supplierId);
        }
        supplierService.deleteSupplier(supplierId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }
}
