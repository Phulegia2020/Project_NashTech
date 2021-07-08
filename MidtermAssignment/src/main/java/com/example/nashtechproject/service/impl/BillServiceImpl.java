package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.repository.BillRepository;
import com.example.nashtechproject.repository.BillStatusRepository;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BillStatusRepository billStatusRepository;

    public void setBillRepository(BillRepository billRepository)
    {
        this.billRepository = billRepository;
    }

    public List<Bill> retrieveBills()
    {
        List<Bill> bills = billRepository.findAll();
        return bills;
    }

    public Bill getBill(Long billId)
    {
        Bill bill = billRepository.findById(billId).get();
        return bill;
    }

    @Override
    public Bill saveBill(Bill bill) {
        User u = userRepository.findById(bill.getUser().getId()).get();
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        BillStatus bs = billStatusRepository.findById(bill.getBillStatus().getId()).get();
        if (bs == null)
        {
            throw new BillStatusException(bs.getId());
        }
        bill.setUser(u);
        bill.setBillStatus(bs);
        return billRepository.save(bill);
    }

    @Override
    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId).get();

        billRepository.delete(bill);
    }

    @Override
    public void updateBill(Bill bill) {
        User u = userRepository.findById(bill.getUser().getId()).get();
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        BillStatus bs = billStatusRepository.findById(bill.getBillStatus().getId()).get();
        if (bs == null)
        {
            throw new BillStatusException(bs.getId());
        }
        bill.setUser(u);
        bill.setBillStatus(bs);
        billRepository.save(bill);
    }
}
