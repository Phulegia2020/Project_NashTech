package com.example.nashtechproject.exception;

public class ObjectExistedException extends RuntimeException{
    String message;

    public ObjectExistedException(String message) {
        super(message);
        this.message = message;
    }
}
