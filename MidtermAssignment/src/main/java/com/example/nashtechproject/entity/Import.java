package com.example.nashtechproject.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "import")
public class Import {
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

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "placeorder_id")
    private PlaceOrder placeOrder;

    @JoinColumn(name = "status")
    private String status;

    @Transient
    @OneToMany(mappedBy = "imp", fetch = FetchType.EAGER)
    private Set<ImportDetails> importDetails;

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

    public PlaceOrder getPlaceOrder() {
        return placeOrder;
    }

    public void setPlaceOrder(PlaceOrder placeOrder) {
        this.placeOrder = placeOrder;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
