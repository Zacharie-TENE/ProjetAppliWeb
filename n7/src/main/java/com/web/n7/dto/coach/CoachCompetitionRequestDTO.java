package com.web.n7.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoachCompetitionRequestDTO {
    private Long id;
    
    @NotNull(message = "L'identifiant de l'équipe est obligatoire")
    private Long teamId;
    
    @NotNull(message = "L'identifiant de la compétition est obligatoire")
    private Long competitionId;
    
    private String teamName;
    private String competitionName;
    
    @NotBlank(message = "La raison est obligatoire")
    private String reason;
    
    private String requestType; // "REGISTRATION" ou "WITHDRAWAL"
    private String requestStatus; // "PENDING", "APPROVED", "REJECTED"
    
    private String responseMessage;
    private String createdAt;
    private String processedAt;
}