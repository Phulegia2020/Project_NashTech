package com.example.nashtechproject.exception;

public class CustomerException extends RuntimeException{
    public CustomerException(Long id)
    {
        super("Could not find customer with id = " + id);
    }

    public CustomerException(String account)
    {
        super(account + " is existed");
    }
}
