package com.web.n7.serviceInterface;

import java.util.List;

import com.web.n7.dto.coach.CoachMatchSheetManagementDTO;
import com.web.n7.dto.coach.CoachMatchSheetsResponseDTO;
import com.web.n7.dto.match.*;
import com.web.n7.filter.MatchFilter;

/**
 * Services liés à la gestion des matchs
 */
public interface MatchService {

     
     // Gestion des matchs (par les organisateurs)
    MatchDTO scheduleMatch(Long organizerId, MatchDTO matchDTO);
    MatchDTO updateMatchStatus(Long organizerId, MatchStatusUpdateDTO matchStatusUpdateDTO, String reason);
    MatchDTO updateMatchInfo(Long organizerId, MatchDTO matchDTO);
    MatchDTO updateMatchScore(Long organizerId, MatchScoreUpdateDTO matchScoreUpdateDTO);
    List<MatchParticipantDTO> updateMatchParticipants(Long organizerId, Long matchId, List<MatchParticipantDTO> participants);
    
    // Validation des feuilles de match (par les organisateurs)
    MatchSheetDTO validateMatchSheet(Long organizerId, MatchSheetValidationDTO matchSheetValidationDTO, String comments);
    
    // Gestion des feuilles de match (par les coachs)
    CoachMatchSheetsResponseDTO getMatchSheetsByTeamAndCoach(Long coachId, Long teamId);
    CoachMatchSheetsResponseDTO getMatchSheetsByCoach(Long coachId);
    CoachMatchSheetManagementDTO getMatchSheet(Long coachId, Long matchSheetId);
    CoachMatchSheetManagementDTO updateMatchSheet(Long coachId, Long matchSheetId, CoachMatchSheetManagementDTO matchSheetDTO);

    //methode generiques
    List<MatchDTO> getMatchesByTeamId(Long teamId, MatchFilter filter);
    List<MatchDTO> getMatchesByCompetitionId(Long competitionId, MatchFilter filter);
    List<MatchSheetDTO> getMatchSheetByMatchId(Long matchId);
    MatchSheetDTO getMatchSheetBy(Long matchSheetId);
    ConsolidatedMatchDTO getConsolidatedMatchSheetByMatchId(Long matchId);
    MatchSheetDTO getMatchByTeamId(Long teamId, Long matchId);
    List<MatchDTO> getMatchesByPlayerId(Long playerId);

    List<MatchDTO> getAllMatches(MatchFilter filter);
    MatchDTO getMatchById(Long matchId);
}