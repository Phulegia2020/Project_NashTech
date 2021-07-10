package com.example.nashtechproject.exception;

public class BillDetailsException extends RuntimeException{
    public BillDetailsException(Long id)
    {
        super("Could not find bill_detail with id = " + id);
    }
}
