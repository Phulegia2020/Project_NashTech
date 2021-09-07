package com.example.nashtechproject.entity;

import javax.persistence.*;

@Entity
@Table(name = "import_details")
public class ImportDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private float price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "import_id")
    private Import imp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Import getImp() {
        return imp;
    }

    public void setImp(Import imp) {
        this.imp = imp;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
