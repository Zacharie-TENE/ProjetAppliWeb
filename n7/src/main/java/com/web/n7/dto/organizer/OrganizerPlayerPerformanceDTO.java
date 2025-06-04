package com.web.n7.dto.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerPlayerPerformanceDTO {
    private Long id;
    private Long playerId;
    private String playerName;
    private Long matchId;
    private Integer goalsScored;
    private Integer assists;
    private Integer yellowCards;
    private Integer redCards;
    private Integer minutesPlayed;


    private Integer shotsOnTarget;
    private Integer penaltiesScored;
    private Integer penaltiesTaken;
    private Integer successfulDribbles;

    // Midfield statistics
    private Double passAccuracy;
    private Integer successfulPasses;
    private Integer ballsRecovered;
    private Integer successfulCrosses;

    // Defensive statistics
    private Integer interceptions;
    private Integer ballsLost;

    // Goalkeeper statistics
    private Integer savesMade;
    private Integer cleanSheets;
    private Integer penaltiesSaved;
    private Integer goalsConceded;
    private Double savePercentage;

    private Double rating;
    private String notes;
}