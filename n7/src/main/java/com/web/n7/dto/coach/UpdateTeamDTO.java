package com.web.n7.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTeamDTO {
    private Long teamId;       // ID de l'équipe à mettre à jour
    private String name;        // Nom de l'équipe
    private String description; // Description de l'équipe
    private String logo;        // Logo de l'équipe
    private String category;    // Catégorie de l'équipe
}