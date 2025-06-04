package com.web.n7.dto.teams;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StandingDTO {
    private Long id;
    private Long competitionId;
    private String competitionName;
    private Long teamId;
    private String teamName;
    private Integer position;
    private Integer matchesPlayed;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;
    private Integer points;
    private String form; // Last 5 matches: W-L-D-W-W
}