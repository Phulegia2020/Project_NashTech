package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.BillDTO;
import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.dto.StatisticalDTO;
import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.*;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.page.UserPage;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.service.*;
import io.swagger.annotations.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private RatingPointService ratingPointService;

    @Autowired
    private BillService billService;

    @Autowired
    private BillDetailsService billDetailsService;

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
        ratingNow(products);
        for (int i = 0; i < products.size(); i++) {
            ProductDTO p = convertToDTO(products.get(i));
            prosDTO.add(p);
        }
        return prosDTO.stream().sorted(Comparator.comparingLong(ProductDTO::getId)).collect(Collectors.toList());
    }

    @ApiOperation(value = "Get Product By ID")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    @GetMapping("/{productId}")
    public Product findProduct(@PathVariable Long productId)
    {
        Product pro = productService.getProduct(productId);
        if (pro == null)
        {
            throw new ProductException(productId);
        }
        return pro;
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

    @GetMapping("/searchPage")
    @ApiOperation(value = "Get Product By Category Pages")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<ProductDTO>> getAllProductsByCategory(@RequestParam Long categoryId, ProductPage productPage)
    {
        Category cate = categoryService.getCategory(categoryId);
        if (cate == null)
        {
            throw new CategoryException(cate.getId());
        }
        return new ResponseEntity<>(productService.getProductsByCategoryPages(categoryId, productPage), HttpStatus.OK);
    }

    @GetMapping("/name")
    @ApiOperation(value = "Get Product By Name")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public List<ProductDTO> getProductByName(@RequestParam String name)
    {
        List<Product> pro = productService.getProductByName(name);
        ratingNow(pro);
        return pro.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(ProductDTO::getId))
                .collect(Collectors.toList());
    }

    @GetMapping("/namePage")
    @ApiOperation(value = "Get Product By Name")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<ProductDTO>> getProductByNamePage(@RequestParam String name, ProductPage productPage)
    {
        return new ResponseEntity<>(productService.getProductsPageByName(productPage, name), HttpStatus.OK);
    }

    @GetMapping("/page")
    @ApiOperation(value = "Get Products By Pages")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<ProductDTO>> getProductsPages(ProductPage productPage)
    {
        return new ResponseEntity<>(productService.getProductsPage(productPage), HttpStatus.OK);
    }

    @GetMapping("/onSale")
    public List<ProductDTO> getAllProductsByStatus()
    {
        List<ProductDTO> prosDTO = new ArrayList<>();
        List<Product> products = productService.getProductsByStatus();
        ratingNow(products);
        for (int i = 0; i < products.size(); i++) {
            ProductDTO p = convertToDTO(products.get(i));
            prosDTO.add(p);
        }
        return prosDTO.stream().sorted(Comparator.comparingLong(ProductDTO::getId)).collect(Collectors.toList());
    }

    @GetMapping("/pageOnSale")
    @ApiOperation(value = "Get Products On Sale By Pages")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public ResponseEntity<List<ProductDTO>> getProductsOnSalePages(ProductPage productPage)
    {
        return new ResponseEntity<>(productService.getProductsOnSalePage(productPage), HttpStatus.OK);
    }

    @GetMapping("/totalrating")
    public List<ProductDTO> getProductsByTotalRating()
    {
        List<ProductDTO> prosDTO = new ArrayList<>();
        List<Product> products = productService.getProductsByTotalRating();
        for (int i = 0; i < 5; i++) {
            ProductDTO p = convertToDTO(products.get(i));
            prosDTO.add(p);
        }
        return prosDTO;
    }

    @GetMapping("/topSale")
    public List<StatisticalDTO> getTopSale(@RequestParam String month)
    {
        int thang = Integer.valueOf(month);
        List<StatisticalDTO> topSale = new ArrayList<>();
//        List<Bill> billList = billService.retrieveBills();
        List<Bill> billList = billService.getBillsDone();
        List<Bill> bills = new ArrayList<>();
        for (int i = 0; i < billList.size(); i++)
        {
//            if (billList.get(i).getBillStatus().getId() == 1)
//            {
                if (billList.get(i).getCheckout_date().getMonth().getValue() == thang)
                {
                    bills.add(billList.get(i));
                }
//            }
        }
        List<Product> products = productService.retrieveProducts();
        for (int i = 0; i < products.size(); i++)
        {
            int ts = 0;
            for (int j = 0; j < bills.size(); j++)
            {
                List<BillDetails> billDetails = billDetailsService.getBillDetailsByBill(bills.get(j).getId());
                for (int k = 0; k < billDetails.size(); k++)
                {
                    if (products.get(i).getId() == billDetails.get(k).getKey().getProduct().getId())
                    {
                        ts = ts + billDetails.get(k).getQuantity();
                    }
                }
            }
            StatisticalDTO statisticalDTO = new StatisticalDTO();
            statisticalDTO.setProduct(products.get(i).getName());
            statisticalDTO.setTopSale(ts);
            topSale.add(statisticalDTO);
        }
        return topSale.stream().sorted(Comparator.comparingLong(StatisticalDTO::getTopSale).reversed()).collect(Collectors.toList());
    }

    @GetMapping("/filter")
    public int getProductFilter(@RequestParam String type)
    {
        if (type.equals("1"))
        {
            System.out.println();
            return productService.getProductPriceLess().size();
        }
        else if (type.equals("2"))
        {
            return productService.getProductPriceBetween().size();
        }
        else if (type.equals("3"))
        {
            return productService.getProductPriceGreater().size();
        }
        else
        {
            return productService.getProductsByStatus().size();
        }
    }

    @GetMapping("/pageFilter")
    public ResponseEntity<List<ProductDTO>> getProductFilterPages(@RequestParam String type, ProductPage productPage)
    {
        if (type.equals("1"))
        {
            return new ResponseEntity<>(productService.getProductPriceLess(productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
        }
        else if (type.equals("2"))
        {
            return new ResponseEntity<>(productService.getProductPriceBetween(productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
        }
        else if (type.equals("3"))
        {
            return new ResponseEntity<>(productService.getProductPriceGreater(productPage).stream().map(this::convertToDTO).collect(Collectors.toList()), HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>(productService.getProductsOnSalePage(productPage), HttpStatus.OK);
        }
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
        if (productService.existName(product.getName()))
        {
            throw new ProductException(product.getName());
        }
        Product pro = convertToEntity(product);
        pro.setCreateddate(LocalDateTime.now());
        pro.setUpdateddate(LocalDateTime.now());
        pro.setStatus(STATE.SALE);
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
    public ResponseEntity<?> deleteProduct(@PathVariable(name = "productId") Long productId)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ProductException(productId);
        }
        product.setStatus(STATE.STOP);
        productService.updateProduct(product);
//        productService.deleteProduct(productId);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
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
        product.setImageurl(productDetails.getImageurl());
        product.setTotalrating(productDetails.getTotalrating());
        product.setUpdateddate(LocalDateTime.now());
        product.setStatus(productDetails.getStatus());
    }

    private void ratingNow(List<Product> products)
    {
        for (int i = 0; i < products.size(); i++) {
            Product pro = productService.getProduct(products.get(i).getId());
            List<Rating> ratings = ratingPointService.getRatingByProduct(pro.getId());
            float total = 0;
            for (int j = 0; j < ratings.size(); j++) {
                total = total + ratings.get(j).getRatingPoint();
            }
            total = Math.round(total / ratings.size());
            pro.setTotalrating(total);
            productService.updateProduct(pro);
        }
    }
}
