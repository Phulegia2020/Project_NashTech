package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.ProductImage;
import com.example.nashtechproject.repository.ProductImageRepository;
import com.example.nashtechproject.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    public void setProductImageRepository(ProductImageRepository productImageRepository)
    {
        this.productImageRepository = productImageRepository;
    }

    public ProductImage getProductImage (Long id)
    {
        ProductImage productImage = productImageRepository.findById(id).get();
        return productImage;
    }

    public List<ProductImage> getImagesByProduct(Long productId)
    {
        List<ProductImage> ProductImages = productImageRepository.findByProductId(productId);
        return ProductImages;
    }

    @Override
    public ProductImage saveProductImage(ProductImage img) {
        return productImageRepository.save(img);
    }

    @Override
    public void deleteProductImage(Long id) {
        ProductImage com = productImageRepository.findById(id).get();

        productImageRepository.delete(com);
    }

    @Override
    public void updateProductImage(ProductImage img) {
        productImageRepository.save(img);
    }
}
