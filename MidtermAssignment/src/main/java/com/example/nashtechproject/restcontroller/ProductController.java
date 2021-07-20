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
import io.swagger.annotations.*;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/products")
@Api(tags = "Products Rest Controller")
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
    @ApiOperation(value = "Get all products")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    @ApiImplicitParams(
            value = {
                    @ApiImplicitParam(name = "page", value = "page number start from 0", dataType = "integer",
                            examples = @Example(@ExampleProperty("1")), paramType = "query"),
                    @ApiImplicitParam(name = "size", value = "maximum number of item in page", dataType = "integer",
                            examples = @Example(@ExampleProperty("40")), paramType = "query"),
            }
    )
    public List<ProductDTO> getAllProducts()
    {
        List<ProductDTO> prosDTO = new ArrayList<>();
        List<Product> products = productService.retrieveProducts();
        for (int i = 0; i < products.size(); i++) {
            ProductDTO p = convertToDTO(products.get(i));
            prosDTO.add(p);
        }
        return prosDTO.stream().sorted(Comparator.comparingLong(ProductDTO::getId)).collect(Collectors.toList());
        //return prosDTO;
    }

    @ApiOperation(value = "Get Product By ID")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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
    @ApiOperation(value = "Get Product By Category")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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
                .sorted(Comparator.comparingLong(ProductDTO::getId))
                .collect(Collectors.toList());
    }

    @ApiOperation(value = "Create new Product")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    @PostMapping()
    public ProductDTO saveProduct(@RequestBody ProductDTO product)
    {
        Category cate = categoryService.getCategory(Long.valueOf(product.getCategory_id()));
        if (cate == null)
        {
            throw new CategoryException(cate.getId());
        }
        Supplier sup = supplierService.getSupplier(Long.valueOf(product.getSupplier_id()));
        if (sup == null)
        {
            throw new SupplierException(sup.getId());
        }
        Product pro = convertToEntity(product);
        pro.setCreateddate(LocalDateTime.now());
        pro.setUpdateddate(LocalDateTime.now());
//        pro.setCategory(cate);
//        pro.setSupplier(sup);
        return convertToDTO(productService.saveProduct(pro));
    }

    @ApiOperation(value = "Update Product")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    @PutMapping("/{productId}")
    public ProductDTO updateProduct(@PathVariable(name = "productId") Long productId, @Valid @RequestBody ProductDTO productDetails)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ProductException(productId);
        }
        else
        {
            Category cate = categoryService.getCategory(Long.valueOf(productDetails.getCategory_id()));
            if (cate == null)
            {
                throw new CategoryException(cate.getId());
            }
            Supplier sup = supplierService.getSupplier(Long.valueOf(productDetails.getSupplier_id()));
            if (sup == null)
            {
                throw new SupplierException(sup.getId());
            }
            ProductUpdate(product, productDetails);
            product.setCategory(cate);
            product.setSupplier(sup);
            productService.updateProduct(product);
        }
        return convertToDTO(product);
    }

    @ApiOperation(value = "Delete Product")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
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

    private Product convertToEntity(ProductDTO p)
    {
        Product pro = modelMapper.map(p, Product.class);
        Category c = categoryService.getCategory(Long.valueOf(p.getCategory_id()));
        pro.setCategory(c);
        Supplier s = supplierService.getSupplier(Long.valueOf(p.getSupplier_id()));
        pro.setSupplier(s);
        return pro;
    }

    private void ProductUpdate(Product product, ProductDTO productDetails)
    {
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setQuantity(productDetails.getQuantity());
        product.setPrice(productDetails.getPrice());
        product.setUpdateddate(LocalDateTime.now());
    }
}
