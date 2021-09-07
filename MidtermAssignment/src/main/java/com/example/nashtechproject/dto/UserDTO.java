package com.example.nashtechproject.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public class UserDTO {
    private Long id;

    private String name;

    private String gender;

    private String address;

    @Size(max = 50)
    @Email
    private String email;

    @Size(max = 10)
    private String phone;

    @Size(min = 3, max = 20)
    private String account;

    private String activestatus;

    private String role_id;

    public UserDTO() {
    }

    public UserDTO(Long id, String name, String gender, String address, String email, String phone, String account, String active_status, String role_id) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.account = account;
        this.activestatus = active_status;
        this.role_id = role_id;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getActive_status() {
        return activestatus;
    }

    public void setActive_status(String active_status) {
        this.activestatus = active_status;
    }

    public String getRole_id() {
        return role_id;
    }

    public void setRole_id(String role_id) {
        this.role_id = role_id;
    }
}
