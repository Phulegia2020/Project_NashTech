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
//        return billDetails.stream()
//                .map(this::convertToDTO)
//                .sorted(Comparator.comparing(BillDetailsDTO::getId).reversed())
//                .collect(Collectors.toList());
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
    public BillDetailsDTO saveBillDetails(@RequestBody BillDetailsDTO billDetails)
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
        //checkBillAndProduct(b, pro);
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

        int quatity = pro.getQuantity() - bill.getQuantity();
        pro.setQuantity(quatity);
        productService.updateProduct(pro);
        return convertToDTO(billDetailsService.saveBillDetails(bill));
    }

    @PutMapping("/{billDetailsId}")
    public BillDetailsDTO updateBillDetails(@PathVariable(name = "billDetailsId") Long billDetailsId, @Valid @RequestBody BillDetailsDTO newBillDetails)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        else
        {
//            billDetails.setBill(b);
//            billDetails.setProduct(pro);
            int oldNumber = billDetails.getQuantity();
            billDetails.setQuantity(newBillDetails.getQuantity());
            billDetailsService.updateBillDetails(billDetails);
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
                System.out.println(nq);
                pro.setQuantity(nq);
                productService.updateProduct(pro);
            }
            else if (change < 0)
            {
                int nq = pro.getQuantity() + Math.abs(change);
                System.out.println(nq);
                pro.setQuantity(nq);
                productService.updateProduct(pro);
            }
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
        return convertToDTO(billDetails);
    }

    @DeleteMapping("/{billDetailsId}")
    public HashMap<String, String> deleteBillDetails(@PathVariable(name = "billDetailsId") Long billDetailsId)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        billDetailsService.deleteBillDetails(billDetailsId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
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
