package com.web.n7.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.n7.dto.coach.CoachMatchSheetManagementDTO;
import com.web.n7.dto.coach.CoachMatchSheetsResponseDTO;
import com.web.n7.dto.match.*;
import com.web.n7.filter.MatchFilter;
import com.web.n7.model.Competition;
import com.web.n7.model.Match;
import com.web.n7.model.MatchParticipant;
import com.web.n7.model.MatchSheet;
import com.web.n7.model.Team;
import com.web.n7.model.enumeration.match.MatchRole;
import com.web.n7.model.enumeration.match.MatchSheetStatus;
import com.web.n7.model.enumeration.match.MatchStatus;
import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Player;
import com.web.n7.repository.CompetitionRepository;
import com.web.n7.repository.CoachRepository;
import com.web.n7.repository.MatchParticipantRepository;
import com.web.n7.repository.MatchRepository;
import com.web.n7.repository.MatchSheetRepository;
import com.web.n7.repository.PlayerRepository;
import com.web.n7.repository.TeamRepository;
import com.web.n7.serviceInterface.MatchService;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    // Injection des repositories nécessaires
    private final MatchRepository matchRepository;
    private final MatchParticipantRepository matchParticipantRepository;
    private final MatchSheetRepository matchSheetRepository;
    private final CompetitionRepository competitionRepository;
    private final TeamRepository teamRepository;
    private final CoachRepository coachRepository;
    private final PlayerRepository playerRepository;
    
    @Override
    @Transactional
    public MatchDTO scheduleMatch(Long organizerId, MatchDTO matchDTO) {
        // Récupérer la compétition
        Competition competition = competitionRepository.findById(matchDTO.getCompetitionId())
                .orElseThrow(() -> new RuntimeException("Compétition non trouvée"));
        
        // Créer le match
        Match match = Match.builder()
                .title(matchDTO.getTitle())
                .competition(competition)
                .matchDate(matchDTO.getScheduledDateTime())
                .status(MatchStatus.SCHEDULED)
                .round(matchDTO.getRound())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Sauvegarder le match
        Match savedMatch = matchRepository.save(match);
        
        // Ajouter les participants (équipes)
        List<MatchParticipant> participants = new ArrayList<>();
        if (matchDTO.getParticipants() != null && !matchDTO.getParticipants().isEmpty()) {
            for (MatchParticipantDTO participantDTO : matchDTO.getParticipants()) {
                Team team = teamRepository.findById(participantDTO.getTeamId())
                        .orElseThrow(() -> new RuntimeException("Équipe non trouvée: " + participantDTO.getTeamId()));
                
                MatchParticipant participant = MatchParticipant.builder()
                        .match(savedMatch)
                        .team(team)
                        .role(participantDTO.getRole())
                        .build();
                
                participants.add(matchParticipantRepository.save(participant));
            }
        }
        
        savedMatch.setParticipants(participants);
        
        // Convertir en DTO et retourner
        return mapMatchToMatchDTO(savedMatch);
    }

    @Override
    @Transactional
    public MatchDTO updateMatchStatus(Long organizerId, MatchStatusUpdateDTO matchStatusUpdateDTO, String reason) {
        // Récupérer le match
        Match match = matchRepository.findById(matchStatusUpdateDTO.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        
        // Mettre à jour le statut
        match.setStatus(matchStatusUpdateDTO.getNewStatus());
        if (matchStatusUpdateDTO.getDateTime() != null) {
            match.setMatchDate(matchStatusUpdateDTO.getDateTime());
        }
        match.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder les modifications
        Match updatedMatch = matchRepository.save(match);
        
        // Convertir en DTO et retourner
        return mapMatchToMatchDTO(updatedMatch);
    }

    @Override
    @Transactional
    public MatchDTO updateMatchInfo(Long organizerId, MatchDTO matchDTO) {
        // Récupérer le match
        Match match = matchRepository.findById(matchDTO.getId())
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        
        // Mettre à jour les informations
        match.setTitle(matchDTO.getTitle());
        match.setMatchDate(matchDTO.getScheduledDateTime());
        match.setRound(matchDTO.getRound());
        match.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder les modifications
        Match updatedMatch = matchRepository.save(match);
        
        // Convertir en DTO et retourner
        return mapMatchToMatchDTO(updatedMatch);
    }

    @Override
    @Transactional
    public MatchDTO updateMatchScore(Long organizerId, MatchScoreUpdateDTO matchScoreUpdateDTO) {
        // Récupérer le match
        Match match = matchRepository.findById(matchScoreUpdateDTO.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        
        // Mettre à jour le score
        match.setHomeScore(matchScoreUpdateDTO.getHomeScore());
        match.setAwayScore(matchScoreUpdateDTO.getAwayScore());
        match.setUpdatedAt(LocalDateTime.now());
        
        // Si le match n'est pas déjà terminé, le marquer comme terminé
        if (match.getStatus() != MatchStatus.COMPLETED) {
            match.setStatus(MatchStatus.COMPLETED);
        }
        
        // Sauvegarder les modifications
        Match updatedMatch = matchRepository.save(match);
        
        // Convertir en DTO et retourner
        return mapMatchToMatchDTO(updatedMatch);
    }

    @Override
    @Transactional
    public List<MatchParticipantDTO> updateMatchParticipants(Long organizerId, Long matchId, List<MatchParticipantDTO> participants) {
        // Récupérer le match
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        
        // Supprimer les participants existants
        match.getParticipants().clear();
        matchParticipantRepository.deleteAll(match.getParticipants());
        
        // Ajouter les nouveaux participants
        List<MatchParticipant> newParticipants = new ArrayList<>();
        for (MatchParticipantDTO participantDTO : participants) {
            Team team = teamRepository.findById(participantDTO.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Équipe non trouvée: " + participantDTO.getTeamId()));
            
            MatchParticipant participant = MatchParticipant.builder()
                    .match(match)
                    .team(team)
                    .role(participantDTO.getRole())
                    .build();
            
            newParticipants.add(matchParticipantRepository.save(participant));
        }
        
        match.setParticipants(newParticipants);
        match.setUpdatedAt(LocalDateTime.now());
        matchRepository.save(match);
        
        // Convertir en DTOs et retourner
        return newParticipants.stream()
                .map(this::mapMatchParticipantToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatchSheetDTO validateMatchSheet(Long organizerId, MatchSheetValidationDTO matchSheetValidationDTO, String comments) {
        // Récupérer la feuille de match
        MatchSheet matchSheet = matchSheetRepository.findById(matchSheetValidationDTO.getMatchSheetId())
                .orElseThrow(() -> new RuntimeException("Feuille de match non trouvée"));
        
        // Mettre à jour le statut
        matchSheet.setStatus(matchSheetValidationDTO.getNewStatus());
        matchSheet.setValidationDate(LocalDateTime.now());
        matchSheet.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder les modifications
        MatchSheet validatedMatchSheet = matchSheetRepository.save(matchSheet);
        
        // Convertir en DTO et retourner
        return mapMatchSheetToDTO(validatedMatchSheet);
    }

    @Override
    public CoachMatchSheetsResponseDTO getMatchSheetsByTeamAndCoach(Long coachId, Long teamId) {
        // Vérifier que le coach existe
        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach non trouvé"));
        
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));
        
        if (!team.getCoach().getId().equals(coachId)) {
            throw new RuntimeException("Cette équipe n'appartient pas à ce coach");
        }
        
        // Récupérer les feuilles de match de l'équipe
        List<MatchSheet> matchSheets = matchSheetRepository.findByTeamId(teamId);
        
        // Calculer les statistiques
        int totalMatchSheets = matchSheets.size();
        int pendingMatchSheets = (int) matchSheets.stream()
                .filter(ms -> ms.getStatus() == MatchSheetStatus.ONGOING || ms.getStatus() == MatchSheetStatus.SUBMITTED)
                .count();
        int validatedMatchSheets = (int) matchSheets.stream()
                .filter(ms -> ms.getStatus() == MatchSheetStatus.VALIDATED)
                .count();
        
        // Convertir en DTOs
        List<CoachMatchSheetManagementDTO> matchSheetDTOs = matchSheets.stream()
                .map(this::mapMatchSheetToCoachDTO)
                .collect(Collectors.toList());
        
        // Créer et retourner la réponse
        return CoachMatchSheetsResponseDTO.builder()
                .coachId(coachId)
                .coachName(coach.getFirstName() + " " + coach.getLastName())
                .teamId(teamId)
                .teamName(team.getName())
                .totalMatchSheets(totalMatchSheets)
                .pendingMatchSheets(pendingMatchSheets)
                .validatedMatchSheets(validatedMatchSheets)
                .matchSheets(matchSheetDTOs)
                .build();
    }

    @Override
    public CoachMatchSheetsResponseDTO getMatchSheetsByCoach(Long coachId) {
        // Vérifier que le coach existe
        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach non trouvé"));
        
        // Récupérer toutes les équipes du coach
        List<Team> teams = teamRepository.findByCoachId(coachId);
        
        // Récupérer les feuilles de match pour toutes les équipes du coach
        List<MatchSheet> allMatchSheets = new ArrayList<>();
        for (Team team : teams) {
            allMatchSheets.addAll(matchSheetRepository.findByTeamId(team.getId()));
        }
        
        // Calculer les statistiques
        int totalMatchSheets = allMatchSheets.size();
        int pendingMatchSheets = (int) allMatchSheets.stream()
                .filter(ms -> ms.getStatus() == MatchSheetStatus.ONGOING || ms.getStatus() == MatchSheetStatus.SUBMITTED)
                .count();
        int validatedMatchSheets = (int) allMatchSheets.stream()
                .filter(ms -> ms.getStatus() == MatchSheetStatus.VALIDATED)
                .count();
        
        // Convertir en DTOs
        List<CoachMatchSheetManagementDTO> matchSheetDTOs = allMatchSheets.stream()
                .map(this::mapMatchSheetToCoachDTO)
                .collect(Collectors.toList());
        
        // Créer et retourner la réponse
        return CoachMatchSheetsResponseDTO.builder()
                .coachId(coachId)
                .coachName(coach.getFirstName() + " " + coach.getLastName())
                .totalMatchSheets(totalMatchSheets)
                .pendingMatchSheets(pendingMatchSheets)
                .validatedMatchSheets(validatedMatchSheets)
                .matchSheets(matchSheetDTOs)
                .build();
    }

    @Override
    public CoachMatchSheetManagementDTO getMatchSheet(Long coachId, Long matchSheetId) {
        // Vérifier que le coach existe
        coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach non trouvé"));
        
        // Récupérer la feuille de match
        MatchSheet matchSheet = matchSheetRepository.findById(matchSheetId)
                .orElseThrow(() -> new RuntimeException("Feuille de match non trouvée"));
        
        // Vérifier que la feuille de match appartient à une équipe du coach
        if (!matchSheet.getTeam().getCoach().getId().equals(coachId)) {
            throw new RuntimeException("Cette feuille de match n'appartient pas à une équipe de ce coach");
        }
        
        // Convertir en DTO et retourner
        return mapMatchSheetToCoachDTO(matchSheet);
    }

    @Override
    @Transactional
    public CoachMatchSheetManagementDTO updateMatchSheet(Long coachId, Long matchSheetId, CoachMatchSheetManagementDTO matchSheetDTO) {
        // Vérifier que le coach existe
        coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach non trouvé"));
        
        // Récupérer la feuille de match
        MatchSheet matchSheet = matchSheetRepository.findById(matchSheetId)
                .orElseThrow(() -> new RuntimeException("Feuille de match non trouvée"));
        
        // Vérifier que la feuille de match appartient à une équipe du coach
        if (!matchSheet.getTeam().getCoach().getId().equals(coachId)) {
            throw new RuntimeException("Cette feuille de match n'appartient pas à une équipe de ce coach");
        }
        
        // Mettre à jour la feuille de match
        matchSheet.setStrategy(matchSheetDTO.getStrategy());
        matchSheet.setUpdatedAt(LocalDateTime.now());
        
        // Si le coach soumet la feuille, mettre à jour le statut
        if (matchSheetDTO.getStatus() == MatchSheetStatus.SUBMITTED && matchSheet.getStatus() != MatchSheetStatus.SUBMITTED) {
            matchSheet.setStatus(MatchSheetStatus.SUBMITTED);
        }
        
        // Sauvegarder les modifications
        MatchSheet updatedMatchSheet = matchSheetRepository.save(matchSheet);
        
        // Convertir en DTO et retourner
        return mapMatchSheetToCoachDTO(updatedMatchSheet);
    }

    @Override
    public List<MatchDTO> getMatchesByTeamId(Long teamId, MatchFilter filter) {
        // Récupérer tous les matchs pour l'équipe spécifiée
        List<Match> matches = matchRepository.findByTeamId(teamId);
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            matches = applyMatchFilters(matches, filter);
        }
        
        // Convertir en DTOs et retourner
        return matches.stream()
                .map(this::mapMatchToMatchDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchDTO> getMatchesByCompetitionId(Long competitionId, MatchFilter filter) {
        // Récupérer tous les matchs pour la compétition spécifiée
        List<Match> matches = matchRepository.findByCompetitionId(competitionId);
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            matches = applyMatchFilters(matches, filter);
        }
        
        // Convertir en DTOs et retourner
        return matches.stream()
                .map(this::mapMatchToMatchDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchSheetDTO> getMatchSheetByMatchId(Long matchId) {
        // Récupérer toutes les feuilles de match pour le match spécifié
        List<MatchSheet> matchSheets = matchSheetRepository.findByMatchId(matchId);
        
        // Convertir en DTOs et retourner
        return matchSheets.stream()
                .map(this::mapMatchSheetToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MatchSheetDTO getMatchSheetBy(Long matchSheetId) {
        // Récupérer la feuille de match
        MatchSheet matchSheet = matchSheetRepository.findById(matchSheetId)
                .orElseThrow(() -> new RuntimeException("Feuille de match non trouvée"));
        
        // Convertir en DTO et retourner
        return mapMatchSheetToDTO(matchSheet);
    }

    @Override
    public ConsolidatedMatchDTO getConsolidatedMatchSheetByMatchId(Long matchId) {
        // Récupérer le match
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        
        // Récupérer toutes les feuilles de match associées
        List<MatchSheet> matchSheets = matchSheetRepository.findByMatchId(matchId);
        
        // Convertir les feuilles de match en DTOs
        List<MatchSheetDTO> matchSheetDTOs = matchSheets.stream()
                .map(this::mapMatchSheetToDTO)
                .collect(Collectors.toList());
        
        // Créer et retourner la réponse consolidée
        return ConsolidatedMatchDTO.builder()
                .matchId(match.getId())
                .title(match.getTitle())
                .description(match.getDescription())
                .matchDate(match.getMatchDate())
                .location(match.getLocation())
                .homeScore(match.getHomeScore())
                .awayScore(match.getAwayScore())
                .status(match.getStatus())
                .matchSheets(matchSheetDTOs)
                .build();
    }

    @Override
    public MatchSheetDTO getMatchByTeamId(Long teamId, Long matchId) {
        // Récupérer la feuille de match pour l'équipe et le match spécifiés
        MatchSheet matchSheet = matchSheetRepository.findByTeamIdAndMatchId(teamId, matchId);
        
        if (matchSheet == null) {
            throw new RuntimeException("Feuille de match non trouvée pour cette équipe et ce match");
        }
        
        // Convertir en DTO et retourner
        return mapMatchSheetToDTO(matchSheet);
    }

    @Override
    public List<MatchDTO> getMatchesByPlayerId(Long playerId) {
        // Vérifier que le joueur existe
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        
        // Récupérer toutes les feuilles de match où le joueur participe
        List<MatchSheet> playerMatchSheets = matchSheetRepository.findByPlayerId(playerId);
        
        // Extraire les matchs uniques
        List<Match> matches = playerMatchSheets.stream()
                .map(MatchSheet::getMatch)
                .distinct()
                .collect(Collectors.toList());
        
        // Convertir en DTOs et retourner
        return matches.stream()
                .map(this::mapMatchToMatchDTO)
                .collect(Collectors.toList());
    }
    
    // Méthodes utilitaires pour l'application des filtres
    private List<Match> applyMatchFilters(List<Match> matches, MatchFilter filter) {
        List<Match> filteredMatches = new ArrayList<>(matches);
        
        // Filtrer par statut
        if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
            try {
                MatchStatus status = MatchStatus.valueOf(filter.getStatus());
                filteredMatches = filteredMatches.stream()
                        .filter(m -> m.getStatus() == status)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Ignorer si le statut n'est pas valide
            }
        }
        
        // Filtrer par titre
        if (filter.getTitle() != null && !filter.getTitle().isEmpty()) {
            filteredMatches = filteredMatches.stream()
                    .filter(m -> m.getTitle().toLowerCase().contains(filter.getTitle().toLowerCase()))
                    .collect(Collectors.toList());
        }
        
        // Filtrer par dates
        if (filter.getStartDate() != null) {
            LocalDateTime startOfDay = filter.getStartDate().atStartOfDay();
            filteredMatches = filteredMatches.stream()
                    .filter(m -> m.getMatchDate().isAfter(startOfDay) || m.getMatchDate().isEqual(startOfDay))
                    .collect(Collectors.toList());
        }
        
        if (filter.getEndDate() != null) {
            LocalDateTime endOfDay = filter.getEndDate().atTime(23, 59, 59);
            filteredMatches = filteredMatches.stream()
                    .filter(m -> m.getMatchDate().isBefore(endOfDay) || m.getMatchDate().isEqual(endOfDay))
                    .collect(Collectors.toList());
        }
        
        return filteredMatches;
    }
    
    // Méthodes de mapping des entités vers les DTOs
    private MatchDTO mapMatchToMatchDTO(Match match) {
        List<MatchParticipantDTO> participantDTOs = match.getParticipants().stream()
                .map(this::mapMatchParticipantToDTO)
                .collect(Collectors.toList());
        
        return MatchDTO.builder()
                .id(match.getId())
                .title(match.getTitle())
                .competitionId(match.getCompetition().getId())
                .competitionName(match.getCompetition().getName())
                .competitionType(match.getCompetition().getType().name())
                .scheduledDateTime(match.getMatchDate())
                .participants(participantDTOs)
                .status(match.getStatus())
                .matchSheetStatus(MatchSheetStatus.VALIDATED.name())
                .homeTeamScore(match.getHomeScore())
                .awayTeamScore(match.getAwayScore())
                .round(match.getRound())
                .hasMatchsheet(!match.getMatchSheets().isEmpty())
                .build();
    }
    
    private MatchParticipantDTO mapMatchParticipantToDTO(MatchParticipant participant) {
        return MatchParticipantDTO.builder()
                .id(participant.getId())
                .teamId(participant.getTeam().getId())
                .teamName(participant.getTeam().getName())
                .role(participant.getRole())
                .build();
    }
    
    private MatchSheetDTO mapMatchSheetToDTO(MatchSheet matchSheet) {
        Team team = matchSheet.getTeam();
        Match match = matchSheet.getMatch();
        
        // Déterminer le rôle de l'équipe (HOME ou AWAY)
        MatchRole teamRole = match.getParticipants().stream()
                .filter(p -> p.getTeam().getId().equals(team.getId()))
                .map(MatchParticipant::getRole)
                .findFirst()
                .orElse(null);
        
        // Déterminer les scores
        Integer teamScore = null;
        Integer opponentScore = null;
        if (match.getHomeScore() != null && match.getAwayScore() != null) {
            if (teamRole == MatchRole.HOME) {
                teamScore = match.getHomeScore();
                opponentScore = match.getAwayScore();
            } else if (teamRole == MatchRole.AWAY) {
                teamScore = match.getAwayScore();
                opponentScore = match.getHomeScore();
            }
        }
        
        return MatchSheetDTO.builder()
                .id(matchSheet.getId())
                .matchId(match.getId())
                .matchTitle(match.getTitle())
                .teamId(team.getId())
                .teamName(team.getName())
                .teamRole(teamRole)
                .competitionId(match.getCompetition().getId())
                .competitionName(match.getCompetition().getName())
                .matchDateTime(match.getMatchDate())
                .venue(match.getLocation())
                .teamScore(teamScore)
                .opponentScore(opponentScore)
                .status(matchSheet.getStatus().name())
                .playerParticipations(mapPlayerParticipations(matchSheet))
                .validatedAt(matchSheet.getValidationDate())
                .strategy(matchSheet.getStrategy())
                .build();
    }
    
    private List<PlayerParticipationDTO> mapPlayerParticipations(MatchSheet matchSheet) {
        if (matchSheet.getPlayerParticipations() == null) {
            return new ArrayList<>();
        }
        
        return matchSheet.getPlayerParticipations().stream()
                .map(pp -> PlayerParticipationDTO.builder()
                        .id(pp.getId())
                        .playerId(pp.getPlayer().getId())
                        .playerName(pp.getPlayer().getFirstName() + " " + pp.getPlayer().getLastName())
                        .matchSheetId(matchSheet.getId())
                        .shirtNumber(pp.getShirtNumber())
                        .playerStatus(pp.getStatus())
                        .position(pp.getPosition())
                        .goalsScored(pp.getGoalsScored())
                        .yellowCards(pp.getYellowCards())
                        .redCards(pp.getRedCards())
                        .minutesPlayed(pp.getMinutesPlayed())
                        .substitutionInTime(pp.getSubstitutionInTime())
                        .substitutionOutTime(pp.getSubstitutionOutTime())
                        .createdAt(pp.getCreatedAt())
                        .updatedAt(pp.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    private CoachMatchSheetManagementDTO mapMatchSheetToCoachDTO(MatchSheet matchSheet) {
        Match match = matchSheet.getMatch();
        Team team = matchSheet.getTeam();
        
        return CoachMatchSheetManagementDTO.builder()
                .id(matchSheet.getId())
                .matchId(match.getId())
                .matchTitle(match.getTitle())
                .matchLocation(match.getLocation())
                .matchDate(match.getMatchDate())
                .competitionName(match.getCompetition().getName())
                .teamId(team.getId())
                .teamName(team.getName())
                .status(matchSheet.getStatus())
                .validationDate(matchSheet.getValidationDate())
                .submissionDeadline(matchSheet.getSubmissionDeadline())
                .strategy(matchSheet.getStrategy())
                .playerParticipations(mapPlayerParticipations(matchSheet))
                .createdAt(matchSheet.getCreatedAt())
                .updatedAt(matchSheet.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchDTO> getAllMatches(MatchFilter filter) {
      if(filter == null){
        return matchRepository.findAll().stream()
        .map(this::mapMatchToMatchDTO)
        .collect(Collectors.toList());
      }

      List<Match> matches = matchRepository.findAll();
              // Convertir les entités en DTOs
        return matches.stream()
              .map(this::mapMatchToMatchDTO)
              .collect(Collectors.toList());

}

    @Override
    @Transactional(readOnly = true)
    public MatchDTO getMatchById(Long matchId) {
       
   return matchRepository.findById(matchId)
   .map(this::mapMatchToMatchDTO)
   .orElseThrow(() -> new RuntimeException("Match non trouvé"));
    }

}