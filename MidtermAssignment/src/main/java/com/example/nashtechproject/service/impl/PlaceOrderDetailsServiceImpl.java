package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.repository.PlaceOrderDetailsRepository;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlaceOrderDetailsServiceImpl implements PlaceOrderDetailsService {
    @Autowired
    private PlaceOrderDetailsRepository placeOrderDetailsRepository;

    public void setPlaceOrderDetailsRepository(PlaceOrderDetailsRepository placeOrderDetailsRepository)
    {
        this.placeOrderDetailsRepository = placeOrderDetailsRepository;
    }

    public List<PlaceOrderDetails> retrievePlaceOrderDetails()
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsRepository.findAll();
        return placeOrderDetails;
    }

    public PlaceOrderDetails getByPlaceOderAndProduct(Long po_id, Long product_id)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsRepository.findByKey_PlaceOrder_IdAndKey_Product_Id(po_id, product_id);
        return placeOrderDetails;
    }

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(Long po_id)
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsRepository.findByKey_PlaceOrder_Id(po_id);
        return placeOrderDetails;
    }

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrderPages(Long po_id, ProductPage productPage)
    {
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize());
        Page<PlaceOrderDetails> page = placeOrderDetailsRepository.findByKey_PlaceOrder_Id(po_id, pageable);
        return page.getContent();
    }

    @Override
    public PlaceOrderDetails savePlaceOrderDetails(PlaceOrderDetails placeOrderDetails) {
        return placeOrderDetailsRepository.save(placeOrderDetails);
    }

    @Override
    public void deletePlaceOrderDetails(Long po_id, Long product_id) {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsRepository.findByKey_PlaceOrder_IdAndKey_Product_Id(po_id, product_id);

        placeOrderDetailsRepository.delete(placeOrderDetails);
    }

    @Override
    public void updatePlaceOrderDetails(PlaceOrderDetails placeOrderDetails) {
        placeOrderDetailsRepository.save(placeOrderDetails);
    }
}
