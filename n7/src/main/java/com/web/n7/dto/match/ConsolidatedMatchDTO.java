package com.web.n7.dto.match;

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
public class ConsolidatedMatchDTO {
    private Long matchId;
    private String title;
    private String description;
    private LocalDateTime matchDate;
    private String location;
    private Integer homeScore;
    private Integer awayScore;
    private MatchStatus status;
    private List<MatchSheetDTO> matchSheets;
}