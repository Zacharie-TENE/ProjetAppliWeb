package com.web.n7.dto.common;

import com.web.n7.model.enumeration.competition.CompetitionStatus;
import com.web.n7.model.enumeration.competition.CompetitionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompetitionDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private CompetitionType type; // LEAGUE, TOURNAMENT, CUP
    private CompetitionStatus status; // UPCOMING, IN_PROGRESS, COMPLETED, CANCELLED
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private Integer maxTeams;
    private Integer registeredTeams;
    private Long organizerId;
    private String organizerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}