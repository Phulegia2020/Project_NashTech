package com.example.nashtechproject.entity.embedded;

import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.Product;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
public class PlaceOrderDetailsKey implements Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "place_order_id")
    private PlaceOrder placeOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    public PlaceOrderDetailsKey() {
    }

    public PlaceOrderDetailsKey(PlaceOrder placeOrder, Product product) {
        this.placeOrder = placeOrder;
        this.product = product;
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

//    @Column(name = "place_order_id")
//    private Long placeOrderId;
//
//    @Column(name = "product_id")
//    private Long productId;
//
//
//
//    public PlaceOrderDetailsKey(Long placeOrderId, Long productId) {
//        this.placeOrderId = placeOrderId;
//        this.productId = productId;
//    }
//
//    public Long getPlaceOrderId() {
//        return placeOrderId;
//    }
//
//    public void setPlaceOrderId(Long placeOrderId) {
//        this.placeOrderId = placeOrderId;
//    }
//
//    public Long getProductId() {
//        return productId;
//    }
//
//    public void setProductId(Long productId) {
//        this.productId = productId;
//    }
}
