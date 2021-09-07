package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
import com.example.nashtechproject.service.PlaceOrderService;
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
        return placeOrderDetails.stream().sorted(Comparator.comparing(PlaceOrderDetails::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/{placeOrderDetailsId}")
    public PlaceOrderDetailsDTO findPlaceOrderDetails(@PathVariable Long placeOrderDetailsId)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetails(placeOrderDetailsId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        return convertToDTO(placeOrderDetailsService.getPlaceOrderDetails(placeOrderDetailsId));
    }

    @GetMapping("/placeOrder/{placeOrderId}")
    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(@PathVariable(name = "placeOrderId") Long placeOrderId)
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(placeOrderId);
        return placeOrderDetails.stream()
                .sorted(Comparator.comparing(PlaceOrderDetails::getId))
                .collect(Collectors.toList());
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

    @PutMapping("/{placeOrderDetailsId}")
    public PlaceOrderDetails updatePlaceOrderDetails(@PathVariable(name = "placeOrderDetailsId") Long placeOrderDetailsId, @Valid @RequestBody PlaceOrderDetailsDTO newPlaceOrderDetails)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetails(placeOrderDetailsId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        else
        {
            placeOrderDetails.setQuantity(newPlaceOrderDetails.getQuantity());
            placeOrderDetailsService.updatePlaceOrderDetails(placeOrderDetails);
            List<PlaceOrderDetails> list = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(placeOrderDetails.getPlaceOrder().getId());
            float total = 0;
            for (int i = 0; i < list.size(); i++)
            {
                total = total + list.get(i).getQuantity()*list.get(i).getPrice();
            }
            PlaceOrder po = placeOrderService.getPlaceOrder(placeOrderDetails.getPlaceOrder().getId());
            po.setTotal(total);
            placeOrderService.updatePlaceOrder(po);
        }
        return placeOrderDetails;
    }

    @DeleteMapping("/{placeOrderDetailsId}")
    public ResponseEntity<?> deletePlaceOrderDetails(@PathVariable(name = "placeOrderDetailsId") Long placeOrderDetailsId)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetails(placeOrderDetailsId);
        if (placeOrderDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        PlaceOrder po = placeOrderService.getPlaceOrder(placeOrderDetails.getPlaceOrder().getId());
        float total = po.getTotal() - placeOrderDetails.getPrice()*placeOrderDetails.getQuantity();
        po.setTotal(total);
        placeOrderService.updatePlaceOrder(po);
        placeOrderDetailsService.deletePlaceOrderDetails(placeOrderDetailsId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private PlaceOrderDetailsDTO convertToDTO(PlaceOrderDetails placeOrderDetails)
    {
        PlaceOrderDetailsDTO placeOrderDetailsDTO = modelMapper.map(placeOrderDetails, PlaceOrderDetailsDTO.class);
        placeOrderDetailsDTO.setProduct_id(String.valueOf(placeOrderDetails.getProduct().getId()));
        placeOrderDetailsDTO.setPlaceorder_id(String.valueOf(placeOrderDetails.getPlaceOrder().getId()));
        return placeOrderDetailsDTO;
    }

    private PlaceOrderDetails convertToEntity(PlaceOrderDetailsDTO placeOrderDetailsDTO)
    {
        PlaceOrderDetails placeOrderDetails = modelMapper.map(placeOrderDetailsDTO, PlaceOrderDetails.class);
        PlaceOrder placeOrder = placeOrderService.getPlaceOrder(Long.valueOf(placeOrderDetailsDTO.getPlaceorder_id()));
        placeOrderDetails.setPlaceOrder(placeOrder);
        Product pro = productService.getProduct(Long.valueOf(placeOrderDetailsDTO.getProduct_id()));
        placeOrderDetails.setProduct(pro);
        return placeOrderDetails;
    }
}
