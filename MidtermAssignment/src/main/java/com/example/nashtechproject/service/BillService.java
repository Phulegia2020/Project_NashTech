package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface BillService {
    public List<Bill> retrieveBills();

    public List<BillDTO> getBillsPage(ProductPage productPage);

    public Bill getBill(Long billId);

    public Bill saveBill(Bill bill);

    public void deleteBill(Long billId);

    public void updateBill(Bill bill);
}
