package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDetailsDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.exception.BillDetailsException;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.BillDetailsService;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/billDetails")
public class BillDetailsController {
    @Autowired
    private BillDetailsService billDetailsService;

    @Autowired
    private BillService billService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<BillDetails> getAllBillDetails()
    {
        List<BillDetails> billDetails = billDetailsService.retrieveBillDetails();
        return billDetails.stream().sorted(Comparator.comparing(BillDetails::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/{billDetailsId}")
    public BillDetailsDTO findBillDetails(@PathVariable Long billDetailsId)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        return convertToDTO(billDetailsService.getBillDetails(billDetailsId));
    }

    @GetMapping("/bill/{billId}")
    public List<BillDetails> getBillDetailsByBill(@PathVariable(name = "billId") Long billId)
    {
        List<BillDetails> billDetails = billDetailsService.getBillDetailsByBill(billId);
        return billDetails.stream()
                .sorted(Comparator.comparing(BillDetails::getId))
                .collect(Collectors.toList());
    }

    @PostMapping()
    public BillDetails saveBillDetails(@RequestBody BillDetailsDTO billDetails)
    {
        Bill b = billService.getBill(Long.valueOf(billDetails.getBill_id()));
        if (b == null)
        {
            throw new BillException(b.getId());
        }
        Product pro = productService.getProduct(Long.valueOf(billDetails.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        if (billDetailsService.getByBillAndProduct(b.getId(), pro.getId()) != null)
        {
            throw new BillDetailsException(b.getId(), pro.getId());
        }
        BillDetails bill = convertToEntity(billDetails);
        float total = b.getTotal() + bill.getQuantity()*bill.getProduct().getPrice();
        b.setTotal(total);
        billService.updateBill(b);
        if (pro.getQuantity() == 0 || pro.getQuantity() < bill.getQuantity())
        {
            throw new BillDetailsException(pro.getQuantity());
        }

        int quantity = pro.getQuantity() - bill.getQuantity();
        pro.setQuantity(quantity);
        productService.updateProduct(pro);
        return billDetailsService.saveBillDetails(bill);
    }

    @PutMapping("/{billDetailsId}")
    public BillDetails updateBillDetails(@PathVariable(name = "billDetailsId") Long billDetailsId, @Valid @RequestBody BillDetailsDTO newBillDetails)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        else
        {
            if (billDetails.getProduct().getId() != Long.valueOf(newBillDetails.getProduct_id()))
            {
                Product pro = productService.getProduct(billDetails.getProduct().getId());
                pro.setQuantity(pro.getQuantity() + billDetails.getQuantity());
                productService.updateProduct(pro);
                Product pro1 = productService.getProduct(Long.valueOf(newBillDetails.getProduct_id()));
                if (pro1.getQuantity() == 0 || pro1.getQuantity() < newBillDetails.getQuantity())
                {
                    throw new BillDetailsException(pro1.getQuantity());
                }
                pro1.setQuantity(pro1.getQuantity() - newBillDetails.getQuantity());
                productService.updateProduct(pro1);
                billDetails.setProduct(pro1);
            }
            else
            {
                int oldNumber = billDetails.getQuantity();

                Product pro = productService.getProduct(billDetails.getProduct().getId());
                if (pro.getQuantity() == 0 || pro.getQuantity() < newBillDetails.getQuantity())
                {
                    throw new BillDetailsException(pro.getQuantity());
                }
                int change = newBillDetails.getQuantity() - oldNumber;
                if (change > 0)
                {
                    if (pro.getQuantity() < change)
                    {
                        throw new BillDetailsException(change);
                    }
                    int nq = pro.getQuantity() - change;
                    pro.setQuantity(nq);
                    productService.updateProduct(pro);
                }
                else if (change < 0)
                {
                    int nq = pro.getQuantity() + Math.abs(change);
                    pro.setQuantity(nq);
                    productService.updateProduct(pro);
                }
            }
            billDetails.setQuantity(newBillDetails.getQuantity());
            billDetailsService.updateBillDetails(billDetails);
            List<BillDetails> list = billDetailsService.getBillDetailsByBill(billDetails.getBill().getId());
            float total = 0;
            for (int i = 0; i < list.size(); i++)
            {
                total = total + list.get(i).getQuantity()*list.get(i).getProduct().getPrice();
            }
            Bill b = billService.getBill(billDetails.getBill().getId());
            b.setTotal(total);
            billService.updateBill(b);
        }
        return billDetails;
    }

    @DeleteMapping("/{billDetailsId}")
    public ResponseEntity<?> deleteBillDetails(@PathVariable(name = "billDetailsId") Long billDetailsId)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        Bill b = billService.getBill(billDetails.getBill().getId());
        Product p = productService.getProduct(billDetails.getProduct().getId());
        float total = b.getTotal() - billDetails.getQuantity()*p.getPrice();
        int quantity = p.getQuantity() + billDetails.getQuantity();
        p.setQuantity(quantity);
        productService.updateProduct(p);
        b.setTotal(total);
        billService.updateBill(b);
        billDetailsService.deleteBillDetails(billDetailsId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private BillDetailsDTO convertToDTO(BillDetails billDetails)
    {
        BillDetailsDTO billDetailsDTO = modelMapper.map(billDetails, BillDetailsDTO.class);
        billDetailsDTO.setProduct_id(String.valueOf(billDetails.getProduct().getId()));
        billDetailsDTO.setBill_id(String.valueOf(billDetails.getBill().getId()));
        return billDetailsDTO;
    }

    private BillDetails convertToEntity(BillDetailsDTO b)
    {
        BillDetails billDetails = modelMapper.map(b, BillDetails.class);
        Bill bill = billService.getBill(Long.valueOf(b.getBill_id()));
        billDetails.setBill(bill);
        Product pro = productService.getProduct(Long.valueOf(b.getProduct_id()));
        billDetails.setProduct(pro);
        return billDetails;
    }

    private void checkBillAndProduct(Bill b, Product p)
    {
        List<BillDetails> list = billDetailsService.retrieveBillDetails();
        for (int i = 0; i < list.size(); i++)
        {
            if (list.get(i).getBill().getId().equals(b.getId()) && list.get(i).getProduct().getId().equals(p.getId()))
            {
                throw new BillDetailsException(b.getId(), p.getId());
            }
        }
    }
}
