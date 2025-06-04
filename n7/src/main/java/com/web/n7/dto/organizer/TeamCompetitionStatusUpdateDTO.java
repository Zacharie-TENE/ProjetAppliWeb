package com.web.n7.dto.organizer;

import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamCompetitionStatusUpdateDTO {

    private Long competitionId;
    private Long teamId;
    
    @NotNull(message = "Le nouveau statut est obligatoire")
    private CompetitionTeamStatus newStatus;


   
}