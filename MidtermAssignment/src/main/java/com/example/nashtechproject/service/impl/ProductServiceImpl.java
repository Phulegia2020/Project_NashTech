package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.repository.CategoryRepository;
import com.example.nashtechproject.repository.ProductRepository;
import com.example.nashtechproject.repository.SupplierRepository;
import com.example.nashtechproject.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    public void setProductRepository(ProductRepository productRepository)
    {
        this.productRepository = productRepository;
    }

    public List<Product> retrieveProducts()
    {
        List<Product> products = productRepository.findAll();
        return products;
    }

    public Product getProduct(Long productId)
    {
        Product pro = productRepository.findById(productId).get();
        return pro;
    }

    public Product getProductByName(String pro_name)
    {
        Product pro = productRepository.findByName((pro_name));
        return pro;
    }

    @Override
    public Product saveProduct(Product pro) {
        return productRepository.save(pro);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product pro = productRepository.findById(productId).get();

        productRepository.delete(pro);
    }

    @Override
    public void updateProduct(Product pro) {
        productRepository.save(pro);
    }

    public List<Product> getProductsByCategory(Long categoryId)
    {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products;
    }
}
