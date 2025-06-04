package com.web.n7.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamDTO {
    @NotBlank(message = "Le nom de l'équipe est obligatoire")
    private String name;

    private String description;
    private String logo;

    @NotBlank(message = "La catégorie est obligatoire")
    private String category;

    @NotNull(message = "La liste des joueurs est obligatoire")
    @Size(min = 11, max = 25, message = "L'équipe doit avoir entre 11 et 25 joueurs")
    private List<RegisterPlayerDTO> players;
}