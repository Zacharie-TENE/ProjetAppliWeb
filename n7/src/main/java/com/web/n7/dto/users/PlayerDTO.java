package com.web.n7.dto.users;

import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.enumeration.player.PlayerStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;


@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PlayerDTO extends UserDTO {
    // Informations spécifiques au joueur
    private String licenseNumber;
    private LocalDate dateOfBirth;
    private PlayerPosition position;
    private PlayerStatus status;
    private Long teamId;
    private String teamName;


}