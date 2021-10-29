package com.example.nashtechproject.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.Type;

import javax.persistence.Lob;
import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;

    private String content;

    private String user_id;

    private String username;

    private String product_id;

//    @Lob
//    @Type(type="org.hibernate.type.BinaryType")
//    private byte[] productImg;
    private String productImg;

    private String productName;

    @JsonFormat(pattern="dd/MM/yyyy")
    private LocalDateTime date_comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProduct_id() {
        return product_id;
    }

    public void setProduct_id(String product_id) {
        this.product_id = product_id;
    }

//    public byte[] getProductImg() {
//        return productImg;
//    }
//
//    public void setProductImg(byte[] productImg) {
//        this.productImg = productImg;
//    }


    public String getProductImg() {
        return productImg;
    }

    public void setProductImg(String productImg) {
        this.productImg = productImg;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public LocalDateTime getDate_comment() {
        return date_comment;
    }

    public void setDate_comment(LocalDateTime date_comment) {
        this.date_comment = date_comment;
    }
}
