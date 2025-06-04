package com.web.n7.dto.teams;

import com.web.n7.dto.common.CompetitionDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamCompetitionsDTO {
    private Long teamId;
    private String teamName;
    private List<CompetitionDTO> competitions;
}