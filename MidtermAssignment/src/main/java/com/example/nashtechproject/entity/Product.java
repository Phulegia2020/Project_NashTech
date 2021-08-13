package com.example.nashtechproject.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Type;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private int price;

    @Column(name = "totalrating")
    private float totalrating;

    @Column(name = "createddate")
    private LocalDateTime createddate;

    @JsonFormat(pattern="dd/MM/yyyy")
    @Column(name = "updateddate")
    private LocalDateTime updateddate;

    @Lob
    @Type(type="org.hibernate.type.BinaryType")
    @Column(name = "imageURL")
    private byte[] imageurl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER)
    @JsonIgnore
    private Collection<BillDetails> products;

    public Product() {
    }

    public Product(Long id, String name, String description, int quantity, int price, LocalDateTime createddate, LocalDateTime updateddate, byte[] imageurl, Category category, Supplier supplier, List<Rating> ratings, Collection<BillDetails> products) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.createddate = createddate;
        this.updateddate = updateddate;
        this.imageurl = imageurl;
        this.category = category;
        this.supplier = supplier;
        this.ratings = ratings;
        this.products = products;
    }

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

    public LocalDateTime getCreateddate() {
        return createddate;
    }

    public float getTotalrating() {
        return totalrating;
    }

    public void setTotalrating(float totalrating) {
        this.totalrating = totalrating;
    }

    public void setCreateddate(LocalDateTime createddate) {
        this.createddate = createddate;
    }

    public LocalDateTime getUpdateddate() {
        return updateddate;
    }

    public void setUpdateddate(LocalDateTime updateddate) {
        this.updateddate = updateddate;
    }

    public byte[] getImageurl() {
        return imageurl;
    }

    public void setImageurl(byte[] imageurl) {
        this.imageurl = imageurl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
}
