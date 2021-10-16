package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.RateKey;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rating")
public class Rating {
    @EmbeddedId
    private RateKey key;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id",insertable = false, updatable = false)
    private Product product;

    @Column(name = "ratingpoint")
    private float ratingPoint;

    public RateKey getKey() {
        return key;
    }

    public void setKey(RateKey key) {
        this.key = key;
    }

    public float getRatingPoint() {
        return ratingPoint;
    }

    public void setRatingPoint(float ratingPoint) {
        this.ratingPoint = ratingPoint;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
