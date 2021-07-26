package com.example.nashtechproject.exception;

public class ProductException extends RuntimeException{
    public ProductException(Long id)
    {
        super("Could not find product with id = " + id);
    }

    public ProductException(String name)
    {
        super(name + " is existed!");
    }
}
