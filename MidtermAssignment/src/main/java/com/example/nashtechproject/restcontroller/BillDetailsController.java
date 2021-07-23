package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDetailsDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.exception.BillDetailsException;
import com.example.nashtechproject.exception.BillException;
import com.example.nashtechproject.exception.ProductException;
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
    public List<BillDetailsDTO> getAllBillDetails()
    {
        List<BillDetails> billDetails = billDetailsService.retrieveBillDetails();
        return billDetails.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(BillDetailsDTO::getId).reversed())
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
//            Bill b = billService.getBill(Long.valueOf(newBillDetails.getBill_id()));
//            if (b == null)
//            {
//                throw new BillException(b.getId());
//            }
//            Product pro = productService.getProduct(Long.valueOf(newBillDetails.getProduct_id()));
//            if (pro == null)
//            {
//                throw new ProductException(pro.getId());
//            }
//            billDetails.setBill(b);
//            billDetails.setProduct(pro);
            billDetails.setQuantity(newBillDetails.getQuantity());
            billDetailsService.updateBillDetails(billDetails);
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
