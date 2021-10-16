package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.PlaceOrderDetailsKey;

import javax.persistence.*;

@Entity
@Table(name = "placeorder_details")
public class PlaceOrderDetails {
    @EmbeddedId
    private PlaceOrderDetailsKey key;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @MapsId("placeOrderId")
//    @JoinColumn(name = "place_order_id")
//    private PlaceOrder placeOrder;
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    @MapsId("productId")
//    @JoinColumn(name = "product_id")
//    private Product product;

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

//    public PlaceOrder getPlaceOrder() {
//        return placeOrder;
//    }
//
//    public void setPlaceOrder(PlaceOrder placeOrder) {
//        this.placeOrder = placeOrder;
//    }
//
//    public Product getProduct() {
//        return product;
//    }
//
//    public void setProduct(Product product) {
//        this.product = product;
//    }
}
