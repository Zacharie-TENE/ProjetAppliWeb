package com.web.n7.dto.coach;

import com.web.n7.model.enumeration.player.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlayerDTO {
    private Long id;
    private String email;
    private String phone;
    private String userName;
    private String firstName;
    private String lastName;
    private String address;
    private String profilePicture;
    
    private String licenseNumber;
    private LocalDate dateOfBirth;
    private String position;
    private PlayerStatus status;
}