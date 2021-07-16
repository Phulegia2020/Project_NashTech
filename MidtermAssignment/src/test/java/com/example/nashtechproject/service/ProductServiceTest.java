package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.repository.ProductRepository;
import com.example.nashtechproject.service.impl.ProductServiceImpl;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    public void getAllProducts()
    {
        List<Product> productList = new ArrayList<>();
        Product p1 = new Product(1L, "PS4 Pro", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        Product p2 = new Product(2L, "PS4 Slim", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        Product p3 = new Product(3L, "PS4", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        productList.add(p1);
        productList.add(p2);
        productList.add(p3);
        when(productRepository.findAll()).thenReturn(productList);

        List<Product> products = productService.retrieveProducts();

        assertEquals(3, products.size());
    }

    @Test
    public void getProductByIdTest()
    {
        Product pro = new Product(1L, "PS4 Pro", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        when(productRepository.findById(pro.getId())).thenReturn(Optional.of(pro));

        Product p = productService.getProduct(pro.getId());
        assertEquals("PS4 Pro", p.getName());
    }

    @Test
    public void createProductTest()
    {
        Product pro = new Product(1L, "PS4 Pro", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        when(productRepository.save(any())).thenReturn(pro);
        Product p = productService.saveProduct(pro);

        assertEquals(1l, p.getId());
        assertEquals("PS4 Pro", p.getName());
        assertEquals(1000, p.getPrice());
    }

    @Test
    public void updateProductTest()
    {
        Product pro = new Product(1L, "PS4 Pro", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        when(productRepository.findById(pro.getId())).thenReturn(Optional.of(pro));
        when(productRepository.save(pro)).thenReturn(pro);

        assertEquals(1L, pro.getId());
        assertEquals("Good", pro.getDescription());
    }

    @Test
    public void deleteProductTest()
    {
        Product pro = new Product(1L, "PS4 Pro", "Good", 100, 1000, LocalDateTime.now(), LocalDateTime.now(), null, null, null, null, null);
        when(productRepository.findById(pro.getId())).thenReturn(Optional.of(pro));
        productService.deleteProduct(pro.getId());
        verify(productRepository, times(1)).delete(pro);
    }
}
