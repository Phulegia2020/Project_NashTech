package com.example.nashtechproject.entity.embedded;

import com.example.nashtechproject.entity.Import;
import com.example.nashtechproject.entity.Product;

import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Embeddable
public class ImportDetailsKey implements Serializable {
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "import_id")
    private Import imp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    public ImportDetailsKey() {
    }

    public ImportDetailsKey(Import imp, Product product) {
        this.imp = imp;
        this.product = product;
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
