package com.example.nashtechproject.service.impl;

import com.example.nashtechproject.entity.Rating;
import com.example.nashtechproject.repository.RatingPointRepository;
import com.example.nashtechproject.service.RatingPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingPointServiceImpl implements RatingPointService {
    @Autowired
    private RatingPointRepository ratingRepository;

    public void setRatingRepository(RatingPointRepository ratingRepository)
    {
        this.ratingRepository = ratingRepository;
    }

    public List<Rating> retrieveRatings()
    {
        List<Rating> ratings = ratingRepository.findAll();
        return ratings;
    }

    public Rating getRatingByUserIdAndProductId(Long uid, Long pid)
    {
        //Rating rat = ratingRepository.findByKey_User_IdAndKey_Product_Id(uid, pid);
        Rating rat = ratingRepository.findByKey_UserIdAndKey_ProductId(uid, pid);
        return rat;
    }

    public List<Rating> getRatingByProduct(Long productId)
    {
        List<Rating> ratings = ratingRepository.findByKey_ProductId(productId);
        return ratings;
    }

    @Override
    public Rating saveRating(Rating rat) {
        return ratingRepository.save(rat);
    }

    @Override
    public void deleteRating(Long uid, Long pid) {
//        Rating rat = ratingRepository.findByUserIdAndProductId(uid, pid);
        Rating rat = ratingRepository.findByKey_UserIdAndKey_ProductId(uid, pid);

        ratingRepository.delete(rat);
    }

    @Override
    public void updateRating(Rating rat) {
        ratingRepository.save(rat);
    }
}
