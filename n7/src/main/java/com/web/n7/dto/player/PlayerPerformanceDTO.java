package com.web.n7.dto.player;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerPerformanceDTO {
    private Long id;
    private Long playerId;
    private String playerName;
    private Long competitionId;
    private String competitionName;
    
    // Common statistics
    private Integer totalMatches;
    private Integer totalMinutesPlayed;
    private Integer totalFouls;
    private Integer totalYellowCards;
    private Integer totalRedCards;
    
    // Offensive statistics
    private Integer totalGoals;
    private Integer totalAssists;
    private Integer totalShots;
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