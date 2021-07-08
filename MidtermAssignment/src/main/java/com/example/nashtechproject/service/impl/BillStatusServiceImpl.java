package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.repository.BillStatusRepository;
import com.example.nashtechproject.service.BillStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillStatusServiceImpl implements BillStatusService {
    @Autowired
    private BillStatusRepository billStatusRepository;

    public void setBillStatusRepository(BillStatusRepository billStatusRepository)
    {
        this.billStatusRepository = billStatusRepository;
    }

    public List<BillStatus> retrieveBillStatuses()
    {
        List<BillStatus> billStatuses = billStatusRepository.findAll();
        return billStatuses;
    }

    public BillStatus getBillStatus(Long billStatusId)
    {
        BillStatus billStatus = billStatusRepository.findById(billStatusId).get();
        return billStatus;
    }

    @Override
    public BillStatus saveBillStatus(BillStatus billStatus) {
        return billStatusRepository.save(billStatus);
    }

    @Override
    public void deleteBillStatus(Long billStatusId) {
        BillStatus billStatus = billStatusRepository.findById(billStatusId).get();

        billStatusRepository.delete(billStatus);
    }

    @Override
    public void updateBillStatus(BillStatus billStatus) {
        billStatusRepository.save(billStatus);
    }
}
