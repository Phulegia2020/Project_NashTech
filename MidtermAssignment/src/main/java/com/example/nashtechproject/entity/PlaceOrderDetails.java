package com.example.nashtechproject.entity;

import javax.persistence.*;

@Entity
@Table(name = "placeorder_details")
public class PlaceOrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private float price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "place_order_id")
    private PlaceOrder placeOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public PlaceOrder getPlaceOrder() {
        return placeOrder;
    }

    public void setPlaceOrder(PlaceOrder placeOrder) {
        this.placeOrder = placeOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
