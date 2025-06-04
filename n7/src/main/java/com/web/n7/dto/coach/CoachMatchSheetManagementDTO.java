package com.web.n7.dto.coach;

import com.web.n7.dto.match.PlayerParticipationDTO;
import com.web.n7.model.enumeration.match.MatchSheetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoachMatchSheetManagementDTO {
    private Long id;
    
    // Informations sur le match
    private Long matchId;
    private String matchTitle;
    private String matchLocation;
    private LocalDateTime matchDate;
    private String competitionName;
    
    // Informations sur l'équipe
    private Long teamId;
    private String teamName;
    
    // Statut de la feuille de match
    private MatchSheetStatus status;
    private LocalDateTime validationDate;
    private LocalDate submissionDeadline;
    
    // Stratégie de l'équipe pour le match
    private String strategy;
    
    // Liste des joueurs participants
    private List<PlayerParticipationDTO> playerParticipations;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}