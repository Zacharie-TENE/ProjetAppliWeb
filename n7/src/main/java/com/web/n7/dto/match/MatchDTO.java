package com.web.n7.dto.match;

import com.web.n7.model.enumeration.match.MatchSheetStatus;
import com.web.n7.model.enumeration.match.MatchStatus;
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
public class MatchDTO {
    private Long id;
    private String title;
    private Long competitionId;
    private String competitionName;
    private String competitionType;
    private LocalDateTime scheduledDateTime;
    private List<MatchParticipantDTO> participants;

    private MatchStatus status;
    private Integer homeTeamScore;
    private Integer awayTeamScore;
    private String matchSheetStatus;
    private int round;
    private Boolean hasMatchsheet;


}