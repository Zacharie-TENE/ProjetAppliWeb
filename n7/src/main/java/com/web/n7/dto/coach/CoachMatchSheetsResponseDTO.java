package com.web.n7.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
//les feuilles de match de toutes les équipes du coach
public class CoachMatchSheetsResponseDTO {
    private Long coachId;
    private String coachName;
    private Long teamId;
    private String teamName;
    private int totalMatchSheets;
    private int pendingMatchSheets;
    private int validatedMatchSheets;
    private List<CoachMatchSheetManagementDTO> matchSheets;
}