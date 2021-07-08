package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Bill;

import java.util.List;

public interface BillService {
    public List<Bill> retrieveBills();

    public Bill getBill(Long billId);

    public Bill saveBill(Bill bill);

    public void deleteBill(Long billId);

    public void updateBill(Bill bill);
}
