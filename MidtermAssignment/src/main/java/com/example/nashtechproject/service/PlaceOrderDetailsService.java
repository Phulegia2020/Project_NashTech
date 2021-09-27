package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.ImportDetails;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface PlaceOrderDetailsService {
    public List<PlaceOrderDetails> retrievePlaceOrderDetails();

    public PlaceOrderDetails getByPlaceOderAndProduct(Long po_id, Long product_id);

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(Long po_Id);

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrderPages(Long po_id, ProductPage productPage);

    public PlaceOrderDetails savePlaceOrderDetails(PlaceOrderDetails placeOrderDetails);

    public void deletePlaceOrderDetails(Long po_id, Long product_id);

    public void updatePlaceOrderDetails(PlaceOrderDetails placeOrderDetails);
}
