package com.example.nashtechproject.dto;

public class ImportDetailsDTO {
    private int quantity;

    private float price;

    private String imp_id;

    private String product_id;

    private String productImg;

    private String productName;

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getImp_id() {
        return imp_id;
    }

    public void setImp_id(String imp_id) {
        this.imp_id = imp_id;
    }

    public String getProduct_id() {
        return product_id;
    }

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }

    public String getProductImg() {
        return productImg;
    }

    public void setProductImg(String productImg) {
        this.productImg = productImg;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
