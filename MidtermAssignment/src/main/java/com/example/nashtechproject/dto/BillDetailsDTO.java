package com.example.nashtechproject.dto;

public class BillDetailsDTO {

    private int quantity;

    private String bill_id;

    private String product_id;

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getBill_id() {
        return bill_id;
    }

    public void setBill_id(String bill_id) {
        this.bill_id = bill_id;
    }

    public String getProduct_id() {
        return product_id;
    }

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }
}
