package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Rating;
import com.example.nashtechproject.entity.embedded.RateKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingPointRepository extends JpaRepository<Rating, RateKey> {
//    public Rating findByKey_User_IdAndKey_Product_Id(Long user_id, Long product_id);
//
//    public List<Rating> findByKey_Product_Id(Long productId);
    public Rating findByKey_UserIdAndKey_ProductId(Long user_id, Long product_id);

    public List<Rating> findByKey_ProductId(Long productId);
}
