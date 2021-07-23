package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.BillStatusService;
import com.example.nashtechproject.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/bills")
public class BillController {
    @Autowired
    private BillService billService;

    @Autowired
    private UserService userService;

    @Autowired
    private BillStatusService billStatusService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<BillDTO> getAllBills()
    {
        List<Bill> bills = billService.retrieveBills();
        return bills.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(BillDTO::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/{billId}")
    public BillDTO findBill(@PathVariable Long billId)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        return convertToDTO(billService.getBill(billId));
    }

    @PostMapping()
    public BillDTO saveBill(@RequestBody BillDTO bill)
    {
        User u = userService.getUser(Long.valueOf(bill.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        BillStatus bs = billStatusService.getBillStatus(Long.valueOf(bill.getBillStatus_id()));
        if (bs == null)
        {
            throw new BillStatusException(bs.getId());
        }
//        bill.setUser(u);
//        bill.setBillStatus(bs);
        Bill b = convertToEntity(bill);
        b.setCreateddate(LocalDateTime.now());
        b.setCheckout_date(LocalDateTime.now());
        return convertToDTO(billService.saveBill(b));
    }

    @PutMapping("/{billId}")
    public BillDTO updateBill(@PathVariable(name = "billId") Long billId, @Valid @RequestBody BillDTO billDetails)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        else
        {
            User u = userService.getUser(Long.valueOf(billDetails.getUser_id()));
            if (u == null)
            {
                throw new UserException(u.getId());
            }
            BillStatus bs = billStatusService.getBillStatus(Long.valueOf(billDetails.getBillStatus_id()));
            if (bs == null)
            {
                throw new BillStatusException(bs.getId());
            }
            bill.setTotal(billDetails.getTotal());
            bill.setCheckout_date(LocalDateTime.now());
            bill.setUser(u);
            bill.setBillStatus(bs);
            billService.updateBill(bill);
        }
        return convertToDTO(bill);
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
    private BillDTO convertToDTO(Bill b)
    {
        BillDTO billDTO = modelMapper.map(b, BillDTO.class);
        String uid = String.valueOf(b.getUser().getId());
        billDTO.setUser_id(uid);
        billDTO.setBillStatus_id(String.valueOf(b.getBillStatus().getId()));
        return billDTO;
    }

    private Bill convertToEntity(BillDTO b)
    {
        Bill bill = modelMapper.map(b, Bill.class);
        User u = userService.getUser(Long.valueOf(b.getUser_id()));
        bill.setUser(u);
//        BillStatus billStatus = billStatusService.getBillStatus(Long.valueOf(b.getBillStatus_id()));
        BillStatus billStatus = billStatusService.getBillStatus(3L);
        bill.setBillStatus(billStatus);
        return bill;
    }
}
