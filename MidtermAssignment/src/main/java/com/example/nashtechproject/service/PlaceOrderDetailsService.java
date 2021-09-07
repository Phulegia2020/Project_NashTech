package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.PlaceOrderDetails;

import java.util.List;

public interface PlaceOrderDetailsService {
    public List<PlaceOrderDetails> retrievePlaceOrderDetails();

    public PlaceOrderDetails getPlaceOrderDetails(Long placeOrderDetailsId);

    public PlaceOrderDetails getByPlaceOderAndProduct(Long po_id, Long product_id);

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(Long po_Id);

    public PlaceOrderDetails savePlaceOrderDetails(PlaceOrderDetails placeOrderDetails);

    public void deletePlaceOrderDetails(Long placeOrderDetailsId);

    public void updatePlaceOrderDetails(PlaceOrderDetails placeOrderDetails);
}
