package com.example.nashtechproject.entity.embedded;

import com.example.nashtechproject.entity.Bill;
import com.example.nashtechproject.entity.Product;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
public class BillDetailsKey implements Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id")
    private Product product;

    public BillDetailsKey() {
    }

    public BillDetailsKey(Bill bill, Product product) {
        this.bill = bill;
        this.product = product;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
