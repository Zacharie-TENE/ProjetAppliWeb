package com.web.n7.dto.coach;

import com.web.n7.dto.teams.TeamDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
//Pour retourner la liste des équipes d'un coach
public class CoachTeamsDTO {
    private Long coachId;
    private String coachName;
    private List<TeamDTO> teams;
}