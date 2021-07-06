package com.example.nashtechproject.exception;

public class RoleException extends RuntimeException{
    public RoleException(Long id)
    {
        super("Could not find role with id = " + id);
    }
}
