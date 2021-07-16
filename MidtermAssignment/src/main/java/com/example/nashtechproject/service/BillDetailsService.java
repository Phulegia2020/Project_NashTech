package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.BillDetails;

import java.util.List;

public interface BillDetailsService {
    public List<BillDetails> retrieveBillDetails();

    public BillDetails getBillDetails(Long billDetailsId);

    public BillDetails getByBillAndProduct(Long bill_id, Long product_id);

    public BillDetails saveBillDetails(BillDetails billDetails);

    public void deleteBillDetails(Long billDetailsId);

    public void updateBillDetails(BillDetails billDetails);
}
