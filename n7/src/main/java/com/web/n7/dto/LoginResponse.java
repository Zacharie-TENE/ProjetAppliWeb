package com.web.n7.dto;

import com.web.n7.model.users.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Object user;

}
