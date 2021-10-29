package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.ProductImage;

import java.util.List;

public interface ProductImageService {
    public ProductImage getProductImage (Long id);

    public List<ProductImage> getImagesByProduct(Long productId);

    public ProductImage saveProductImage(ProductImage productImage);

    public void deleteProductImage(Long id);

    public void updateProductImage(ProductImage productImage);
}
