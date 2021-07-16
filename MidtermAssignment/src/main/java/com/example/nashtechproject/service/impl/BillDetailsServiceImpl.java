package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.repository.BillDetailsRepository;
import com.example.nashtechproject.service.BillDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
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

    public BillDetails getBillDetails(Long billDetailsId)
    {
        BillDetails billDetails = billDetailsRepository.findById(billDetailsId).get();
        return billDetails;
    }

    public BillDetails getByBillAndProduct(Long bill_id, Long product_id)
    {
        BillDetails billDetails = billDetailsRepository.findByBillIdAndProductId(bill_id, product_id);
        return billDetails;
    }

    @Override
    public BillDetails saveBillDetails(BillDetails billDetails) {
        return billDetailsRepository.save(billDetails);
    }

    @Override
    public void deleteBillDetails(Long billDetailsId) {
        BillDetails billDetails = billDetailsRepository.findById(billDetailsId).get();

        billDetailsRepository.delete(billDetails);
    }

    @Override
    public void updateBillDetails(BillDetails billDetails) {
        billDetailsRepository.save(billDetails);
    }
}
