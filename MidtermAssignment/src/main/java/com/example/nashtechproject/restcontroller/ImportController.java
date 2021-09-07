package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ImportDTO;
import com.example.nashtechproject.entity.*;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.page.ProductPage;
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
@RequestMapping("api/imports")
public class ImportController {
    @Autowired
    private ImportService importService;

    @Autowired
    private UserService userService;

    @Autowired
    private PlaceOrderService placeOrderService;

    @Autowired
    private PlaceOrderDetailsService placeOrderDetailsService;

    @Autowired
    private ImportDetailsService importDetailsService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<Import> getAllImports()
    {
        List<Import> imports = importService.retrieveImports();
        return imports.stream()
                .sorted(Comparator.comparing(Import::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/page")
    public ResponseEntity<List<Import>> getImportsPages(ProductPage productPage)
    {
        return new ResponseEntity<>(importService.getImportsPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/{importId}")
    public ImportDTO findImport(@PathVariable Long importId)
    {
        Import imp = importService.getImport(importId);
        if (imp == null)
        {
            throw new ObjectNotFoundException("The Import not found");
        }
        return convertToDTO(importService.getImport(importId));
    }

    @GetMapping("/done")
    public List<ImportDTO> getAllImportsDone()
    {
        List<Import> imports = importService.getImportsDone();
        return imports.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(ImportDTO::getId).reversed())
                .collect(Collectors.toList());
    }

    @PostMapping()
    public ImportDTO saveImport(@RequestBody ImportDTO imp)
    {
        User u = userService.getUser(Long.valueOf(imp.getUser_id()));
        if (u == null)
        {
            throw new UserException(u.getId());
        }
        PlaceOrder po = placeOrderService.getPlaceOrder(Long.valueOf(imp.getPlaceOrder_id()));
        if (po == null) {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        List<Import> list = importService.retrieveImports();
        for (int j = 0; j < list.size(); j++)
        {
            if (list.get(j).getPlaceOrder().getId() == po.getId())
            {
                throw new InvalidDataException("The Place Order was imported");
            }
        }
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(po.getId());
        if (placeOrderDetails.size() == 0)
        {
            throw new InvalidDataException("The Place Order has not details");
        }
        Import i = convertToEntity(imp);
        i.setCreateddate(LocalDateTime.now());
        i.setStatus("Waiting");
        ImportDTO importDTO = convertToDTO(importService.saveImport(i));
        if (importDTO == null)
        {
            throw new ObjectNotFoundException("Create Import Failed");
        }
        List<PlaceOrderDetails> l = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(po.getId());
        float total = 0;
        for (int k = 0; k < l.size(); k++)
        {
            ImportDetails impd = new ImportDetails();
            impd.setImp(i);
            impd.setProduct(l.get(k).getProduct());
            impd.setQuantity(l.get(k).getQuantity());
            impd.setPrice(l.get(k).getPrice());
            importDetailsService.saveImportDetails(impd);
            total = total + impd.getQuantity()*impd.getPrice();
        }
        Import updateImp = importService.getImport(i.getId());
        updateImp.setTotal(total);
        importService.updateImport(updateImp);
        po.setStatus("Done");
        placeOrderService.updatePlaceOrder(po);
        return importDTO;
    }

    @PutMapping("/confirm/{importId}")
    public ResponseEntity<?> confirmImport(@PathVariable Long importId, @RequestBody ImportDTO importDetails)
    {
        Import imp = importService.getImport(importId);
        if (imp == null)
        {
            throw new ObjectNotFoundException("The Import not found");
        }
        else
        {
            List<ImportDetails> importDetailsList = importDetailsService.getImportDetailsByImport(imp.getId());
            for (int i = 0; i < importDetailsList.size(); i++)
            {
                Product pro = productService.getProduct(importDetailsList.get(i).getProduct().getId());
                pro.setQuantity(pro.getQuantity() + importDetailsList.get(i).getQuantity());
                productService.updateProduct(pro);
            }

            PlaceOrder placeOrder = placeOrderService.getPlaceOrder(imp.getPlaceOrder().getId());
            placeOrder.setStatus("Done");
            placeOrderService.updatePlaceOrder(placeOrder);
            imp.setStatus("Done");
            importService.updateImport(imp);
            return ResponseEntity.ok(new MessageResponse("Confirm Import successfully!"));
        }
    }

    @PutMapping("/{importId}")
    public ImportDTO updateImport(@PathVariable(name = "importId") Long importId, @Valid @RequestBody ImportDTO importDetails)
    {
        Import imp = importService.getImport(importId);
        if (imp == null)
        {
            throw new ObjectNotFoundException("The Import not found");
        }
        else
        {
            User u = userService.getUser(Long.valueOf(importDetails.getUser_id()));
            if (u == null)
            {
                throw new UserException(u.getId());
            }
            PlaceOrder po = placeOrderService.getPlaceOrder(Long.valueOf(importDetails.getPlaceOrder_id()));
            if (po == null)
            {
                throw new ObjectNotFoundException("The Place Order not found");
            }
            imp.setTotal(importDetails.getTotal());
            imp.setUser(u);
            imp.setPlaceOrder(po);
            importService.updateImport(imp);
        }
        return convertToDTO(imp);
    }

    @DeleteMapping("/{importId}")
    public ResponseEntity<?> deleteImport(@PathVariable(name = "importId") Long importId)
    {
        Import imp = importService.getImport(importId);
        if (imp == null)
        {
            throw new ObjectNotFoundException("The Place Order not found");
        }
        if (imp.getStatus().equals("Done"))
        {
            throw new InvalidDataException("The Import is checked out. Can not delete!");
        }
        List<PlaceOrderDetails> list = placeOrderDetailsService.getPlaceOrderDetailsByPlaceOrder(imp.getPlaceOrder().getId());
        for (int i = 0; i < list.size(); i++)
        {
            placeOrderDetailsService.deletePlaceOrderDetails(list.get(i).getId());
        }
        importService.deleteImport(importId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private ImportDTO convertToDTO(Import imp)
    {
        ImportDTO importDTO = modelMapper.map(imp, ImportDTO.class);
        String uid = String.valueOf(imp.getUser().getId());
        importDTO.setUser_id(uid);
        importDTO.setPlaceOrder_id(String.valueOf(imp.getPlaceOrder().getId()));
        return importDTO;
    }

    private Import convertToEntity(ImportDTO importDTO)
    {
        Import imp = modelMapper.map(importDTO, Import.class);
        User u = userService.getUser(Long.valueOf(importDTO.getUser_id()));
        imp.setUser(u);
        PlaceOrder po = placeOrderService.getPlaceOrder(Long.valueOf(importDTO.getPlaceOrder_id()));
        imp.setPlaceOrder(po);
        return imp;
    }
}
