package com.web.n7.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {
    @Email
    @NotBlank(message = ("Email is required."))
    private String email;

    @NotBlank(message = ("password cannot be null/empty"))
    private String password;
}

