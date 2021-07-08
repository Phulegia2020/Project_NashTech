package com.example.nashtechproject.exception;

public class BillStatusException extends RuntimeException{
    public BillStatusException(Long id)
    {
        super("Could not find bill status with id = " + id);
    }
}
