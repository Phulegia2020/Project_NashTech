package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface BillDetailsService {
    public List<BillDetails> retrieveBillDetails();

    public BillDetails getByBillAndProduct(Long bill_id, Long product_id);

    public List<BillDetails> getBillDetailsByBill(Long billId);

    public List<BillDetails> getBillDetailsByBillPages(Long billId, ProductPage productPage);

    public BillDetails saveBillDetails(BillDetails billDetails);

    public void deleteBillDetails(Long bill_id, Long product_id);

    public void updateBillDetails(BillDetails billDetails);
}
