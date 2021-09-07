package com.example.nashtechproject.dto;

import org.hibernate.annotations.Type;

import javax.persistence.*;

public class ProductDTO {
    private Long id;

    private String name;

    private String description;

    private int quantity;

    private int price;

    private float totalrating;

    private String status;

    @Lob
    @Type(type="org.hibernate.type.BinaryType")
    private byte[] imageurl;

    private String category_id;

    private String supplier_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public float getTotalrating() {
        return totalrating;
    }

    public void setTotalrating(float totalrating) {
        this.totalrating = totalrating;
    }

    public byte[] getImageurl() {
        return imageurl;
    }

    public void setImageurl(byte[] imageurl) {
        this.imageurl = imageurl;
    }

    public String getCategory_id() {
        return category_id;
    }

    public void setCategory_id(String category_id) {
        this.category_id = category_id;
    }

    public String getSupplier_id() {
        return supplier_id;
    }

    public void setSupplier_id(String supplier_id) {
        this.supplier_id = supplier_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
