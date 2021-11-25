package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.repository.ProductRepository;
import com.example.nashtechproject.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

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
        List<Product> pro = productRepository.findByNameContainsAndStatus(pro_name, STATE.SALE);
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
        Page<Product> page = productRepository.findByStatus(STATE.SALE, pageable);
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
        Page<Product> page = productRepository.findByNameContainsAndStatus(name, STATE.SALE,pageable);
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

    public ProductDTO getProductChatBot(String name)
    {
        Product pro = productRepository.findByNameAndStatus(name, STATE.SALE).orElse(null);
        ProductDTO productDTO = modelMapper.map(pro, ProductDTO.class);
        String cate_id = String.valueOf(pro.getCategory().getId());
        String sup_id = String.valueOf(pro.getSupplier().getId());
        productDTO.setCategory_id(cate_id);
        productDTO.setSupplier_id(sup_id);
        return productDTO;
    }

    public List<Product> getProductPriceLess()
    {
        List<Product> list = productRepository.findByPriceLessThanAndStatus(STATE.PRICE_FILTER1, STATE.SALE);
        return list;
    }

    public List<Product> getProductPriceLess(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByPriceLessThanAndStatus(STATE.PRICE_FILTER1, STATE.SALE, pageable);
        return page.getContent();
    }

    public List<Product> getProductPriceBetween()
    {
        List<Product> list = productRepository.findByPriceBetweenAndStatus(STATE.PRICE_FILTER1, STATE.PRICE_FILTER2, STATE.SALE);
        return list;
    }

    public List<Product> getProductPriceBetween(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByPriceBetweenAndStatus(STATE.PRICE_FILTER1, STATE.PRICE_FILTER2, STATE.SALE, pageable);
        return page.getContent();
    }

    public List<Product> getProductPriceGreater()
    {
        List<Product> list = productRepository.findByPriceGreaterThanAndStatus(STATE.PRICE_FILTER2, STATE.SALE);
        return list;
    }

    public List<Product> getProductPriceGreater(ProductPage productPage)
    {
        Sort sort = Sort.by(productPage.getSortDirection(), productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<Product> page = productRepository.findByPriceGreaterThanAndStatus(STATE.PRICE_FILTER2, STATE.SALE, pageable);
        return page.getContent();
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
        Page<Product> page = productRepository.findByCategoryIdAndStatus(categoryId, STATE.SALE, pageable);
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
        List<Product> products = productRepository.findByCategoryIdAndStatus(categoryId, STATE.SALE);
        return products;
    }

    public List<Product> getProductsByStatus()
    {
        List<Product> products = productRepository.findByStatus(STATE.SALE);
        return products;
    }

    public List<Product> getProductsByTotalRating()
    {
        List<Product> products = productRepository.findByOrderByTotalratingDesc();
        return products;
    }

    public boolean existName(String name)
    {
        if (productRepository.existsByNameAndStatus(name, STATE.SALE))
        {
            return true;
        }
        return false;
    }
}
