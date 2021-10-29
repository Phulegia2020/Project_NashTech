package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.PlaceOrderDTO;
import com.example.nashtechproject.entity.Import;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/placeorders")
public class PlaceOrderController {
    @Autowired
    private PlaceOrderService placeOrderService;

    @Autowired
    private UserService userService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<PlaceOrder> getAllPlaceOrders()
    {
        List<PlaceOrder> placeOrders = placeOrderService.retrievePlaceOrders();
        return placeOrders.stream()
                .sorted(Comparator.comparing(PlaceOrder::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/page")
    public ResponseEntity<List<PlaceOrder>> getPlaceOrdersPages(ProductPage productPage)
    {
        return new ResponseEntity<>(placeOrderService.getPlaceOrdersPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/{placeOrderId}")
    public PlaceOrderDTO findPlaceOrder(@PathVariable Long placeOrderId)
    {
        PlaceOrder placeOrder = placeOrderService.getPlaceOrder(placeOrderId);
        if (placeOrder == null)
        {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        return convertToDTO(placeOrderService.getPlaceOrder(placeOrderId));
    }

    @GetMapping("/notDone")
    public List<PlaceOrderDTO>getPlaceOrderNotDone()
    {
        List<PlaceOrder> list = placeOrderService.getPlaceOrderNotDone();
        return list.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(PlaceOrderDTO::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public int getAllPlaceOrderSearch(@RequestParam String search)
    {
        List<PlaceOrder> list = placeOrderService.getPlaceOrderSearch(search);
        return list.size();
    }

    @GetMapping("/searchPage")
    public ResponseEntity<List<PlaceOrder>> getPlaceOrderSearchPages(@RequestParam String search, ProductPage productPage)
    {
        return new ResponseEntity<>(placeOrderService.getPlaceOrderSearchPage(search, productPage), HttpStatus.OK);
    }

    @GetMapping("/status")
    public int getAllPlaceOrder()
    {
        List<PlaceOrder> list = placeOrderService.getPlaceOrderStatus();
        return list.size();
    }

    @GetMapping("/statusPage")
    public ResponseEntity<List<PlaceOrder>> getPlaceOrderPages(ProductPage productPage)
    {
        return new ResponseEntity<>(placeOrderService.getPlaceOrderStatusPage(productPage), HttpStatus.OK);
    }

    @PostMapping()
    public PlaceOrder savePlaceOrder(@RequestBody PlaceOrderDTO placeOrder)
    {
        User u = userService.getUser(Long.valueOf(placeOrder.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        Supplier sup = supplierService.getSupplier(Long.valueOf(placeOrder.getSupplier_id()));
        if (sup == null)
        {
            throw new ObjectNotFoundException("The Supplier not found");
        }
        PlaceOrder po = convertToEntity(placeOrder);
        po.setCreateddate(LocalDateTime.now());
//        po.setStatus("Waiting");
        po.setStatus(STATE.WAITING);
//        return convertToDTO(placeOrderService.savePlaceOrder(po));
        return placeOrderService.savePlaceOrder(po);
    }

    @PutMapping("/{placeOrderId}")
    public PlaceOrderDTO updatePlaceOrder(@PathVariable(name = "placeOrderId") Long placeOrderId, @Valid @RequestBody PlaceOrderDTO placeOrderDetails)
    {
        PlaceOrder placeOrder = placeOrderService.getPlaceOrder(placeOrderId);
        if (placeOrder == null)
        {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        else
        {
            User u = userService.getUser(Long.valueOf(placeOrderDetails.getUser_id()));
            if (u == null)
            {
                throw new UserException(u.getId());
            }
            Supplier sup = supplierService.getSupplier(Long.valueOf(placeOrderDetails.getSupplier_id()));
            if (sup == null)
            {
                throw new ObjectNotFoundException(("The Supplier not found"));
            }
            placeOrder.setTotal(placeOrderDetails.getTotal());
            placeOrder.setUser(u);
            placeOrder.setSupplier(sup);
            placeOrder.setStatus(placeOrderDetails.getStatus());
            placeOrderService.updatePlaceOrder(placeOrder);
        }
        return convertToDTO(placeOrder);
    }

    @DeleteMapping("/{placeOrderId}")
    public ResponseEntity<?> deletePlaceOrder(@PathVariable(name = "placeOrderId") Long placeOrderId)
    {
        PlaceOrder placeOrder = placeOrderService.getPlaceOrder(placeOrderId);
        if (placeOrder == null)
        {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        if (placeOrder.getStatus().equals(STATE.DONE))
        {
            throw new InvalidDataException("The PlaceOrder is imported. Can not delete!");
        }
//        placeOrderService.deletePlaceOrder(placeOrderId);
        placeOrder.setStatus(STATE.CANCEL);
        placeOrderService.updatePlaceOrder(placeOrder);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private PlaceOrderDTO convertToDTO(PlaceOrder po)
    {
        PlaceOrderDTO placeOrderDTO = modelMapper.map(po, PlaceOrderDTO.class);
        String uid = String.valueOf(po.getUser().getId());
        placeOrderDTO.setUser_id(uid);
        placeOrderDTO.setSupplier_id(String.valueOf(po.getSupplier().getId()));
        return placeOrderDTO;
    }

    private PlaceOrder convertToEntity(PlaceOrderDTO po)
    {
        PlaceOrder placeOrder = modelMapper.map(po, PlaceOrder.class);
        User u = userService.getUser(Long.valueOf(po.getUser_id()));
        placeOrder.setUser(u);
        Supplier sup = supplierService.getSupplier(Long.valueOf(po.getSupplier_id()));
        placeOrder.setSupplier(sup);
        return placeOrder;
    }
}
