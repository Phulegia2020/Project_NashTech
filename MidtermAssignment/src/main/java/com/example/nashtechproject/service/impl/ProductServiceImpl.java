package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.CategoryRepository;
import com.example.nashtechproject.repository.ProductRepository;
import com.example.nashtechproject.repository.SupplierRepository;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

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

    public List<Product> getProductByName(String pro_name)
    {
        List<Product> pro = productRepository.findByNameContainsAndStatus(pro_name, "On Sale");
        return pro;
    }

    public List<ProductDTO> getProductsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<Product> list = productRepository.findAll(pageable).getContent();
        List<ProductDTO> productDTOS = new ArrayList<>();
        list.forEach(p -> {
            ProductDTO productDTO = modelMapper.map(p, ProductDTO.class);
            String cate_id = String.valueOf(p.getCategory().getId());
            String sup_id = String.valueOf(p.getSupplier().getId());
            productDTO.setCategory_id(cate_id);
            productDTO.setSupplier_id(sup_id);
            productDTOS.add(productDTO);
        });
        return productDTOS;
    }

    public List<ProductDTO> getProductsOnSalePage(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByStatus("On Sale", pageable);
        List<ProductDTO> productDTOS = new ArrayList<>();
        page.getContent().forEach(p -> {
            ProductDTO productDTO = modelMapper.map(p, ProductDTO.class);
            String cate_id = String.valueOf(p.getCategory().getId());
            String sup_id = String.valueOf(p.getSupplier().getId());
            productDTO.setCategory_id(cate_id);
            productDTO.setSupplier_id(sup_id);
            productDTOS.add(productDTO);
        });
        return productDTOS;
    }

    public List<ProductDTO> getProductsPageByName(ProductPage productPage, String name)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByNameContainsAndStatus(name, "On Sale",pageable);
        List<ProductDTO> productDTOS = new ArrayList<>();
        page.getContent().forEach(p -> {
            ProductDTO productDTO = modelMapper.map(p, ProductDTO.class);
            String cate_id = String.valueOf(p.getCategory().getId());
            String sup_id = String.valueOf(p.getSupplier().getId());
            productDTO.setCategory_id(cate_id);
            productDTO.setSupplier_id(sup_id);
            productDTOS.add(productDTO);
        });
        return productDTOS;
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

    public List<ProductDTO> getProductsByCategoryPages(Long categoryId, ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByCategoryIdAndStatus(categoryId, "On Sale", pageable);
        List<ProductDTO> productDTOS = new ArrayList<>();
        page.getContent().forEach(p -> {
            ProductDTO productDTO = modelMapper.map(p, ProductDTO.class);
            String cate_id = String.valueOf(p.getCategory().getId());
            String sup_id = String.valueOf(p.getSupplier().getId());
            productDTO.setCategory_id(cate_id);
            productDTO.setSupplier_id(sup_id);
            productDTOS.add(productDTO);
        });
        return productDTOS;
    }

    public List<Product> getProductsByCategory(Long categoryId)
    {
        List<Product> products = productRepository.findByCategoryIdAndStatus(categoryId, "On Sale");
        return products;
    }

    public List<Product> getProductsByStatus()
    {
        List<Product> products = productRepository.findByStatus("On Sale");
        return products;
    }

    public List<Product> getProductsByTotalRating()
    {
        List<Product> products = productRepository.findByOrderByTotalratingDesc();
        return products;
    }

    public boolean existName(String name)
    {
        if (productRepository.existsByName(name))
        {
            return true;
        }
        return false;
    }
}
