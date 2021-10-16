package com.example.nashtechproject.entity.embedded;

import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.entity.User;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
public class RateKey implements Serializable {
    private static final long serialVersionUID = 1L;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "product_id")
//    private Product product;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "product_id")
    private Long productId;

    public RateKey() {
    }

//    public RateKey(User user, Product product) {
//        this.user = user;
//        this.product = product;
//    }


//    public RateKey(User user, Long productId) {
//        this.user = user;
//        this.productId = productId;
//    }

//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }

//    public Product getProduct() {
//        return product;
//    }
//
//    public void setProduct(Product product) {
//        this.product = product;
//    }


    public RateKey(Long userId, Long productId) {
        this.userId = userId;
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
