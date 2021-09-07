package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface ProductService {
    public List<Product> retrieveProducts();

    public Product getProduct(Long productId);

    public List<Product> getProductByName(String pro_name);

    public List<ProductDTO> getProductsPageByName(ProductPage productPage, String pro_name);

    public List<Product> getProductsByStatus();

    public List<ProductDTO> getProductsPage(ProductPage productPage);

    public List<ProductDTO> getProductsOnSalePage(ProductPage productPage);

    public Product saveProduct(Product product);

    public void deleteProduct(Long productId);

    public void updateProduct(Product product);

    public List<ProductDTO> getProductsByCategoryPages(Long categoryId, ProductPage productPage);

    public List<Product> getProductsByCategory(Long categoryId);

    public List<Product> getProductsByTotalRating();

    public boolean existName(String name);
}
