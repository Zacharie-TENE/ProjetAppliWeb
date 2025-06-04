package com.web.n7.serviceInterface;

import java.util.List;

import com.web.n7.dto.coach.CreateTeamDTO;
import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdateTeamDTO;
import com.web.n7.dto.teams.StandingDTO;
import com.web.n7.dto.teams.TeamDTO;

import com.web.n7.dto.organizer.OrganizerTeamSummaryDTO;
import com.web.n7.dto.users.CoachDTO;
import com.web.n7.filter.TeamFilter;


/**
 * Services liés à la gestion des équipes
 */
public interface TeamService {
    // Gestion des équipes (par les coachs)
    TeamDTO createTeam(Long coachId, CreateTeamDTO createTeamDTO);
    TeamDTO updateTeam(Long coachId, UpdateTeamDTO updateTeamDTO);
    void deleteTeam(Long coachId, Long teamId);
    List<TeamDTO> getAllTeamsByCoach(Long coachId);
    
    // Gestion des joueurs dans les équipes
    TeamDTO addPlayerToTeam(Long coachId, Long teamId, RegisterPlayerDTO playerDTO);
    TeamDTO removePlayerFromTeam(Long coachId, Long teamId, Long playerId);
    void transferPlayer(Long coachId, Long sourceTeamId, Long targetTeamId, Long playerId);
    
    // Récupération des informations sur les équipes (par les organisateurs)
    List<OrganizerTeamSummaryDTO> getTeamsByCompetition(Long organizerId, Long competitionId);
    List<CoachDTO> getCoachesByCompetition(Long organizerId, Long competitionId);
    

    //methodes generiques
    List<TeamDTO> getAllTeams(TeamFilter filter);
    TeamDTO getTeamById(Long teamId);
    List<TeamDTO> getTeamsByCoachId(Long coachId, TeamFilter filter);
    List<TeamDTO> getTeamsByCompetitionId(Long competitionId, TeamFilter filter);
    List<TeamDTO> getTeamsByPlayerId(Long playerId, TeamFilter filter);
    List<StandingDTO> getTeamStandingsByTeamId(Long teamId);
    List<StandingDTO> getTeamStandingsByCompetitionId(Long competitionId);
    StandingDTO getTeamStandingByCompetitionIdAndTeamId(Long competitionId, Long teamId);
}