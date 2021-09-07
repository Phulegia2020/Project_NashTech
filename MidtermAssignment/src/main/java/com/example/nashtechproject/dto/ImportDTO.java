package com.example.nashtechproject.dto;

import com.example.nashtechproject.entity.PlaceOrder;
import com.example.nashtechproject.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

public class ImportDTO {
    private Long id;

    private float total;

    @JsonFormat(pattern="dd/MM/yyyy")
    private LocalDateTime createddate;

    private String user_id;

    private String placeOrder_id;

    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public LocalDateTime getCreateddate() {
        return createddate;
    }

    public void setCreateddate(LocalDateTime createddate) {
        this.createddate = createddate;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getPlaceOrder_id() {
        return placeOrder_id;
    }

    public void setPlaceOrder_id(String placeOrder_id) {
        this.placeOrder_id = placeOrder_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
