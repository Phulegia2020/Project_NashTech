package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.page.ProductPage;
import com.example.nashtechproject.page.STATE;
import com.example.nashtechproject.repository.PlaceOrderRepository;
import com.example.nashtechproject.service.PlaceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceOrderServiceImpl implements PlaceOrderService {
    @Autowired
    private PlaceOrderRepository placeOrderRepository;

    public void setPlaceOrderRepository(PlaceOrderRepository placeOrderRepository)
    {
        this.placeOrderRepository = placeOrderRepository;
    }

    public List<PlaceOrder> retrievePlaceOrders()
    {
        List<PlaceOrder> placeOrders = placeOrderRepository.findAll();
        return placeOrders;
    }

    public List<PlaceOrder> getPlaceOrdersPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<PlaceOrder> placeOrders = placeOrderRepository.findAll(pageable).getContent();
        return placeOrders;
    }

    public PlaceOrder getPlaceOrder(Long placeOrderId)
    {
        PlaceOrder placeOrder = placeOrderRepository.findById(placeOrderId).get();
        return placeOrder;
    }

    public List<PlaceOrder> getPlaceOrderSearch(String id)
    {
        List<PlaceOrder> list = placeOrderRepository.findByIdAndStatusNot(Long.parseLong(id), STATE.CANCEL);
        return list;
    }

    public List<PlaceOrder> getPlaceOrderSearchPage(String id, ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        Page<PlaceOrder> placeOrders = placeOrderRepository.findByIdAndStatusNot(Long.parseLong(id), STATE.CANCEL, pageable);
        return placeOrders.getContent();
    }

    public List<PlaceOrder> getPlaceOrderStatus()
    {
        List<PlaceOrder> placeOrders = placeOrderRepository.findByStatusNot(STATE.CANCEL);
        return placeOrders;
    }

    public List<PlaceOrder> getPlaceOrderStatusPage(ProductPage productPage)
    {
        Sort sort = Sort.by(Sort.Direction.DESC, productPage.getSortBy());
        Pageable pageable = PageRequest.of(productPage.getPageNumber(), productPage.getPageSize(), sort);
        List<PlaceOrder> placeOrders = placeOrderRepository.findByStatusNot(STATE.CANCEL, pageable).getContent();
        return placeOrders;
    }

    @Override
    public PlaceOrder savePlaceOrder(PlaceOrder placeOrder) {
        return placeOrderRepository.save(placeOrder);
    }

    @Override
    public void deletePlaceOrder(Long placeOrderId) {
        PlaceOrder placeOrder = placeOrderRepository.findById(placeOrderId).get();

        placeOrderRepository.delete(placeOrder);
    }

    @Override
    public void updatePlaceOrder(PlaceOrder placeOrder) {
        placeOrderRepository.save(placeOrder);
    }

    @Override
    public List<PlaceOrder> getPlaceOrderNotDone()
    {
        List<PlaceOrder> list = placeOrderRepository.findByStatus(STATE.WAITING);
        return list;
    }
}
