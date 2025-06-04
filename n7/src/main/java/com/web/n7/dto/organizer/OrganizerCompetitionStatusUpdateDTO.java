package com.web.n7.dto.organizer;

import com.web.n7.model.enumeration.competition.CompetitionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerCompetitionStatusUpdateDTO {
    @NotNull(message = "L'identifiant de la compétition est obligatoire")
    private Long competitionId;
    
    @NotNull(message = "Le nouveau statut est obligatoire")
    private CompetitionStatus newStatus;
    

}