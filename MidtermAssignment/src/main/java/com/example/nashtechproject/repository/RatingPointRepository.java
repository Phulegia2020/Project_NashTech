package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingPointRepository extends JpaRepository<Rating, Long> {
    public Rating findByUserIdAndProductId(Long user_id, Long product_id);

    public List<Rating> findByProductId(Long productId);
}
