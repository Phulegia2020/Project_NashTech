package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.PlaceOrderDetailsKey;

import javax.persistence.*;

@Entity
@Table(name = "placeorder_details")
public class PlaceOrderDetails {
    @EmbeddedId
    private PlaceOrderDetailsKey key;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private float price;

    public PlaceOrderDetailsKey getKey() {
        return key;
    }

    public void setKey(PlaceOrderDetailsKey key) {
        this.key = key;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }
}
