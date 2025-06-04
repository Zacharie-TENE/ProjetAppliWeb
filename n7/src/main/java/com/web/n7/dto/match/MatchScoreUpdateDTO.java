package com.web.n7.dto.match;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchScoreUpdateDTO {
    private Long matchId;
    private Integer homeScore;
    private Integer awayScore;
}