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
    public BillDetailsDTO saveBillDetails(@RequestBody BillDetails billDetails)
    {
        Bill b = billService.getBill(billDetails.getBill().getId());
        if (b == null)
        {
            throw new BillException(b.getId());
        }
        Product pro = productService.getProduct(billDetails.getProduct().getId());
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        billDetails.setBill(b);
        billDetails.setProduct(pro);
        return convertToDTO(billDetailsService.saveBillDetails(billDetails));
    }

    @PutMapping("/{billDetailsId}")
    public BillDetailsDTO updateBillDetails(@PathVariable(name = "billDetailsId") Long billDetailsId, @Valid @RequestBody BillDetails newBillDetails)
    {
        BillDetails billDetails = billDetailsService.getBillDetails(billDetailsId);
        if (billDetails == null)
        {
            throw new BillDetailsException(billDetailsId);
        }
        else
        {
            Bill b = billService.getBill(newBillDetails.getBill().getId());
            if (b == null)
            {
                throw new BillException(b.getId());
            }
            Product pro = productService.getProduct(newBillDetails.getProduct().getId());
            if (pro == null)
            {
                throw new ProductException(pro.getId());
            }
            billDetails.setBill(b);
            billDetails.setProduct(pro);
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
}
