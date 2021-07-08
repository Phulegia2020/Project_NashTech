package com.example.nashtechproject.exception;

public class BillException extends RuntimeException{
    public BillException(Long id)
    {
        super("Could not find bill with id = " + id);
    }
}
