package com.web.n7.dto.organizer;

import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerTeamSummaryDTO {
    private Long id;
    private String name;
    private String category;
    private Integer playerCount;
    private String coachName;
    private Long coachId;
    private CompetitionTeamStatus status;
}