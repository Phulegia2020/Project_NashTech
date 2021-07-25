package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.dto.UserDTO;
import com.example.nashtechproject.entity.Category;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.Supplier;
import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.CategoryException;
import com.example.nashtechproject.exception.SupplierException;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.UserPage;
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

    public Product getProductByName(String pro_name)
    {
        Product pro = productRepository.findByName((pro_name));
        return pro;
    }

    public List<ProductDTO> getProductsPage(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        //Page<User> users = userRepository.findAll(pageable);
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
        //return userRepository.findAll(pageable);
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
        List<Product> products = productRepository.findByCategoryId(categoryId);
        Page<Product> page = new PageImpl<>(products, pageable, pageable.getPageSize());
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
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products;
    }
}
