package com.web.n7.dto.coach;

import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.enumeration.player.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPlayerDTO {
    // Champs User existant (pour upgrade)
    private Long userId; // Si null, création complète
    
    // Champs User (pour création)
    @Email
    private String email;
    private String password;
    private String phone;
    private String userName;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String address;
    
    private String profilePicture;
    
    // Champs Player
    @NotBlank(message = "Le numéro de licence est obligatoire")
    private String licenseNumber;
    
    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "La position est obligatoire")
    private PlayerPosition position;
    
    @NotNull(message = "Le statut du joueur est obligatoire")
    private PlayerStatus status;
}