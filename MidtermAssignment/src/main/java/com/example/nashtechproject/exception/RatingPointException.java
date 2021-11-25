package com.example.nashtechproject.exception;

public class RatingPointException extends RuntimeException{
    public RatingPointException(Long id)
    {
        super("Could not find rating with id = " + id);
    }

    public RatingPointException(Long uid, Long pid){super("The user rated this product");}
}
