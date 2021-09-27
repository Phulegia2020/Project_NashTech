package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.BillDetailsKey;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "billdetails")
public class BillDetails {
    @EmbeddedId
    private BillDetailsKey key;

    @Column(name = "quantity")
    private int quantity;

    public BillDetailsKey getKey() {
        return key;
    }

    public void setKey(BillDetailsKey key) {
        this.key = key;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
