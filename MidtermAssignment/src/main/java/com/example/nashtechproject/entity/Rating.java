package com.example.nashtechproject.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rating")
public class Rating {
    @EmbeddedId
    private ratingId id;

    @Embeddable
    public static class ratingId implements Serializable
    {
        private static final long serialVersionUID = 1L;

        @Column(name = "user_id")
        private Long user_id;

        @Column(name = "product_id")
        private Long product_id;

        public Long getUser_id() {
            return user_id;
        }

        public void setUser_id(Long user_id) {
            this.user_id = user_id;
        }

        public Long getProduct_id() {
            return product_id;
        }

        public void setProduct_id(Long product_id) {
            this.product_id = product_id;
        }
    }

    @Column(name = "ratingpoint")
    private float ratingPoint;

    public ratingId getId() {
        return id;
    }

    public void setId(ratingId id) {
        this.id = id;
    }

    public float getRatingPoint() {
        return ratingPoint;
    }

    public void setRatingPoint(float ratingPoint) {
        this.ratingPoint = ratingPoint;
    }
}
