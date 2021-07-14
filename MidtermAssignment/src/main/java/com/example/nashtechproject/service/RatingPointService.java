package com.example.nashtechproject.service;

import com.example.nashtechproject.entity.Rating;

import java.util.List;

public interface RatingPointService {
    public List<Rating> retrieveRatings();

    public Rating getRating(Long ratingId);

    public Rating getRatingByUserIdAndProductId(Long uid, Long pid);

    public Rating saveRating(Rating rating);

    public void deleteRating(Long ratingId);

    public void updateRating(Rating rating);
}
