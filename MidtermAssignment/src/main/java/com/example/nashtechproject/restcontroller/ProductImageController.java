package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ProductImageDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.ProductImage;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.ProductImageService;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/productImages")
public class ProductImageController {
    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/product/{productId}")
    public List<ProductImageDTO> getImagesByProduct(@PathVariable(name = "productId") Long productId)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ObjectNotFoundException("Could not find product with id = " + productId);
        }
        List<ProductImage> list = productImageService.getImagesByProduct(productId);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ProductImageDTO saveProductImage(@RequestBody ProductImageDTO productImageDTO)
    {
        Product pro = productService.getProduct(Long.valueOf(productImageDTO.getProduct_id()));
        if (pro == null)
        {
            throw new ProductException(pro.getId());
        }
        ProductImage productImage = convertToEntity(productImageDTO);
        return convertToDTO(productImageService.saveProductImage(productImage));
    }

    @PutMapping("/{productImageId}")
    public ProductImageDTO updateProductImage(@PathVariable(name = "productImageId") Long productImageId, @RequestBody ProductImageDTO productImageDTO)
    {
        ProductImage productImage = productImageService.getProductImage(productImageId);
        if (productImage == null)
        {
            throw new ObjectNotFoundException("Could not find product_image with id = " + productImageId);
        }
        productImage.setImagePath(productImageDTO.getImagePath());
        productImageService.updateProductImage(productImage);
        return convertToDTO(productImage);
    }

    @DeleteMapping("/{productImageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable(name = "productImageId") Long productImageId)
    {
        ProductImage productImage = productImageService.getProductImage(productImageId);
        if (productImage == null)
        {
            throw new ObjectNotFoundException("Could not find product_image with id = " + productImageId);
        }
        productImageService.deleteProductImage(productImageId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    private ProductImageDTO convertToDTO(ProductImage productImage)
    {
        ProductImageDTO productImageDTO = modelMapper.map(productImage, ProductImageDTO.class);
        productImageDTO.setProduct_id(String.valueOf(productImage.getProduct().getId()));
        return productImageDTO;
    }

    private ProductImage convertToEntity(ProductImageDTO productImageDTO)
    {
        ProductImage productImage = modelMapper.map(productImageDTO, ProductImage.class);
        Product p = productService.getProduct(Long.valueOf(productImageDTO.getProduct_id()));
        productImage.setProduct(p);
        return productImage;
    }
}
