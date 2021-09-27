package com.example.nashtechproject.entity;

import com.example.nashtechproject.entity.embedded.ImportDetailsKey;

import javax.persistence.*;

@Entity
@Table(name = "import_details")
public class ImportDetails {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
    @EmbeddedId
    private ImportDetailsKey key;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private float price;

    public ImportDetailsKey getKey() {
        return key;
    }

    public void setKey(ImportDetailsKey key) {
        this.key = key;
    }

    //    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }

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


}
