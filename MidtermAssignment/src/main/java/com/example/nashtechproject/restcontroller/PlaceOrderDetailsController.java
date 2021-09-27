package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.embedded.PlaceOrderDetailsKey;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
import com.example.nashtechproject.service.PlaceOrderService;
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
@RequestMapping("api/placeorderDetails")
public class PlaceOrderDetailsController {
    @Autowired
    private PlaceOrderDetailsService placeOrderDetailsService;

    @Autowired
    private PlaceOrderService placeOrderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<PlaceOrderDetails> getAllPlaceOrderDetails()
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsService.retrievePlaceOrderDetails();
        return placeOrderDetails;
    }

    @GetMapping("/{placeOrderId}-{productId}")
    public PlaceOrderDetailsDTO findPlaceOrderDetails(@PathVariable(name = "placeOrderId") Long placeOrderId, @PathVariable(name = "productId") Long productId)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getByPlaceOderAndProduct(placeOrderId, productId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        return convertToDTO(placeOrderDetails);
    }

    @GetMapping("/placeOrder/{placeOrderId}")
    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(@PathVariable(name = "placeOrderId") Long placeOrderId)
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(placeOrderId);
        return placeOrderDetails;
    }

    @GetMapping("/placeOrderPage/{placeOrderId}")
    public ResponseEntity<List<PlaceOrderDetails>> getBillDetailsByBillPages(@PathVariable(name = "placeOrderId") Long placeOrderId, ProductPage productPage)
    {
        return new ResponseEntity<>(placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrderPages(placeOrderId, productPage), HttpStatus.OK);
    }

    @PostMapping()
    public PlaceOrderDetails savePlaceOrderDetails(@RequestBody PlaceOrderDetailsDTO placeOrderDetails)
    {
        PlaceOrder po = placeOrderService.getPlaceOrder(Long.valueOf(placeOrderDetails.getPlaceorder_id()));
        if (po == null)
        {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        Product pro = productService.getProduct(Long.valueOf(placeOrderDetails.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        if (placeOrderDetailsService.getByPlaceOderAndProduct(po.getId(), pro.getId()) != null)
        {
            throw new InvalidDataException("The Place Order Details included the product");
        }
        PlaceOrderDetails placeOrder = convertToEntity(placeOrderDetails);
        float total = po.getTotal() + placeOrder.getQuantity()*placeOrder.getPrice();
        po.setTotal(total);
        placeOrderService.updatePlaceOrder(po);
        return placeOrderDetailsService.savePlaceOrderDetails(placeOrder);
    }

    @PutMapping("/{placeOrderId}-{productId}")
    public PlaceOrderDetails updatePlaceOrderDetails(@PathVariable(name = "placeOrderId") Long placeOrderId, @PathVariable(name = "productId") Long productId, @Valid @RequestBody PlaceOrderDetailsDTO newPlaceOrderDetails)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getByPlaceOderAndProduct(placeOrderId, productId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        else
        {
//            if (placeOrderDetails.getKey().getProduct().getId() == Long.valueOf(newPlaceOrderDetails.getProduct_id()))
//            {
//                throw new InvalidDataException("The Place Order had already this product");
//            }
            placeOrderDetails.setQuantity(newPlaceOrderDetails.getQuantity());
            placeOrderDetails.setPrice(newPlaceOrderDetails.getPrice());
            placeOrderDetailsService.updatePlaceOrderDetails(placeOrderDetails);
            List<PlaceOrderDetails> list = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(placeOrderDetails.getKey().getPlaceOrder().getId());
            float total = 0;
            for (int i = 0; i < list.size(); i++)
            {
                total = total + list.get(i).getQuantity()*list.get(i).getPrice();
            }
            PlaceOrder po = placeOrderService.getPlaceOrder(placeOrderDetails.getKey().getPlaceOrder().getId());
            po.setTotal(total);
            placeOrderService.updatePlaceOrder(po);
        }
        return placeOrderDetails;
    }

    @DeleteMapping("/{placeOrderId}-{productId}")
    public ResponseEntity<?> deletePlaceOrderDetails(@PathVariable(name = "placeOrderId") Long placeOrderId, @PathVariable(name = "productId") Long productId)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getByPlaceOderAndProduct(placeOrderId, productId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        PlaceOrder po = placeOrderService.getPlaceOrder(placeOrderDetails.getKey().getPlaceOrder().getId());
        float total = po.getTotal() - placeOrderDetails.getPrice()*placeOrderDetails.getQuantity();
        po.setTotal(total);
        placeOrderService.updatePlaceOrder(po);
        placeOrderDetailsService.deletePlaceOrderDetails(placeOrderId, productId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private PlaceOrderDetailsDTO convertToDTO(PlaceOrderDetails placeOrderDetails)
    {
        PlaceOrderDetailsDTO placeOrderDetailsDTO = modelMapper.map(placeOrderDetails, PlaceOrderDetailsDTO.class);
        placeOrderDetailsDTO.setProduct_id(String.valueOf(placeOrderDetails.getKey().getProduct().getId()));
        placeOrderDetailsDTO.setPlaceorder_id(String.valueOf(placeOrderDetails.getKey().getPlaceOrder().getId()));
        return placeOrderDetailsDTO;
    }

    private PlaceOrderDetails convertToEntity(PlaceOrderDetailsDTO placeOrderDetailsDTO)
    {
        PlaceOrderDetails placeOrderDetails = modelMapper.map(placeOrderDetailsDTO, PlaceOrderDetails.class);
        PlaceOrder placeOrder = placeOrderService.getPlaceOrder(Long.valueOf(placeOrderDetailsDTO.getPlaceorder_id()));
        Product pro = productService.getProduct(Long.valueOf(placeOrderDetailsDTO.getProduct_id()));
        placeOrderDetails.setKey(new PlaceOrderDetailsKey(placeOrder, pro));
        return placeOrderDetails;
    }
}
