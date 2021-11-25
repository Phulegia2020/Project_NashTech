package com.example.nashtechproject.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total")
    private float total;

    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "createddate")
    private LocalDateTime createddate;

    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "checkout_date")
    private LocalDateTime checkout_date;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "status")
    private String status;

    @Column(name = "destination")
    private String destination;

    @Column(name = "payment")
    private String payment;

    @Transient
    @OneToMany(mappedBy = "bill", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<BillDetails> billDetails = new ArrayList<>();

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

    public LocalDateTime getCheckout_date() {
        return checkout_date;
    }

    public void setCheckout_date(LocalDateTime checkout_date) {
        this.checkout_date = checkout_date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }
}
