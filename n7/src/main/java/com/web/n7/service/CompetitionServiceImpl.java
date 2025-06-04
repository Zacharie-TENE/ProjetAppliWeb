package com.web.n7.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.n7.dto.common.CompetitionDTO;
import com.web.n7.dto.coach.CoachCompetitionRequestDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionStatusUpdateDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionsResponseDTO;
import com.web.n7.dto.organizer.OrganizerTeamSummaryDTO;
import com.web.n7.dto.organizer.TeamCompetitionStatusUpdateDTO;
import com.web.n7.filter.CompetitionFilter;
import com.web.n7.model.Competition;
import com.web.n7.model.CompetitionRequest;
import com.web.n7.model.CompetitionTeam;
import com.web.n7.model.Match;
import com.web.n7.model.Team;
import com.web.n7.model.enumeration.competition.CompetitionStatus;
import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;
import com.web.n7.model.enumeration.competition.CompetitionType;
import com.web.n7.model.enumeration.competition.RequestStatus;
import com.web.n7.model.enumeration.competition.RequestType;
import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Organizer;
import com.web.n7.model.users.User;
import com.web.n7.repository.CompetitionRepository;
import com.web.n7.repository.CompetitionRequestRepository;
import com.web.n7.repository.CompetitionTeamRepository;
import com.web.n7.repository.MatchRepository;
import com.web.n7.repository.TeamRepository;
import com.web.n7.repository.UserRepository;
import com.web.n7.serviceInterface.CompetitionService;
import com.web.n7.exception.ResourceNotFoundException;
import com.web.n7.exception.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class CompetitionServiceImpl implements CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final CompetitionRequestRepository competitionRequestRepository;
    private final CompetitionTeamRepository competitionTeamRepository;
    private final MatchRepository matchRepository;
    
    @Override
    @Transactional
    public OrganizerCompetitionDTO createCompetition(Long organizerId, OrganizerCompetitionDTO competitionDTO) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Créer et sauvegarder la nouvelle compétition
        CompetitionType competitionType = competitionDTO.getCompetitionType();
        if (competitionType == null) {
            // Définir une valeur par défaut si le type est null
            competitionType = CompetitionType.TOURNAMENT;
        }
        
        Competition competition = Competition.builder()
                .name(competitionDTO.getName())
                .description(competitionDTO.getDescription())
                .startDate(competitionDTO.getStartDate())
                .endDate(competitionDTO.getEndDate())
                .location(competitionDTO.getLocation())
                .maxTeams(competitionDTO.getMaxTeams())
                .type(competitionType)
                .status(CompetitionStatus.UPCOMING) // Statut initial
                .organizer(organizer)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Competition savedCompetition = competitionRepository.save(competition);
        
        // Transformer l'entité en DTO et retourner
        return mapToOrganizerCompetitionDTO(savedCompetition);
    }

    @Override
    @Transactional
    public OrganizerCompetitionDTO updateCompetition(Long organizerId, Long competitionId, OrganizerCompetitionDTO competitionDTO) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la compétition et vérifier qu'elle appartient à l'organisateur
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette compétition n'appartient pas à cet organisateur");
        }
        
        // Mettre à jour les données de la compétition
        competition.setName(competitionDTO.getName());
        competition.setDescription(competitionDTO.getDescription());
        competition.setStartDate(competitionDTO.getStartDate());
        competition.setEndDate(competitionDTO.getEndDate());
        competition.setLocation(competitionDTO.getLocation());
        competition.setMaxTeams(competitionDTO.getMaxTeams());
        
        // Ne pas écraser le type de compétition avec une valeur nulle
        if (competitionDTO.getCompetitionType() != null) {
            competition.setType(competitionDTO.getCompetitionType());
        }
        
        competition.setUpdatedAt(LocalDateTime.now());
        
        Competition updatedCompetition = competitionRepository.save(competition);
        
        // Transformer l'entité en DTO et retourner
        return mapToOrganizerCompetitionDTO(updatedCompetition);
    }

    @Override
    @Transactional
    public void deleteCompetition(Long organizerId, Long competitionId) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la compétition et vérifier qu'elle appartient à l'organisateur
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette compétition n'appartient pas à cet organisateur");
        }
        
        // Supprimer la compétition
        competitionRepository.delete(competition);
    }

    // Méthode utilitaire pour convertir une entité Competition en OrganizerCompetitionDTO
    private OrganizerCompetitionDTO mapToOrganizerCompetitionDTO(Competition competition) {
        List<OrganizerTeamSummaryDTO> teams = competition.getCompetitionTeams().stream()
                .map(this::mapToOrganizerTeamSummaryDTO)
                .collect(Collectors.toList());
        
        // Compter les matchs
        List<Match> matches = matchRepository.findByCompetitionId(competition.getId());
        int totalMatches = matches.size();
        int completedMatches = (int) matches.stream().filter(match -> match.getStatus() == com.web.n7.model.enumeration.match.MatchStatus.COMPLETED).count();
        int upcomingMatches = totalMatches - completedMatches;
        
        return OrganizerCompetitionDTO.builder()
                .id(competition.getId())
                .name(competition.getName())
                .description(competition.getDescription())
                .competitionType(competition.getType())
                .status(competition.getStatus())
                .startDate(competition.getStartDate())
                .endDate(competition.getEndDate())
                .location(competition.getLocation())
                .maxTeams(competition.getMaxTeams())
                .registeredTeams(competition.getCompetitionTeams().size())
                .teams(teams)
                .totalMatches(totalMatches)
                .completedMatches(completedMatches)
                .upcomingMatches(upcomingMatches)
                .organizerId(competition.getOrganizer().getId())
                .organizerName(competition.getOrganizer().getFirstName() + " " + competition.getOrganizer().getLastName())
                .createdAt(competition.getCreatedAt())
                .updatedAt(competition.getUpdatedAt())
                .build();
    }
    
    // Méthode utilitaire pour convertir une entité CompetitionTeam en OrganizerTeamSummaryDTO
    private OrganizerTeamSummaryDTO mapToOrganizerTeamSummaryDTO(CompetitionTeam competitionTeam) {
        Team team = competitionTeam.getTeam();
        return OrganizerTeamSummaryDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .category(team.getCategory())
                .playerCount(team.getPlayers().size())
                .coachId(team.getCoach().getId())
                .coachName(team.getCoach().getFirstName() + " " + team.getCoach().getLastName())
                .status(competitionTeam.getStatus())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizerCompetitionsResponseDTO getCompetitionsByOrganizer(Long organizerId, CompetitionFilter filter) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer toutes les compétitions de l'organisateur
        List<Competition> competitions = competitionRepository.findByOrganizerId(organizerId);
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                competitions = competitions.stream()
                        .filter(c -> c.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                try {
                    CompetitionStatus status = CompetitionStatus.valueOf(filter.getStatus());
                    competitions = competitions.stream()
                            .filter(c -> c.getStatus() == status)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException ignored) {
                    // Ignorer si le statut n'est pas valide
                }
            }
            // Autres filtres...
        }
        
        // Convertir les entités en DTOs
        List<OrganizerCompetitionDTO> competitionDTOs = competitions.stream()
                .map(this::mapToOrganizerCompetitionDTO)
                .collect(Collectors.toList());
        
        // Compter les compétitions par statut
        int upcomingCompetitions = 0;
        int activeCompetitions = 0;
        int completedCompetitions = 0;
        int cancelledCompetitions = 0;
        
        for (Competition competition : competitions) {
            switch (competition.getStatus()) {
                case UPCOMING, REGISTRATION -> upcomingCompetitions++;
                case IN_PROGRESS -> activeCompetitions++;
                case COMPLETED -> completedCompetitions++;
                case CANCELLED -> cancelledCompetitions++;
            }
        }
        
        // Construire et retourner la réponse
        return OrganizerCompetitionsResponseDTO.builder()
                .organizerId(organizerId)
                .organizerName(organizer.getFirstName() + " " + organizer.getLastName())
                .totalCompetitions(competitions.size())
                .upcomingCompetitions(upcomingCompetitions)
                .activeCompetitions(activeCompetitions)
                .completedCompetitions(completedCompetitions)
                .cancelledCompetitions(cancelledCompetitions)
                .competitions(competitionDTOs)
                .build();
    }

//    @Override
//    public OrganizerCompetitionDTO getCompetitionById(Long organizerId, Long competitionId) {
//        // Implémentation de la récupération d'une compétition par ID pour un organisateur
//        return null;
//    }

    @Override
    @Transactional
    public OrganizerCompetitionDTO updateCompetitionStatus(Long organizerId, OrganizerCompetitionStatusUpdateDTO statusUpdateDTO, String reason) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la compétition et vérifier qu'elle appartient à l'organisateur
        Competition competition = competitionRepository.findById(statusUpdateDTO.getCompetitionId())
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + statusUpdateDTO.getCompetitionId()));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette compétition n'appartient pas à cet organisateur");
        }
        
        // Valider la transition de statut
        validateStatusTransition(competition.getStatus(), statusUpdateDTO.getNewStatus());
        
        // Mettre à jour le statut
        competition.setStatus(statusUpdateDTO.getNewStatus());
        competition.setUpdatedAt(LocalDateTime.now());
        
        // Si la compétition est annulée, rejeter toutes les demandes en attente
        if (statusUpdateDTO.getNewStatus() == CompetitionStatus.CANCELLED) {
            List<CompetitionRequest> pendingRequests = competitionRequestRepository.findByCompetitionIdAndRequestStatus(
                    competition.getId(), RequestStatus.PENDING);
            
            pendingRequests.forEach(request -> {
                request.setRequestStatus(RequestStatus.REJECTED);
                request.setResponseMessage("Compétition annulée: " + reason);
                request.setProcessedAt(LocalDateTime.now());
                request.setUpdatedAt(LocalDateTime.now());
                competitionRequestRepository.save(request);
            });
        }
        
        Competition updatedCompetition = competitionRepository.save(competition);
        
        // Transformer l'entité en DTO et retourner
        return mapToOrganizerCompetitionDTO(updatedCompetition);
    }
    
    // Méthode de validation des transitions de statut
    private void validateStatusTransition(CompetitionStatus currentStatus, CompetitionStatus newStatus) {
        boolean validTransition = switch (currentStatus) {
            case UPCOMING -> newStatus == CompetitionStatus.REGISTRATION || newStatus == CompetitionStatus.CANCELLED;
            case REGISTRATION -> newStatus == CompetitionStatus.IN_PROGRESS || newStatus == CompetitionStatus.CANCELLED;
            case IN_PROGRESS -> newStatus == CompetitionStatus.COMPLETED || newStatus == CompetitionStatus.CANCELLED;
            case COMPLETED -> false; // Un statut complet ne peut pas changer
            case CANCELLED -> false; // Un statut annulé ne peut pas changer
        };
        
        if (!validTransition) {
            throw new IllegalStateException("Transition de statut invalide: " + currentStatus + " -> " + newStatus);
        }
    }

    @Override
    @Transactional
    public void updateTeamCompetitionStatus(Long organizerId, TeamCompetitionStatusUpdateDTO statusUpdateDTO, String reason) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la compétition et vérifier qu'elle appartient à l'organisateur
        Competition competition = competitionRepository.findById(statusUpdateDTO.getCompetitionId())
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + statusUpdateDTO.getCompetitionId()));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette compétition n'appartient pas à cet organisateur");
        }
        
        // Récupérer l'équipe dans la compétition
        CompetitionTeam competitionTeam = competitionTeamRepository.findByCompetitionIdAndTeamId(
                statusUpdateDTO.getCompetitionId(), statusUpdateDTO.getTeamId());
        
        if (competitionTeam == null) {
            throw new ResourceNotFoundException("Équipe non trouvée dans cette compétition");
        }
        
        // Mettre à jour le statut de l'équipe
        competitionTeam.setStatus(statusUpdateDTO.getNewStatus());
        competitionTeamRepository.save(competitionTeam);
        
        // Notifier l'équipe (enregistrer un message ou une notification)
        // Cette partie pourrait être implémentée avec un service de notification
    }

    @Override
    @Transactional
    public void processCompetitionRequest(Long organizerId, Long requestId, boolean approved, String reason) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la demande de compétition
        CompetitionRequest request = competitionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée avec l'ID: " + requestId));
        
        // Vérifier que l'organisateur gère cette compétition
        if (!request.getCompetition().getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette demande concerne une compétition qui n'appartient pas à cet organisateur");
        }
        
        // Vérifier que la demande est en attente
        if (request.getRequestStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Cette demande a déjà été traitée");
        }
        
        // Mettre à jour le statut de la demande
        request.setRequestStatus(approved ? RequestStatus.APPROVED : RequestStatus.REJECTED);
        request.setResponseMessage(reason);
        request.setProcessedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        
        // Traiter l'action selon le type de demande
        if (approved) {
            if (request.getRequestType() == RequestType.REGISTRATION) {
                // Si c'est une demande d'inscription approuvée
                
                // Vérifier si la compétition a atteint le nombre maximum d'équipes
                Competition competition = request.getCompetition();
                int currentTeamsCount = competitionTeamRepository.countByCompetitionId(competition.getId());
                
                if (competition.getMaxTeams() != null && currentTeamsCount >= competition.getMaxTeams()) {
                    throw new IllegalStateException("La compétition a atteint son nombre maximum d'équipes");
                }
                
                // Ajouter l'équipe à la compétition
                CompetitionTeam competitionTeam = CompetitionTeam.builder()
                        .competition(competition)
                        .team(request.getTeam())
                        .status(CompetitionTeamStatus.ACTIVE)
                        .build();
                
                competitionTeamRepository.save(competitionTeam);
                
            } else if (request.getRequestType() == RequestType.WITHDRAWAL) {
                // Si c'est une demande de retrait approuvée
                
                // Supprimer l'équipe de la compétition
                competitionTeamRepository.deleteByCompetitionIdAndTeamId(
                        request.getCompetition().getId(), request.getTeam().getId());
            }
        }
        
        // Sauvegarder la demande mise à jour
        competitionRequestRepository.save(request);
    }

    @Override
    @Transactional
    public CoachCompetitionRequestDTO requestTeamRegistration(Long coachId, Long teamId, Long competitionId, String reason) {
        // Vérifier que le coach existe
        Coach coach = userRepository.findById(coachId)
                .filter(user -> user instanceof Coach)
                .map(user -> (Coach) user)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'ID: " + coachId));
        
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + teamId));
        
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Cette équipe n'appartient pas à ce coach");
        }
        
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        // Vérifier que la compétition accepte les inscriptions
        if (competition.getStatus() != CompetitionStatus.REGISTRATION && competition.getStatus() != CompetitionStatus.UPCOMING) {
            throw new IllegalStateException("Cette compétition n'accepte plus les inscriptions");
        }
        
        // Vérifier que l'équipe n'est pas déjà inscrite
        if (competitionTeamRepository.existsByCompetitionIdAndTeamId(competitionId, teamId)) {
            throw new IllegalStateException("Cette équipe est déjà inscrite à cette compétition");
        }
        
       // Vérifier qu'il n'y a pas déjà une demande en attente
        if (competitionRequestRepository.existsByTeamIdAndCompetitionIdAndRequestTypeAndRequestStatus(
                teamId, competitionId, RequestType.REGISTRATION, RequestStatus.PENDING)) {
            throw new IllegalStateException("Une demande d'inscription est déjà en attente pour cette équipe");
        }
        
        // Créer la demande d'inscription
        CompetitionRequest request = CompetitionRequest.builder()
                .team(team)
                .coach(coach)
                .competition(competition)
                .requestType(RequestType.REGISTRATION)
                .requestStatus(RequestStatus.PENDING)
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        CompetitionRequest savedRequest = competitionRequestRepository.save(request);
        
        // Construire et retourner le DTO
        return CoachCompetitionRequestDTO.builder()
                .id(savedRequest.getId())
                .teamId(team.getId())
                .teamName(team.getName())
                .competitionId(competition.getId())
                .competitionName(competition.getName())
                .reason(savedRequest.getReason())
                .requestType(savedRequest.getRequestType().name())
                .requestStatus(savedRequest.getRequestStatus().name())
                .createdAt(savedRequest.getCreatedAt().toString())
                .build();
    }

    @Override
    @Transactional
    public CoachCompetitionRequestDTO requestTeamWithdrawal(Long coachId, Long teamId, Long competitionId, String reason) {
        // Vérifier que le coach existe
        Coach coach = userRepository.findById(coachId)
                .filter(user -> user instanceof Coach)
                .map(user -> (Coach) user)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'ID: " + coachId));
        
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + teamId));
        
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Cette équipe n'appartient pas à ce coach");
        }
        
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        // Vérifier que l'équipe est inscrite à la compétition
        if (!competitionTeamRepository.existsByCompetitionIdAndTeamId(competitionId, teamId)) {
            throw new IllegalStateException("Cette équipe n'est pas inscrite à cette compétition");
        }
        
        // Vérifier qu'il n'y a pas déjà une demande de retrait en attente
        if (competitionRequestRepository.existsByTeamIdAndCompetitionIdAndRequestTypeAndRequestStatus(
                teamId, competitionId, RequestType.WITHDRAWAL, RequestStatus.PENDING)) {
            throw new IllegalStateException("Une demande de retrait est déjà en attente pour cette équipe");
        }
        
        // Créer la demande de retrait
        CompetitionRequest request = CompetitionRequest.builder()
                .team(team)
                .coach(coach)
                .competition(competition)
                .requestType(RequestType.WITHDRAWAL)
                .requestStatus(RequestStatus.PENDING)
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        CompetitionRequest savedRequest = competitionRequestRepository.save(request);
        
        // Construire et retourner le DTO
        return CoachCompetitionRequestDTO.builder()
                .id(savedRequest.getId())
                .teamId(team.getId())
                .teamName(team.getName())
                .competitionId(competition.getId())
                .competitionName(competition.getName())
                .reason(savedRequest.getReason())
                .requestType(savedRequest.getRequestType().name())
                .requestStatus(savedRequest.getRequestStatus().name())
                .createdAt(savedRequest.getCreatedAt().toString())
                .build();
    }

    @Override
    @Transactional
    public void requestTeamsWithdrawalIntoAllCompetition(Long coachId, Long teamId, String reason) {
        // Vérifier que le coach existe
        Coach coach = userRepository.findById(coachId)
                .filter(user -> user instanceof Coach)
                .map(user -> (Coach) user)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'ID: " + coachId));
        
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + teamId));
        
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Cette équipe n'appartient pas à ce coach");
        }
        
        // Récupérer toutes les compétitions auxquelles l'équipe est inscrite
        List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByTeamId(teamId);
        
        // Pour chaque compétition, créer une demande de retrait
        for (CompetitionTeam competitionTeam : competitionTeams) {
            Competition competition = competitionTeam.getCompetition();
            
            // Vérifier qu'il n'y a pas déjà une demande de retrait en attente
            if (competitionRequestRepository.existsByTeamIdAndCompetitionIdAndRequestTypeAndRequestStatus(
                    teamId, competition.getId(), RequestType.WITHDRAWAL, RequestStatus.PENDING)) {
                continue; // Passer à la compétition suivante
            }
            
            // Créer la demande de retrait
            CompetitionRequest request = CompetitionRequest.builder()
                    .team(team)
                    .coach(coach)
                    .competition(competition)
                    .requestType(RequestType.WITHDRAWAL)
                    .requestStatus(RequestStatus.PENDING)
                    .reason(reason)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            competitionRequestRepository.save(request);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoachCompetitionRequestDTO> getCompetitionRequestsByCoach(Long coachId) {
        // Vérifier que le coach existe
        Coach coach = userRepository.findById(coachId)
                .filter(user -> user instanceof Coach)
                .map(user -> (Coach) user)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'ID: " + coachId));
        
        // Récupérer toutes les demandes du coach
        List<CompetitionRequest> requests = competitionRequestRepository.findByCoachId(coachId);
        
        // Convertir les entités en DTOs
        return requests.stream()
                .map(this::mapToCoachCompetitionRequestDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompetitionDTO> getCompetitionsByTeamId(Long teamId, CompetitionFilter filter) {
        // Vérifier que l'équipe existe
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + teamId));
        
        // Récupérer toutes les compétitions auxquelles l'équipe participe
        List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByTeamId(teamId);
        List<Competition> competitions = competitionTeams.stream()
                .map(CompetitionTeam::getCompetition)
                .collect(Collectors.toList());
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                competitions = competitions.stream()
                        .filter(c -> c.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                try {
                    CompetitionStatus status = CompetitionStatus.valueOf(filter.getStatus());
                    competitions = competitions.stream()
                            .filter(c -> c.getStatus() == status)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException ignored) {
                    // Ignorer si le statut n'est pas valide
                }
            }
            // Autres filtres...
        }
        
        // Convertir les entités en DTOs
        return competitions.stream()
                .map(this::mapToCompetitionDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CompetitionDTO getCompetitionById(Long competitionId) {
        // Récupérer la compétition
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        // Convertir l'entité en DTO
        return mapToCompetitionDTO(competition);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompetitionDTO> getAllCompetitions(CompetitionFilter filter) {
        // Récupérer toutes les compétitions
        List<Competition> competitions = competitionRepository.findAll();
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                competitions = competitions.stream()
                        .filter(c -> c.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                try {
                    CompetitionStatus status = CompetitionStatus.valueOf(filter.getStatus());
                    competitions = competitions.stream()
                            .filter(c -> c.getStatus() == status)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException ignored) {
                    // Ignorer si le statut n'est pas valide
                }
            }
            if (filter.getOrganizerName() != null && !filter.getOrganizerName().isEmpty()) {
                competitions = competitions.stream()
                        .filter(c -> {
                            String organizerFullName = c.getOrganizer().getFirstName() + " " + c.getOrganizer().getLastName();
                            return organizerFullName.toLowerCase().contains(filter.getOrganizerName().toLowerCase());
                        })
                        .collect(Collectors.toList());
            }
            // Autres filtres...
        }
        
        // Convertir les entités en DTOs
        return competitions.stream()
                .map(this::mapToCompetitionDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompetitionDTO> getCompetitionsByUserId(Long userId) {
        // Vérifier que l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));
        
        List<Competition> competitions;
        
        if (user instanceof Organizer) {
            // Si c'est un organisateur, récupérer ses compétitions
            competitions = competitionRepository.findByOrganizerId(userId);
        } else if (user instanceof Coach) {
            // Si c'est un coach, récupérer les compétitions de ses équipes
            List<Team> teams = teamRepository.findByCoachId(userId);
            List<Long> teamIds = teams.stream().map(Team::getId).collect(Collectors.toList());
            
            List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByTeamIdIn(teamIds);
            competitions = competitionTeams.stream()
                    .map(CompetitionTeam::getCompetition)
                    .distinct()
                    .collect(Collectors.toList());
        } else {
            // Si c'est un autre type d'utilisateur, retourner une liste vide
            // competitions = new ArrayList<>();
            competitions = competitionRepository.findByOrganizerId(userId);
        }
        
        // Convertir les entités en DTOs
        return competitions.stream()
                .map(this::mapToCompetitionDTO)
                .collect(Collectors.toList());
    }

    // Méthode utilitaire pour convertir une entité Competition en CompetitionDTO
    private CompetitionDTO mapToCompetitionDTO(Competition competition) {
        return CompetitionDTO.builder()
                .id(competition.getId())
                .name(competition.getName())
                .description(competition.getDescription())
                .category(competition.getCategory())
                .type(competition.getType())
                .status(competition.getStatus())
                .startDate(competition.getStartDate())
                .endDate(competition.getEndDate())
                .location(competition.getLocation())
                .maxTeams(competition.getMaxTeams())
                .registeredTeams(competition.getCompetitionTeams().size())
                .organizerId(competition.getOrganizer().getId())
                .organizerName(competition.getOrganizer().getFirstName() + " " + competition.getOrganizer().getLastName())
                .createdAt(competition.getCreatedAt())
                .updatedAt(competition.getUpdatedAt())
                .build();
    }
    
    // Méthode utilitaire pour convertir une entité CompetitionRequest en CoachCompetitionRequestDTO
    private CoachCompetitionRequestDTO mapToCoachCompetitionRequestDTO(CompetitionRequest request) {
        return CoachCompetitionRequestDTO.builder()
                .id(request.getId())
                .teamId(request.getTeam().getId())
                .teamName(request.getTeam().getName())
                .competitionId(request.getCompetition().getId())
                .competitionName(request.getCompetition().getName())
                .reason(request.getReason())
                .requestType(request.getRequestType().name())
                .requestStatus(request.getRequestStatus().name())
                .responseMessage(request.getResponseMessage())
                .createdAt(request.getCreatedAt().toString())
                .processedAt(request.getProcessedAt() != null ? request.getProcessedAt().toString() : null)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CoachCompetitionRequestDTO> getRequestsByCompetitionId(Long organizerId, Long competitionId) {
        // Vérifier que l'organisateur existe
        Organizer organizer = userRepository.findById(organizerId)
                .filter(user -> user instanceof Organizer)
                .map(user -> (Organizer) user)
                .orElseThrow(() -> new ResourceNotFoundException("Organisateur non trouvé avec l'ID: " + organizerId));
        
        // Récupérer la compétition et vérifier qu'elle appartient à l'organisateur
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Compétition non trouvée avec l'ID: " + competitionId));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("Cette compétition n'appartient pas à cet organisateur");
        }
        
        // Récupérer toutes les demandes pour cette compétition
        List<CompetitionRequest> requests = competitionRequestRepository.findByCompetitionId(competitionId);
        
        // Convertir les entités en DTOs et retourner
        return requests.stream()
                .map(this::mapToCoachCompetitionRequestDTO)
                .collect(Collectors.toList());
    }
}