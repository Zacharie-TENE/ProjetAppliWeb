package com.web.n7.serviceInterface;

import java.util.List;


import com.web.n7.dto.common.CompetitionDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionStatusUpdateDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionsResponseDTO;
import com.web.n7.dto.organizer.TeamCompetitionStatusUpdateDTO;
import com.web.n7.dto.coach.CoachCompetitionRequestDTO;
import com.web.n7.filter.CompetitionFilter;


/**
 * Services liés à la gestion des compétitions 
 */
public interface CompetitionService {

 
   // Gestion des compétitions (par les organisateurs)
    OrganizerCompetitionDTO createCompetition(Long organizerId, OrganizerCompetitionDTO competitionDTO);
    OrganizerCompetitionDTO updateCompetition(Long organizerId, Long competitionId, OrganizerCompetitionDTO competitionDTO);
    void deleteCompetition(Long organizerId, Long competitionId);
    OrganizerCompetitionsResponseDTO getCompetitionsByOrganizer(Long organizerId, CompetitionFilter filter);
   // OrganizerCompetitionDTO getCompetitionById(Long organizerId, Long competitionId);
    OrganizerCompetitionDTO updateCompetitionStatus(Long organizerId, OrganizerCompetitionStatusUpdateDTO statusUpdateDTO, String reason);
    
    // Gestion des inscriptions aux compétitions (par les organisateurs)
    void updateTeamCompetitionStatus(Long organizerId, TeamCompetitionStatusUpdateDTO statusUpdateDTO, String reason);
    void processCompetitionRequest(Long organizerId, Long requestId, boolean approved, String reason);
    
    // Demandes d'inscription/retrait (par les coachs)
    CoachCompetitionRequestDTO requestTeamRegistration(Long coachId, Long teamId, Long competitionId, String reason);
    CoachCompetitionRequestDTO requestTeamWithdrawal(Long coachId, Long teamId, Long competitionId, String reason);
    void requestTeamsWithdrawalIntoAllCompetition(Long coachId, Long teamId, String reason);
    List<CoachCompetitionRequestDTO> getCompetitionRequestsByCoach(Long coachId);



    //methode generique
    List<CompetitionDTO> getCompetitionsByTeamId(Long teamId,CompetitionFilter filter);
    CompetitionDTO getCompetitionById(Long competitionId);
    List<CompetitionDTO> getAllCompetitions(CompetitionFilter filter);

    List<CompetitionDTO> getCompetitionsByUserId(Long userId);
    
    // Récupération des demandes par compétition (pour les organisateurs)
    List<CoachCompetitionRequestDTO> getRequestsByCompetitionId(Long organizerId, Long competitionId);

}