package com.example.LCProjectAPI.Models.DTO;

public class RegistrationFormDTO extends LoginFormDTO {

    private String verifyPassword;

    public String getVerifyPassword() {
        return verifyPassword;
    }

    public void setVerifyPassword(String verifyPassword) {
        this.verifyPassword = verifyPassword;
    }

    public void setToken(String token) {
    }
}


