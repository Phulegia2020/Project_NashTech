package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.BillStatusService;
import com.example.nashtechproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/bills")
public class BillController {
    @Autowired
    private BillService billService;

    @Autowired
    private UserService userService;

    @Autowired
    private BillStatusService billStatusService;

    @GetMapping
    public List<Bill> getAllBills()
    {
        List<Bill> bills = billService.retrieveBills();
        return bills;
    }

    @GetMapping("/{billId}")
    public Bill findBill(@PathVariable Long billId)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        return billService.getBill(billId);
    }

    @PostMapping()
    public Bill saveBill(@RequestBody Bill bill)
    {
        User u = userService.getUser(bill.getUser().getId());
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        BillStatus bs = billStatusService.getBillStatus(bill.getBillStatus().getId());
        if (bs == null)
        {
            throw new BillStatusException(bs.getId());
        }
        bill.setUser(u);
        bill.setBillStatus(bs);
        bill.setCreateddate(LocalDateTime.now());
        return billService.saveBill(bill);
    }

    @PutMapping("/{billId}")
    public Bill updateBill(@PathVariable(name = "billId") Long billId, @Valid @RequestBody Bill billDetails)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        else
        {
            User u = userService.getUser(billDetails.getUser().getId());
            if (u == null)
            {
                throw new UserException(u.getId());
            }
            BillStatus bs = billStatusService.getBillStatus(billDetails.getBillStatus().getId());
            if (bs == null)
            {
                throw new BillStatusException(bs.getId());
            }
            bill.setTotal(billDetails.getTotal());
            bill.setCheckout_date(LocalDateTime.now());
            bill.setUser(billDetails.getUser());
            bill.setBillStatus(billDetails.getBillStatus());
            billService.updateBill(bill);
        }
        return bill;
    }

    @DeleteMapping("/{billId}")
    public HashMap<String, String> deleteBill(@PathVariable(name = "billId") Long billId)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        billService.deleteBill(billId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }
}
