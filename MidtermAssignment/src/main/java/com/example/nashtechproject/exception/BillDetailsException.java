package com.example.nashtechproject.exception;

public class BillDetailsException extends RuntimeException{
    public BillDetailsException(Long id)
    {
        super("Could not find bill_detail with id = " + id);
    }

    public BillDetailsException(Long bill_id, Long product_id)
    {
        super("Bill id = " + bill_id + " includes Product id = " + product_id + " is existed!");
    }

    public BillDetailsException(int quantity)
    {
        super("This product has not enough " + quantity + " one");
    }
}
