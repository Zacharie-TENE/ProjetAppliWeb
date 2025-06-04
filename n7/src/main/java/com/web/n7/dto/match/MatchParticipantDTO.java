package com.web.n7.dto.match;

import com.web.n7.model.enumeration.match.MatchRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchParticipantDTO {
    private Long id;
    private Long teamId;
    private String teamName;
    private MatchRole role;
}