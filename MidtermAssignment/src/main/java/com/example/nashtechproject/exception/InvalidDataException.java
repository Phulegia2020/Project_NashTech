package com.example.nashtechproject.exception;

public class InvalidDataException extends RuntimeException{
    String message;

    public InvalidDataException(String message) {
        super(message);
        this.message = message;
    }
}
