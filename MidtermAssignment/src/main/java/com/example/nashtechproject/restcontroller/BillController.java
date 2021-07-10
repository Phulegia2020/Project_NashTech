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
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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
    public BillDTO saveBill(@RequestBody Bill bill)
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
        bill.setCheckout_date(LocalDateTime.now());
        return convertToDTO(billService.saveBill(bill));
    }

    @PutMapping("/{billId}")
    public BillDTO updateBill(@PathVariable(name = "billId") Long billId, @Valid @RequestBody Bill billDetails)
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
        billDTO.getUser().setRole_id(String.valueOf(b.getUser().getRole().getId()));
        return billDTO;
    }
}
