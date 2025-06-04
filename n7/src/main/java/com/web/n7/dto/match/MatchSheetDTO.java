package com.web.n7.dto.match;

import com.web.n7.model.enumeration.match.MatchRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchSheetDTO {
    private Long id;
    private Long matchId;
    private String matchTitle;
    private Long teamId;
    private String teamName;
    private MatchRole teamRole; // HOME ou AWAY
    private Long competitionId;
    private String competitionName;
    private LocalDateTime matchDateTime;
    private String venue;
    private Integer teamScore;
    private Integer opponentScore;
    private String status; // DRAFT, SUBMITTED, APPROVED, REJECTED
    private List<PlayerParticipationDTO> playerParticipations;
    private String coachComments;
    private String organizerComments;
    private LocalDateTime submittedAt;
    private LocalDateTime validatedAt;
    private String strategy;
}

