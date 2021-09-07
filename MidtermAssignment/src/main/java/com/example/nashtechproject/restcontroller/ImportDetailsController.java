package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ImportDetailsDTO;
import com.example.nashtechproject.entity.Import;
import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.exception.BillDetailsException;
import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.ImportDetailsService;
import com.example.nashtechproject.service.ImportService;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
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
        return importDetails.stream().sorted(Comparator.comparing(ImportDetails::getId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/{importDetailsId}")
    public ImportDetailsDTO findImportDetails(@PathVariable Long importDetailsId)
    {
        ImportDetails importDetails = importDetailsService.getImportDetails(importDetailsId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Place Order Details not found");
        }
        return convertToDTO(importDetailsService.getImportDetails(importDetailsId));
    }

    @GetMapping("/import/{importId}")
    public List<ImportDetails> getImportDetailsByImport(@PathVariable(name = "importId") Long importId)
    {
        List<ImportDetails> importDetails = importDetailsService.getImportDetailsByImport(importId);
        return importDetails.stream()
                .sorted(Comparator.comparing(ImportDetails::getId))
                .collect(Collectors.toList());
    }

    @PostMapping()
    public ImportDetails saveImportDetails(@RequestBody ImportDetailsDTO importDetails)
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
        return importDetailsService.saveImportDetails(impo);
    }

    @PutMapping("/{importDetailsId}")
    public ImportDetails updateImportDetails(@PathVariable(name = "importDetailsId") Long importDetailsId, @Valid @RequestBody ImportDetailsDTO newImportDetails)
    {
        ImportDetails importDetails = importDetailsService.getImportDetails(importDetailsId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Import Details not found");
        }
        else
        {
            Import imp = importService.getImport(importDetails.getImp().getId());

            PlaceOrderDetails pod = placeOrderDetailsService.getByPlaceOderAndProduct(imp.getPlaceOrder().getId(), importDetails.getProduct().getId());
            if (newImportDetails.getQuantity() > pod.getQuantity())
            {
                throw new InvalidDataException("The quantity imported must not more than the quantity ordered");
            }
            importDetails.setQuantity(newImportDetails.getQuantity());
            importDetailsService.updateImportDetails(importDetails);
            List<ImportDetails> list = importDetailsService.getImportDetailsByImport(importDetails.getImp().getId());
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

    @DeleteMapping("/{importDetailsId}")
    public ResponseEntity<?> deleteImportDetails(@PathVariable(name = "importDetailsId") Long importDetailsId)
    {
        ImportDetails importDetails = importDetailsService.getImportDetails(importDetailsId);
        if (importDetails == null)
        {
            throw new ObjectNotFoundException("The Import Details not found");
        }
        Import imp = importService.getImport(importDetails.getImp().getId());
        float total = imp.getTotal() - importDetails.getQuantity()*importDetails.getPrice();
        imp.setTotal(total);
        importService.updateImport(imp);
        importDetailsService.deleteImportDetails(importDetailsId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private ImportDetailsDTO convertToDTO(ImportDetails importDetails)
    {
        ImportDetailsDTO importDetailsDTO = modelMapper.map(importDetails, ImportDetailsDTO.class);
        importDetailsDTO.setProduct_id(String.valueOf(importDetails.getProduct().getId()));
        importDetailsDTO.setImp_id(String.valueOf(importDetails.getImp().getId()));
        return importDetailsDTO;
    }

    private ImportDetails convertToEntity(ImportDetailsDTO importDetailsDTO)
    {
        ImportDetails importDetails = modelMapper.map(importDetailsDTO, ImportDetails.class);
        Import imp = importService.getImport(Long.valueOf(importDetailsDTO.getImp_id()));
        importDetails.setImp(imp);
        Product pro = productService.getProduct(Long.valueOf(importDetailsDTO.getProduct_id()));
        importDetails.setProduct(pro);
        return importDetails;
    }
}
