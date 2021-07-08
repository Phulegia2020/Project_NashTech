package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/bills")
public class BillController {
    @Autowired
    private BillService billService;

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
    public Bill saveBill(@RequestBody Bill Bill)
    {
        Bill.setCreateddate(LocalDateTime.now());
        return billService.saveBill(Bill);
    }

    //    @PutMapping("/{BillId}/{categoryId}")
//    public Bill updateBill(@PathVariable(name = "categoryId") Long categoryId, @PathVariable(name = "BillId") Long BillId, @Validated @RequestBody Bill BillDetails)
//    {
//        Bill Bill = BillService.getBill(BillId);
//        if (Bill == null)
//        {
//            throw new BillException(BillId);
//        }
//        else
//        {
//            Bill.setName(BillDetails.getName());
//            Bill.setDescription(BillDetails.getDescription());
//            Bill.setQuantity(BillDetails.getQuantity());
//            Bill.setPrice(BillDetails.getPrice());
//            Bill.setUpdateddate(LocalDateTime.now());
//            Bill.setCategory(BillDetails.getCategory());
//            BillService.updateBill(Bill, categoryId);
//        }
//        return Bill;
//    }
    @PutMapping("/{billId}")
    public Bill updateBill(@PathVariable(name = "billId") Long billId, @Validated @RequestBody Bill billDetails)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        else
        {
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
