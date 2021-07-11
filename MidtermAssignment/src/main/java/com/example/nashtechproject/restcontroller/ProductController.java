package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.service.CategoryService;
import com.example.nashtechproject.service.ProductService;
import com.example.nashtechproject.service.SupplierService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public List<ProductDTO> getAllProducts()
    {
        List<ProductDTO> prosDTO = new ArrayList<>();
        List<Product> products = productService.retrieveProducts();
        for (int i = 0; i < products.size(); i++) {
            ProductDTO p = convertToDTO(products.get(i));
            prosDTO.add(p);
        }
        return prosDTO.stream().sorted(Comparator.comparingLong(ProductDTO::getId)).collect(Collectors.toList());
    }

    @GetMapping("/{productId}")
    public ProductDTO findProduct(@PathVariable Long productId)
    {
        Product pro = productService.getProduct(productId);
        if (pro == null)
        {
            throw new ProductException(productId);
        }
        return convertToDTO(productService.getProduct(productId));
    }

    @GetMapping("/search")
    public List<ProductDTO> getAllProductsByCategory(@RequestParam Long categoryId)
    {
        Category cate = categoryService.getCategory(categoryId);
        if (cate == null)
        {
            throw new CategoryException(cate.getId());
        }
        List<Product> products = productService.getProductsByCategory(categoryId);
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping()
    public ProductDTO saveProduct(@RequestBody Product product)
    {
        Category cate = categoryService.getCategory(product.getCategory().getId());
        if (cate == null)
        {
            throw new CategoryException(cate.getId());
        }
        Supplier sup = supplierService.getSupplier(product.getSupplier().getId());
        if (sup == null)
        {
            throw new SupplierException(sup.getId());
        }
        product.setCreateddate(LocalDateTime.now());
        product.setUpdateddate(LocalDateTime.now());
        product.setCategory(cate);
        product.setSupplier(sup);
        return convertToDTO(productService.saveProduct(product));
    }

    @PutMapping("/{productId}")
    public ProductDTO updateProduct(@PathVariable(name = "productId") Long productId, @Valid @RequestBody Product productDetails)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ProductException(productId);
        }
        else
        {
            if (categoryService.getCategory(productDetails.getCategory().getId()) == null)
            {
                throw new CategoryException(productDetails.getCategory().getId());
            }
            if (supplierService.getSupplier(productDetails.getSupplier().getId()) == null)
            {
                throw new SupplierException(productDetails.getSupplier().getId());
            }
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setQuantity(productDetails.getQuantity());
            product.setPrice(productDetails.getPrice());
            product.setUpdateddate(LocalDateTime.now());
            product.setCategory(productDetails.getCategory());
            product.setSupplier(productDetails.getSupplier());
            productService.updateProduct(product);
        }
        return convertToDTO(product);
    }

    @DeleteMapping("/{productId}")
    public HashMap<String, String> deleteProduct(@PathVariable(name = "productId") Long productId)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ProductException(productId);
        }
        productService.deleteProduct(productId);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Delete Succesfully!");
        return map;
    }

    private ProductDTO convertToDTO(Product p)
    {
        ProductDTO prodto = modelMapper.map(p, ProductDTO.class);
        String cate_id = String.valueOf(p.getCategory().getId());
        prodto.setCategory_id(cate_id);
        String sup = String.valueOf(p.getSupplier().getId());
        prodto.setSupplier_id(sup);
        return prodto;
    }
}
