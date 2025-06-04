package com.web.n7.dto.match;

import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.enumeration.player.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerParticipationDTO {
    private Long id;

    //information à figurer sur la feuille de match si le match est en cours ou déjà joué
    private Integer goalsScored;
    private Integer yellowCards;
    private Integer redCards;
    private Integer minutesPlayed;
    private Integer substitutionInTime;
    private Integer substitutionOutTime;


    //information à figurer sur la feuille de match si le match n est pas encore joué
    private Integer shirtNumber;
    private PlayerStatus playerStatus;
    private PlayerPosition position;
    private Long matchSheetId;
    private Long playerId;
    private String playerName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}