package com.example.nashtechproject.exception;

public class SupplierException extends RuntimeException{
    public SupplierException(Long id)
    {
        super("Could not find supplier with id = " + id);
    }

    public SupplierException(String exist)
    {
        super(exist + " is existed!");
    }
}
