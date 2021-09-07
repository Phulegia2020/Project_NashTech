package com.example.nashtechproject.service;

import com.example.nashtechproject.dto.PlaceOrderDTO;
import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.page.ProductPage;

import java.util.List;

public interface PlaceOrderService {
    public List<PlaceOrder> retrievePlaceOrders();

    public List<PlaceOrder> getPlaceOrdersPage(ProductPage productPage);

    public PlaceOrder getPlaceOrder(Long placeOrderId);

    public PlaceOrder savePlaceOrder(PlaceOrder placeOrder);

    public void deletePlaceOrder(Long placeOrderId);

    public void updatePlaceOrder(PlaceOrder placeOrder);

    public List<PlaceOrder> getPlaceOrderNotDone();
}
