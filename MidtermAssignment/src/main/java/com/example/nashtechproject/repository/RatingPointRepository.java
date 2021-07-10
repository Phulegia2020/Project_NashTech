package com.example.nashtechproject.repository;

import com.example.nashtechproject.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingPointRepository extends JpaRepository<Rating, Long> {
}
