package com.web.n7.dto.match;

import com.web.n7.model.enumeration.match.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchStatusUpdateDTO {
    private Long matchId;
    private MatchStatus newStatus;
   private  LocalDateTime dateTime;
}