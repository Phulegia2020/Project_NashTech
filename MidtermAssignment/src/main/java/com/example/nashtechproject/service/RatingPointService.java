package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Rating;

import java.util.List;

public interface RatingPointService {
    public List<Rating> retrieveRatings();

    public Rating getRatingByUserIdAndProductId(Long uid, Long pid);

    public List<Rating> getRatingByProduct(Long productId);

    public Rating saveRating(Rating rating);

    public void deleteRating(Long uid, Long pid);

    public void updateRating(Rating rating);
}
