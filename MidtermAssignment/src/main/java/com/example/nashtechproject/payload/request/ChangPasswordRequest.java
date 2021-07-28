package com.example.nashtechproject.payload.request;

import javax.validation.constraints.NotBlank;

public class ChangPasswordRequest {
    @NotBlank
    private Long user_id;

    @NotBlank
    private String newpassword;

    @NotBlank
    private String confirmpassword;

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getNewpassword() {
        return newpassword;
    }

    public void setNewpassword(String newpassword) {
        this.newpassword = newpassword;
    }

    public String getConfirmpassword() {
        return confirmpassword;
    }

    public void setConfirmpassword(String confirmpassword) {
        this.confirmpassword = confirmpassword;
    }
}
