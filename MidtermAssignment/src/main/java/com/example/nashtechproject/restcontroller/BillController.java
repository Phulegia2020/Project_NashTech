package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.dto.MailRequestDTO;
import com.example.nashtechproject.dto.RevenueDTO;
import com.example.nashtechproject.dto.StatisticalDTO;
import com.example.nashtechproject.entity.*;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.BillStatusException;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.*;
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
import java.util.ArrayList;
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

//    @Autowired
//    private BillStatusService billStatusService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ImportService importService;

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

    @GetMapping("/fullName")
    public int getBillByUsername(@RequestParam String name)
    {
        List<Bill> bills = billService.getBillByUsername(name);
        return bills.size();
    }

    @GetMapping("/fullNamePage")
    public ResponseEntity<List<Bill>> getBillByUsernamePages(ProductPage productPage, @RequestParam String name)
    {
        return new ResponseEntity<>(billService.getBillByUsernamePage(name, productPage), HttpStatus.OK);
    }

    @GetMapping("/profit")
    @ApiOperation(value = "Get all bill profit")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<BillDTO> getAllBillsProfit(@RequestParam String month, @RequestParam String quy, @RequestParam String year)
    {
        float income = 0;
        List<Bill> bills = billService.getBillsDone();
        List<Bill> list = new ArrayList<>();
        for (int i = 0; i < bills.size(); i++)
        {
            //income = income + bills.get(i).getTotal();
            if (bills.get(i).getCheckout_date().getYear() == Integer.valueOf(year))
            {
                if (quy.equals("1"))
                {
                    if (1 <= bills.get(i).getCheckout_date().getMonth().getValue() && bills.get(i).getCheckout_date().getMonth().getValue() <= 3)
                    {
                        list.add(bills.get(i));
                    }
                }
                else if (quy.equals("2"))
                {
                    if (4 <= bills.get(i).getCheckout_date().getMonth().getValue() && bills.get(i).getCheckout_date().getMonth().getValue() <= 6)
                    {
                        list.add(bills.get(i));
                    }
                }
                else if (quy.equals("3"))
                {
                    if (7 <= bills.get(i).getCheckout_date().getMonth().getValue() && bills.get(i).getCheckout_date().getMonth().getValue() <= 9)
                    {
                        list.add(bills.get(i));
                    }
                }
                else if (quy.equals("4"))
                {
                    if (10 <= bills.get(i).getCheckout_date().getMonth().getValue() && bills.get(i).getCheckout_date().getMonth().getValue() <= 12) {
                        list.add(bills.get(i));
                    }
                }
                else
                {
                    if (!month.equals("0"))
                    {
                        if (bills.get(i).getCheckout_date().getMonth().getValue() == Integer.valueOf(month))
                        {
                            list.add(bills.get(i));
                        }
                    }
                    else
                    {
                        list.add(bills.get(i));
                    }
                }
            }
        }
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/revenue")
    public List<RevenueDTO> getRevenue()
    {
        List<RevenueDTO> revenue = new ArrayList<>();
        List<Bill> billList = billService.getBillsDone();
        List<Import> importList = importService.getImportsDone();

        for (int i = 0; i < 12; i++)
        {
            float rev = 0;
            for (int j = 0; j < billList.size(); j++)
            {
                if (billList.get(j).getCheckout_date().getMonth().getValue() == (i+1)  && billList.get(j).getCheckout_date().getYear() == LocalDateTime.now().getYear())
                {
                    rev = rev + billList.get(j).getTotal();
                }
            }
            float expense = 0;
            for (int k = 0; k < importList.size(); k++)
            {
                if (importList.get(k).getCreateddate().getMonth().getValue() == (i+1) && importList.get(k).getCreateddate().getYear() == LocalDateTime.now().getYear())
                {
                    expense = expense + importList.get(k).getTotal();
                }
            }
            rev = rev / 1000000;
            RevenueDTO revenueDTO = new RevenueDTO();
            revenueDTO.setName(String.valueOf(i+1));
            revenueDTO.setRevenue(rev);
            revenueDTO.setExpense(expense);
            revenueDTO.setProfit(rev*1000000 - expense);
            revenue.add(revenueDTO);
        }
        return revenue;
    }

    @PostMapping()
    @ApiOperation(value = "Create New bill")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public Bill saveBill(@RequestBody BillDTO bill)
    {
        User u = userService.getUser(Long.valueOf(bill.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
//        BillStatus bs = billStatusService.getBillStatus(Long.valueOf(bill.getBillStatus_id()));
//        if (bs == null)
//        {
//            throw new BillStatusException(bs.getId());
//        }
        Bill b = convertToEntity(bill);
        b.setCreateddate(LocalDateTime.now());
        b.setStatus(STATE.WAITING);
//        return convertToDTO(billService.saveBill(b));
        return billService.saveBill(b);
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
//            BillStatus bs = billStatusService.getBillStatus(Long.valueOf(billDetails.getBillStatus_id()));
//            if (bs == null)
//            {
//                throw new BillStatusException(bs.getId());
//            }
            bill.setTotal(billDetails.getTotal());
            bill.setUser(u);
//            bill.setBillStatus(bs);
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
//            BillStatus bs = billStatusService.getBillStatus(Long.valueOf(billDetails.getBillStatus_id()));
//            if (bs == null)
//            {
//                throw new BillStatusException(bs.getId());
//            }
            bill.setCheckout_date(LocalDateTime.now());
//            bill.setBillStatus(bs);
            List<BillDetails> list = billDetailsService.getBillDetailsByBill(billId);
            for (int i = 0; i < list.size(); i++)
            {
                Product pro = productService.getProduct(list.get(i).getKey().getProduct().getId());
                pro.setQuantity(pro.getQuantity() - list.get(i).getQuantity());
                productService.updateProduct(pro);
            }
            bill.setStatus(STATE.DONE);
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
        if (bill.getStatus().equals(STATE.DONE))
        {
            throw new InvalidDataException("The bill is checked out. Can not delete!");
        }
//        billService.deleteBill(billId);
        bill.setStatus(STATE.CANCEL);
        billService.updateBill(bill);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    @PostMapping("/sendmail/{bill}")
    public ResponseEntity<String> sendMail(@PathVariable(name = "bill") Long bill, @RequestBody MailRequestDTO mailRequest) {
        String content = mailRequest.getContent();
        Bill b = billService.getBill(bill);

        content = content + "<b>Thông tin khách hàng</b><br/>Người nhận: " + b.getUser().getName() + "<br/>"
                            + "Địa chỉ nhận hàng: " + b.getUser().getAddress() + "<br/>"
                            + "Số điện thoại: " + b.getUser().getPhone() + "<br/>"
                            + "<b>Chi tiết đơn hàng</b>"
                            + "<table width='600px' style='border:2px solid black; border-collapse: collapse;'>"
                            + "<tr align='center'>"
                            + "<td><b>Máy </b></td>"
                            + "<td><b>Số Lượng</b></td>"
                            + "<td><b>Giá</b></td>"
                            + "</tr>";
        List<BillDetails> list = billDetailsService.getBillDetailsByBill(bill);
        for (int i = 0; i < list.size(); i++)
        {
            //content = content + "<br><br><b>Product:</b> " + list.get(i).getKey().getProduct().getName() + " <br><b>Quantity:</b> " + String.format("%,d", list.get(i).getQuantity()) + " <br><b>Price:</b> " + String.format("%,d", list.get(i).getKey().getProduct().getPrice())  + " VND";
            content = content + "<tr align='center' style='border-top: 1px solid #ddd'> "+"<td>"  + list.get(i).getKey().getProduct().getName()+ "</td>"+ "<td>"  + String.format("%,d", list.get(i).getQuantity()) + "</td>"+ "<td>" + String.format("%,d", list.get(i).getKey().getProduct().getPrice())  + " VND"+ "</td>"+"</tr>";
        }
//        content = content + "</table> <p>Tổng giá trị đơn hàng: </p><b>" + String.format("%,f", b.getTotal()) + " VNĐ</b>";
        content = content + "</table>";
        mailRequest.setContent(content);
        billService.sendEmail(mailRequest);
        return new ResponseEntity<>("Email has been sent to: " + mailRequest.getTo(),HttpStatus.OK);
    }

    private BillDTO convertToDTO(Bill b)
    {
        BillDTO billDTO = modelMapper.map(b, BillDTO.class);
        String uid = String.valueOf(b.getUser().getId());
        billDTO.setUser_id(uid);
//        billDTO.setBillStatus_id(String.valueOf(b.getBillStatus().getId()));
        return billDTO;
    }

    private Bill convertToEntity(BillDTO b)
    {
        Bill bill = modelMapper.map(b, Bill.class);
        User u = userService.getUser(Long.valueOf(b.getUser_id()));
        bill.setUser(u);
//        BillStatus billStatus = billStatusService.getBillStatus(Long.valueOf(b.getBillStatus_id()));
//        bill.setBillStatus(billStatus);
        return bill;
    }
}
