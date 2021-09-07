package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.dto.MailRequestDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.BillStatus;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.BillDetailsService;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.BillStatusService;
import com.example.nashtechproject.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/bills")
@Api(tags = "Bill Rest Controller")
public class BillController {
    @Autowired
    private BillService billService;

    @Autowired
    private BillDetailsService billDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private BillStatusService billStatusService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    @ApiOperation(value = "Get all bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<Bill> getAllBills()
    {
        List<Bill> bills = billService.retrieveBills();
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/page")
    @ApiOperation(value = "Get all Bill By Page")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<Bill>> getBillsPages(ProductPage productPage)
    {
        return new ResponseEntity<>(billService.getBillsPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/{billId}")
    @ApiOperation(value = "Get all bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public BillDTO findBill(@PathVariable Long billId)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        return convertToDTO(billService.getBill(billId));
    }

    @GetMapping("/income")
    @ApiOperation(value = "Get all bill income")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public float getAllBillsIncome()
    {
        float income = 0;
        List<Bill> bills = billService.getBillsDone();
        for (int i = 0; i < bills.size(); i++)
        {
            income = income + bills.get(i).getTotal();
        }
        return income;
    }

    @GetMapping("/done")
    @ApiOperation(value = "Get all bill done")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<BillDTO> getAllBillsDone()
    {
        List<Bill> bills = billService.getBillsDone();
        return bills.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(BillDTO::getId).reversed())
                .collect(Collectors.toList());
    }

    @PostMapping()
    @ApiOperation(value = "Create New bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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
        Bill b = convertToEntity(bill);
        b.setCreateddate(LocalDateTime.now());
        return convertToDTO(billService.saveBill(b));
    }

    @PutMapping("/{billId}")
    @ApiOperation(value = "Update bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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
            bill.setUser(u);
            bill.setBillStatus(bs);
            billService.updateBill(bill);
        }
        return convertToDTO(bill);
    }

    @PutMapping("/confirm/{billId}")
    @ApiOperation(value = "Update bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public BillDTO confirmBill(@PathVariable(name = "billId") Long billId, @RequestBody BillDTO billDetails)
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
            bill.setCheckout_date(LocalDateTime.now());
            bill.setBillStatus(bs);
            billService.updateBill(bill);
        }
        return convertToDTO(bill);
    }

    @DeleteMapping("/{billId}")
    @ApiOperation(value = "Delete bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<?> deleteBill(@PathVariable(name = "billId") Long billId)
    {
        Bill bill = billService.getBill(billId);
        if (bill == null)
        {
            throw new BillException(billId);
        }
        if (bill.getBillStatus().getId() == 1)
        {
            throw new InvalidDataException("The bill is checked out. Can not delete!");
        }
        billService.deleteBill(billId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    @PostMapping("/sendmail/{bill}")
    public ResponseEntity<String> sendMail(@PathVariable(name = "bill") Long bill, @RequestBody MailRequestDTO mailRequest) {
        String content = mailRequest.getContent();
        List<BillDetails> list = billDetailsService.getBillDetailsByBill(bill);
        for (int i = 0; i < list.size(); i++)
        {
            content = content + "<br><br><b>Product:</b> " + list.get(i).getProduct().getName() + " <br><b>Quantity:</b> " + String.format("%,d", list.get(i).getQuantity()) + " <br><b>Price:</b> " + String.format("%,d", list.get(i).getProduct().getPrice())  + " VND";
        }
        mailRequest.setContent(content);
        billService.sendEmail(mailRequest);
        return new ResponseEntity<>("Email has been sent to: " + mailRequest.getTo(),HttpStatus.OK);
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
        BillStatus billStatus = billStatusService.getBillStatus(Long.valueOf(b.getBillStatus_id()));
        bill.setBillStatus(billStatus);
        return bill;
    }
}
