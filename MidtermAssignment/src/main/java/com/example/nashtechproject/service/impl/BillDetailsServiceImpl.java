package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.BillDetailsRepository;
import com.example.nashtechproject.service.BillDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillDetailsServiceImpl implements BillDetailsService {
    @Autowired
    private BillDetailsRepository billDetailsRepository;

    public void setBillDetailsRepository(BillDetailsRepository billDetailsRepository)
    {
        this.billDetailsRepository = billDetailsRepository;
    }

    public List<BillDetails> retrieveBillDetails()
    {
        List<BillDetails> billDetails = billDetailsRepository.findAll();
        return billDetails;
    }

    public BillDetails getByBillAndProduct(Long bill_id, Long product_id)
    {
        BillDetails billDetails = billDetailsRepository.findByKey_Bill_IdAndKey_Product_Id(bill_id, product_id);
        return billDetails;
    }

    public List<BillDetails> getBillDetailsByBill(Long billdetailsId)
    {
        List<BillDetails> billDetails = billDetailsRepository.findByKey_Bill_Id(billdetailsId);
        return billDetails;
    }

    public List<BillDetails> getBillDetailsByBillPages(Long billId, ProductPage productPage)
    {
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize());
        Page<BillDetails> page = billDetailsRepository.findByKey_Bill_Id(billId, pageable);
        return page.getContent();
    }

    @Override
    public BillDetails saveBillDetails(BillDetails billDetails) {
        return billDetailsRepository.save(billDetails);
    }

    @Override
    public void deleteBillDetails(Long bill_id, Long product_id) {
        BillDetails billDetails = billDetailsRepository.findByKey_Bill_IdAndKey_Product_Id(bill_id, product_id);

        billDetailsRepository.delete(billDetails);
    }

    @Override
    public void updateBillDetails(BillDetails billDetails) {
        billDetailsRepository.save(billDetails);
    }
}
