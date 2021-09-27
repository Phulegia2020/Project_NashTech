package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.RateKey;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rating")
public class Rating {
    @EmbeddedId
    private RateKey key;

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
}
