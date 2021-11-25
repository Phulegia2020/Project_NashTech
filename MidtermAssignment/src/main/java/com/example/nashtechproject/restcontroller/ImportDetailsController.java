package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ImportDetailsDTO;
import com.example.nashtechproject.entity.*;
import com.example.nashtechproject.entity.embedded.ImportDetailsKey;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.ImportDetailsService;
import com.example.nashtechproject.service.ImportService;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/importDetails")
public class ImportDetailsController {
    @Autowired
    private ImportDetailsService importDetailsService;

    @Autowired
    private ImportService importService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PlaceOrderDetailsService placeOrderDetailsService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<ImportDetails> getAllImportDetails()
    {
        List<ImportDetails> importDetails = importDetailsService.retrieveImportDetails();
        return importDetails;
    }

    @GetMapping("/{importId}-{productId}")
    public ImportDetailsDTO findImportDetails(@PathVariable(name = "importId") Long importId, @PathVariable(name = "productId") Long productId)
    {
        ImportDetails importDetails = importDetailsService.getByImportAndProduct(importId, productId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        return convertToDTO(importDetails);
    }

    @GetMapping("/import/{importId}")
    public List<ImportDetails> getImportDetailsByImport(@PathVariable(name = "importId") Long importId)
    {
        List<ImportDetails> importDetails = importDetailsService.getImportDetailsByImport(importId);
        return importDetails;
    }

    @GetMapping("/importPage/{importId}")
    public ResponseEntity<List<ImportDetailsDTO>> getBillDetailsByBillPages(@PathVariable(name = "importId") Long importId, ProductPage productPage)
    {
        return new ResponseEntity<>(importDetailsService.getImportDetailsByImportPages(importId, productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
    }

    @PostMapping()
    public ImportDetailsDTO saveImportDetails(@RequestBody ImportDetailsDTO importDetails)
    {
        Import imp = importService.getImport(Long.valueOf(importDetails.getImp_id()));
        if (imp == null)
        {
            throw new ObjectNotFoundException("The Import not found");
        }
        Product pro = productService.getProduct(Long.valueOf(importDetails.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        if (importDetailsService.getByImportAndProduct(imp.getId(), pro.getId()) != null)
        {
            throw new InvalidDataException("The Import Details included the product");
        }
        ImportDetails impo = convertToEntity(importDetails);
        float total = imp.getTotal() + impo.getQuantity()*impo.getPrice();
        imp.setTotal(total);
        importService.updateImport(imp);
        return convertToDTO(importDetailsService.saveImportDetails(impo));
    }

    @PutMapping("/{importId}-{productId}")
    public ImportDetails updateImportDetails(@PathVariable(name = "importId") Long importId, @PathVariable(name = "productId") Long productId, @Valid @RequestBody ImportDetailsDTO newImportDetails)
    {
        ImportDetails importDetails = importDetailsService.getByImportAndProduct(importId, productId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Import Details not found");
        }
        else
        {
            Import imp = importService.getImport(importDetails.getKey().getImp().getId());

            PlaceOrderDetails pod = placeOrderDetailsService.getByPlaceOderAndProduct(imp.getPlaceOrder().getId(), importDetails.getKey().getProduct().getId());
            if (newImportDetails.getQuantity() > pod.getQuantity())
            {
                throw new InvalidDataException("The quantity imported must not more than the quantity ordered");
            }
            importDetails.setQuantity(newImportDetails.getQuantity());
            importDetailsService.updateImportDetails(importDetails);
            List<ImportDetails> list = importDetailsService.getImportDetailsByImport(importDetails.getKey().getImp().getId());
            float total = 0;
            for (int i = 0; i < list.size(); i++)
            {
                total = total + list.get(i).getQuantity()*list.get(i).getPrice();
            }
            imp.setTotal(total);
            importService.updateImport(imp);
        }
        return importDetails;
    }

    @DeleteMapping("/{importId}-{productId}")
    public ResponseEntity<?> deleteImportDetails(@PathVariable(name = "importId") Long importId, @PathVariable(name = "productId") Long productId)
    {
        ImportDetails importDetails = importDetailsService.getByImportAndProduct(importId, productId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Import Details not found");
        }
        Import imp = importService.getImport(importDetails.getKey().getImp().getId());
        float total = imp.getTotal() - importDetails.getQuantity()*importDetails.getPrice();
        imp.setTotal(total);
        importService.updateImport(imp);
        importDetailsService.deleteImportDetails(importId, productId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private ImportDetailsDTO convertToDTO(ImportDetails importDetails)
    {
        ImportDetailsDTO importDetailsDTO = modelMapper.map(importDetails, ImportDetailsDTO.class);
        importDetailsDTO.setProduct_id(String.valueOf(importDetails.getKey().getProduct().getId()));
        importDetailsDTO.setImp_id(String.valueOf(importDetails.getKey().getImp().getId()));
        importDetailsDTO.setProductImg(importDetails.getKey().getProduct().getUrl_image());
        importDetailsDTO.setProductName(importDetails.getKey().getProduct().getName());
        return importDetailsDTO;
    }

    private ImportDetails convertToEntity(ImportDetailsDTO importDetailsDTO)
    {
        ImportDetails importDetails = modelMapper.map(importDetailsDTO, ImportDetails.class);
        Import imp = importService.getImport(Long.valueOf(importDetailsDTO.getImp_id()));
        Product pro = productService.getProduct(Long.valueOf(importDetailsDTO.getProduct_id()));
        importDetails.setKey(new ImportDetailsKey(imp, pro));
        return importDetails;
    }
}
