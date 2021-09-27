package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDetailsDTO;
import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.BillDetails;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.embedded.BillDetailsKey;
import com.example.nashtechproject.exception.*;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.BillDetailsService;
import com.example.nashtechproject.service.BillService;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        return billDetails;
    }

    @GetMapping("/{billId}-{productId}")
    public BillDetailsDTO findBillDetails(@PathVariable(name = "billId") Long billId, @PathVariable(name = "productId") Long productId)
    {
        BillDetails billDetails = billDetailsService.getByBillAndProduct(billId, productId);
        if (billDetails == null)
        {
            throw new ObjectNotFoundException("Could not find rating with bill_id = " + billId + " and product_id = " + productId);
        }
        return convertToDTO(billDetails);
    }

    @GetMapping("/bill/{billId}")
    public List<BillDetails> getBillDetailsByBill(@PathVariable(name = "billId") Long billId)
    {
        List<BillDetails> billDetails = billDetailsService.getBillDetailsByBill(billId);
        return billDetails;
    }

    @GetMapping("/billPage/{billId}")
    public ResponseEntity<List<BillDetails>> getBillDetailsByBillPages(@PathVariable(name = "billId") Long billId, ProductPage productPage)
    {
        return new ResponseEntity<>(billDetailsService.getBillDetailsByBillPages(billId, productPage), HttpStatus.OK);
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
        if (pro.getQuantity() == 0 || pro.getQuantity() < bill.getQuantity())
        {
            throw new BillDetailsException(pro.getQuantity());
        }
        float total = b.getTotal() + bill.getQuantity()*bill.getKey().getProduct().getPrice();
        b.setTotal(total);
        billService.updateBill(b);
        int quantity = pro.getQuantity() - bill.getQuantity();
        pro.setQuantity(quantity);
        productService.updateProduct(pro);
        return billDetailsService.saveBillDetails(bill);
    }

    @PutMapping("/{billId}-{productId}")
    public BillDetails updateBillDetails(@PathVariable(name = "billId") Long billId, @PathVariable(name = "productId") Long productId, @Valid @RequestBody BillDetailsDTO newBillDetails)
    {
        BillDetails billDetails = billDetailsService.getByBillAndProduct(billId, productId);
        if (billDetails == null)
        {
            throw new ObjectNotFoundException("Could not find rating with bill_id = " + billId + " and product_id = " + productId);
        }
        else
        {
            if (billDetails.getKey().getProduct().getId() != Long.valueOf(newBillDetails.getProduct_id()))
            {
                Product pro = productService.getProduct(billDetails.getKey().getProduct().getId());
                pro.setQuantity(pro.getQuantity() + billDetails.getQuantity());
                productService.updateProduct(pro);
                Product pro1 = productService.getProduct(Long.valueOf(newBillDetails.getProduct_id()));
                if (pro1.getQuantity() == 0 || pro1.getQuantity() < newBillDetails.getQuantity())
                {
                    throw new BillDetailsException(pro1.getQuantity());
                }
                pro1.setQuantity(pro1.getQuantity() - newBillDetails.getQuantity());
                productService.updateProduct(pro1);
                billDetails.getKey().setProduct(pro1);
            }
            else
            {
                int oldNumber = billDetails.getQuantity();

                Product pro = productService.getProduct(billDetails.getKey().getProduct().getId());
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
            List<BillDetails> list = billDetailsService.getBillDetailsByBill(billDetails.getKey().getBill().getId());
            float total = 0;
            for (int i = 0; i < list.size(); i++)
            {
                total = total + list.get(i).getQuantity()*list.get(i).getKey().getProduct().getPrice();
            }
            Bill b = billService.getBill(billDetails.getKey().getBill().getId());
            b.setTotal(total);
            billService.updateBill(b);
        }
        return billDetails;
    }

    @DeleteMapping("/{billId}-{productId}")
    public ResponseEntity<?> deleteBillDetails(@PathVariable(name = "billId") Long billId, @PathVariable(name = "productId") Long productId)
    {
        BillDetails billDetails = billDetailsService.getByBillAndProduct(billId, productId);
        if (billDetails == null)
        {
            throw new ObjectNotFoundException("Could not find rating with bill_id = " + billId + " and product_id = " + productId);
        }
        Bill b = billService.getBill(billDetails.getKey().getBill().getId());
        Product p = productService.getProduct(billDetails.getKey().getProduct().getId());
        float total = b.getTotal() - billDetails.getQuantity()*p.getPrice();
        int quantity = p.getQuantity() + billDetails.getQuantity();
        p.setQuantity(quantity);
        productService.updateProduct(p);
        b.setTotal(total);
        billService.updateBill(b);
        billDetailsService.deleteBillDetails(billId, productId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private BillDetailsDTO convertToDTO(BillDetails billDetails)
    {
        BillDetailsDTO billDetailsDTO = modelMapper.map(billDetails, BillDetailsDTO.class);
        billDetailsDTO.setProduct_id(String.valueOf(billDetails.getKey().getProduct().getId()));
        billDetailsDTO.setBill_id(String.valueOf(billDetails.getKey().getBill().getId()));
        return billDetailsDTO;
    }

    private BillDetails convertToEntity(BillDetailsDTO b)
    {
        BillDetails billDetails = modelMapper.map(b, BillDetails.class);
        Bill bill = billService.getBill(Long.valueOf(b.getBill_id()));
        Product pro = productService.getProduct(Long.valueOf(b.getProduct_id()));
        billDetails.setKey(new BillDetailsKey(bill, pro));
        return billDetails;
    }

    private void checkBillAndProduct(Bill b, Product p)
    {
        List<BillDetails> list = billDetailsService.retrieveBillDetails();
        for (int i = 0; i < list.size(); i++)
        {
            if (list.get(i).getKey().getBill().getId().equals(b.getId()) && list.get(i).getKey().getProduct().getId().equals(p.getId()))
            {
                throw new BillDetailsException(b.getId(), p.getId());
            }
        }
    }
}
