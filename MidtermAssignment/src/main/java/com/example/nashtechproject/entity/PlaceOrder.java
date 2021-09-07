package com.example.nashtechproject.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "place_order")
public class PlaceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_price")
    private float total;

    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "createddate")
    private LocalDateTime createddate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToOne(mappedBy = "placeOrder", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private Import imp;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "placeOrder", fetch = FetchType.EAGER)
    private Set<PlaceOrderDetails> placeOrderDetails;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Import getImp() {
        return imp;
    }

    public void setImp(Import imp) {
        this.imp = imp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
