package com.example.nashtechproject.exception;

public class ObjectNotFoundException extends RuntimeException{
    String message;

    public ObjectNotFoundException(String message) {
        super(message);
        this.message = message;
    }
}
