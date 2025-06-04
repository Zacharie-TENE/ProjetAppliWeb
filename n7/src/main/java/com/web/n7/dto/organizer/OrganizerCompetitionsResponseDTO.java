package com.web.n7.dto.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerCompetitionsResponseDTO {
    private Long organizerId;
    private String organizerName;
    private Integer totalCompetitions;
    private Integer upcomingCompetitions;
    private Integer activeCompetitions;
    private Integer completedCompetitions;
    private Integer cancelledCompetitions;
    private List<OrganizerCompetitionDTO> competitions = new ArrayList<>();
}