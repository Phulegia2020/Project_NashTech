package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Product;

import java.util.List;

public interface ProductService {
    public List<Product> retrieveProducts();

    public Product getProduct(Long productId);

    public Product saveProduct(Product product);

    public void deleteProduct(Long productId);

    public void updateProduct(Product product);

    public List<Product> getProductsByCategory(Long categoryId);
}
