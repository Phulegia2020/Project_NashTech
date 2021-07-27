package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.BillRepository;
import com.example.nashtechproject.repository.BillStatusRepository;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.service.BillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ModelMapper modelMapper;

    public void setBillRepository(BillRepository billRepository)
    {
        this.billRepository = billRepository;
    }

    public List<Bill> retrieveBills()
    {
        List<Bill> bills = billRepository.findAll();
        return bills;
    }

    public List<BillDTO> getBillsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Bill> bills = billRepository.findAll(pageable).getContent();
        List<BillDTO> billDTOS = new ArrayList<>();
        bills.forEach(b -> {
            BillDTO billDTO = modelMapper.map(b, BillDTO.class);
            String user_id = String.valueOf(b.getUser().getId());
            String billstatus_id = String.valueOf(b.getBillStatus().getId());
            billDTO.setUser_id(user_id);
            billDTO.setBillStatus_id(billstatus_id);
            billDTOS.add(billDTO);
        });
        return billDTOS;
    }

    public Bill getBill(Long billId)
    {
        Bill bill = billRepository.findById(billId).get();
        return bill;
    }

    @Override
    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId).get();

        billRepository.delete(bill);
    }

    @Override
    public void updateBill(Bill bill) {
        billRepository.save(bill);
    }
}
