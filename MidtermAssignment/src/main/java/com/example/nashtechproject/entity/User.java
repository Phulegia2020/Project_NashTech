package com.example.nashtechproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(name = "user", schema = "public", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "account"
        }),
        @UniqueConstraint(columnNames = {
                "email"
        }),
})
public class User {
    @ApiModelProperty(notes = "Id auto increase upon create new")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name")
    @Size(min = 1, max = 50)
    private String name;

    @NotBlank
    @Column(name = "gender")
    private String gender;

    @NotBlank
    @Column(name = "address")
    private String address;

    @Column(name = "email")
    @Size(max = 50)
    @Email
    private String email;

    @Column(name = "phone")
    @Size(max = 10)
    private String phone;

    @Column(name = "account")
    @Size(min = 3, max = 20)
    private String account;

    @Column(name = "password")
    @Size(min = 6)
    private String password;

    @Column(name = "active_status")
    private String activestatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Bill> bills;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Rating> ratings;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Comment> comments;

    public User() {
    }

    public User(Long id, String name, String username, String email, String password) {
        this.id = id;
        this.name = name;
        this.account = username;
        this.email = email;
        this.password = password;
    }

    public User(String name, String gender, String address, String email, String phone, String account, String password) {
        this.name = name;
        this.gender = gender;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.account = account;
        this.password = password;
    }

    public User(Long id, String name, String gender, String address, String email, String phone, String account, String password, String active_status) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.account = account;
        this.password = password;
        this.activestatus = active_status;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getActive_status() {
        return activestatus;
    }

    public void setActive_status(String active_status) {
        this.activestatus = active_status;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        return Objects.equals(id, other.id);
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", username=" + account + ", email=" + email + ", password="
                + password + ", roles=" + role + "]";
    }
}
