package com.web.n7.dto.organizer;

import com.web.n7.model.enumeration.competition.CompetitionStatus;
import com.web.n7.model.enumeration.competition.CompetitionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerCompetitionDTO {
    private Long id;
    private String name;
    private String description;
    private String category;

    private CompetitionType competitionType;
    private CompetitionStatus status;

    private LocalDate startDate;
    private LocalDate endDate;

    private String location;
    private Integer maxTeams;
    private Integer registeredTeams;
    private List<OrganizerTeamSummaryDTO> teams;

    private Integer totalMatches;
    private Integer completedMatches;
    private Integer upcomingMatches;

    private Long organizerId;
    private String organizerName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}