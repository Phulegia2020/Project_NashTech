package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.exception.ProductException;
import com.example.nashtechproject.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts()
    {
        List<Product> products = productService.retrieveProducts();
        return products;
    }

    @GetMapping("/{productId}")
    public Product findProduct(@PathVariable Long productId)
    {
        Product pro = productService.getProduct(productId);
        if (pro == null)
        {
            throw new ProductException(productId);
        }
        return productService.getProduct(productId);
    }

    @PostMapping
    public Product saveProduct(@RequestBody Product product)
    {
//        List<Product> products = productService.retrieveProducts();
//        for (Product emp:categories) {
//            if (Product.getName().equals(emp.getName()))
//            {
//                throw new ProductException(Product.getName());
//            }
//        }
        return productService.saveProduct(product);
    }

    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable(name = "productId") Long productId, @Validated @RequestBody Product productDetails)
    {
        Product product = productService.getProduct(productId);
        if (product == null)
        {
            throw new ProductException(productId);
        }
        else
        {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setQuantity(productDetails.getQuantity());
            product.setPrice(productDetails.getPrice());
            product.setUpdateddate(LocalDateTime.now());
            productService.updateProduct(product);
        }
        return product;
    }

    @DeleteMapping("/{ProductId}")
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
}
