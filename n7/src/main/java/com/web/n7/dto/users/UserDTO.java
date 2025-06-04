package com.web.n7.dto.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserDTO {
    private Long id;
    private String email;
    private String userName;
    private String firstName;
    private String lastName;
    private String role;
    private String phone;
    private String profilePicture;
    private String address;
    private String password;
    private String createdAt;
    private String updatedAt;
}