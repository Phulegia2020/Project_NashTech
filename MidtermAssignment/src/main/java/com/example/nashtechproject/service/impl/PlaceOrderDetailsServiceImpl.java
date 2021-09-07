package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.dto.PlaceOrderDetailsDTO;
import com.example.nashtechproject.entity.PlaceOrderDetails;
import com.example.nashtechproject.repository.PlaceOrderDetailsRepository;
import com.example.nashtechproject.service.PlaceOrderDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
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

    public PlaceOrderDetails getPlaceOrderDetails(Long placeOrderDetailsId)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsRepository.findById(placeOrderDetailsId).get();
        return placeOrderDetails;
    }

    public PlaceOrderDetails getByPlaceOderAndProduct(Long po_id, Long product_id)
    {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsRepository.findByPlaceOrderIdAndProductId(po_id, product_id);
        return placeOrderDetails;
    }

    public List<PlaceOrderDetails> getPlaceOrderDetailsByPlaceOrder(Long po_id)
    {
        List<PlaceOrderDetails> placeOrderDetails = placeOrderDetailsRepository.findByPlaceOrderId(po_id);
        return placeOrderDetails;
    }

    @Override
    public PlaceOrderDetails savePlaceOrderDetails(PlaceOrderDetails placeOrderDetails) {
        return placeOrderDetailsRepository.save(placeOrderDetails);
    }

    @Override
    public void deletePlaceOrderDetails(Long placeOrderDetailsId) {
        PlaceOrderDetails placeOrderDetails = placeOrderDetailsRepository.findById(placeOrderDetailsId).get();

        placeOrderDetailsRepository.delete(placeOrderDetails);
    }

    @Override
    public void updatePlaceOrderDetails(PlaceOrderDetails placeOrderDetails) {
        placeOrderDetailsRepository.save(placeOrderDetails);
    }
}
