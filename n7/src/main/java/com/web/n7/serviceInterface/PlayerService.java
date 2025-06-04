package com.web.n7.serviceInterface;

import java.util.List;

import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdatePlayerDTO;
import com.web.n7.dto.organizer.OrganizerPlayerPerformanceDTO;
import com.web.n7.dto.player.PlayerPerformanceDTO;
import com.web.n7.dto.users.PlayerDTO;
import com.web.n7.filter.PlayerFilters;


/**
 * Services liés à la gestion des joueurs
 */
public interface PlayerService {
      
   // Gestion des joueurs (par les coachs)
    PlayerDTO registerPlayer(Long coachId, Long teamId, RegisterPlayerDTO playerDTO);
    PlayerDTO updatePlayer(Long coachId, UpdatePlayerDTO playerDTO);
    void removePlayer(Long coachId, Long playerId);
    List<PlayerDTO> getPlayersByCoach(Long coachId);
    List<PlayerDTO> getPlayersByTeam(Long coachId, Long teamId);
    
    // Informations sur les joueurs (par les organisateurs)
    List<PlayerDTO> getPlayersByCompetition(Long organizerId, Long competitionId);
    
    // Performances des joueurs
    OrganizerPlayerPerformanceDTO updatePlayerMatchPerformance(Long organizerId, OrganizerPlayerPerformanceDTO playerPerformanceDTO);

    List<PlayerDTO> getAllPlayers(PlayerFilters filter);
    PlayerDTO getPlayerById(Long playerId);
    List <PlayerPerformanceDTO> getPlayerPerformance(Long PlayerId, PlayerFilters filter);

}