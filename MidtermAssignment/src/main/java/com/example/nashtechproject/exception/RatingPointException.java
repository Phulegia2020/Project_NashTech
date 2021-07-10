package com.example.nashtechproject.exception;

import com.example.nashtechproject.entity.Rating;

public class RatingPointException extends RuntimeException{
    public RatingPointException(Long id)
    {
        super("Could not find raing with id = " + id);
    }
}
