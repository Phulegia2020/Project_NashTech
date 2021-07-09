package com.example.nashtechproject.exception;

public class UserException extends RuntimeException{
    public UserException(Long id)
    {
        super("Could not find user with id = " + id);
    }

    public UserException(String existed)
    {
        super(existed + " is existed");
    }
}
