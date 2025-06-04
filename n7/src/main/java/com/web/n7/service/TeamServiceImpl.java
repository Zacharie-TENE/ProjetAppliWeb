package com.web.n7.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.n7.dto.coach.CreateTeamDTO;
import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdateTeamDTO;
import com.web.n7.dto.teams.StandingDTO;
import com.web.n7.dto.teams.TeamDTO;
import com.web.n7.dto.organizer.OrganizerTeamSummaryDTO;
import com.web.n7.dto.users.CoachDTO;
import com.web.n7.filter.TeamFilter;
import com.web.n7.model.Competition;
import com.web.n7.model.CompetitionTeam;
import com.web.n7.model.Team;
import com.web.n7.model.TeamStanding;
import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;
import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Player;
import com.web.n7.model.users.User;
import com.web.n7.repository.CompetitionRepository;
import com.web.n7.repository.CompetitionTeamRepository;
import com.web.n7.repository.PlayerRepository;
import com.web.n7.repository.TeamRepository;
import com.web.n7.repository.TeamStandingRepository;
import com.web.n7.repository.UserRepository;
import com.web.n7.serviceInterface.TeamService;
import com.web.n7.exception.ResourceNotFoundException;
import com.web.n7.exception.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    // Injection des repositories nécessaires
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final CompetitionRepository competitionRepository;
    private final CompetitionTeamRepository competitionTeamRepository;
    private final TeamStandingRepository teamStandingRepository;
    
    @Override
    @Transactional
    public TeamDTO createTeam(Long coachId, CreateTeamDTO createTeamDTO) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Créer la nouvelle équipe
        Team team = Team.builder()
                .name(createTeamDTO.getName())
                .description(createTeamDTO.getDescription())
                .logo(createTeamDTO.getLogo())
                .category(createTeamDTO.getCategory())
                .coach(coach)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .players(new ArrayList<>())
                .build();
        
        // Sauvegarder l'équipe
        Team savedTeam = teamRepository.save(team);
        
        // Ajouter les joueurs à l'équipe si présents dans le DTO
        if (createTeamDTO.getPlayers() != null && !createTeamDTO.getPlayers().isEmpty()) {
            for (RegisterPlayerDTO playerDTO : createTeamDTO.getPlayers()) {
                addPlayerToTeam(coachId, savedTeam.getId(), playerDTO);
            }
        }
        
        // Récupérer l'équipe mise à jour avec les joueurs
        Team updatedTeam = teamRepository.findById(savedTeam.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found after creation"));
        
        return mapTeamToTeamDTO(updatedTeam);
    }

    @Override
    @Transactional
    public TeamDTO updateTeam(Long coachId, UpdateTeamDTO updateTeamDTO) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer l'équipe à mettre à jour
        Long teamId = updateTeamDTO.getTeamId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Vérifier que le coach est bien le propriétaire de l'équipe
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Coach is not authorized to update this team");
        }
        
        // Mettre à jour les champs de l'équipe
        if (updateTeamDTO.getName() != null) {
            team.setName(updateTeamDTO.getName());
        }
        if (updateTeamDTO.getDescription() != null) {
            team.setDescription(updateTeamDTO.getDescription());
        }
        if (updateTeamDTO.getLogo() != null) {
            team.setLogo(updateTeamDTO.getLogo());
        }
        if (updateTeamDTO.getCategory() != null) {
            team.setCategory(updateTeamDTO.getCategory());
        }
        
        team.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder les modifications
        Team updatedTeam = teamRepository.save(team);
        
        return mapTeamToTeamDTO(updatedTeam);
    }

    @Override
    @Transactional
    public void deleteTeam(Long coachId, Long teamId) {
        // Vérifier que le coach existe
        userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer l'équipe à supprimer
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Vérifier que le coach est bien le propriétaire de l'équipe
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Coach is not authorized to delete this team");
        }
        
        // Supprimer l'équipe
        teamRepository.delete(team);
    }

    @Override
    public List<TeamDTO> getAllTeamsByCoach(Long coachId) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer toutes les équipes du coach
        List<Team> teams = coach.getTeams();
        
        // Mapper les équipes en DTOs
        return teams.stream()
                .map(this::mapTeamToTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeamDTO addPlayerToTeam(Long coachId, Long teamId, RegisterPlayerDTO playerDTO) {
        // Vérifier que le coach existe
        userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer l'équipe
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Vérifier que le coach est bien le propriétaire de l'équipe
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Coach is not authorized to add players to this team");
        }
        
        // Créer le joueur ou le récupérer s'il existe déjà
        Player player;
        if (playerDTO.getUserId() != null) {
            // Mettre à jour un utilisateur existant
            User existingUser = userRepository.findById(playerDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + playerDTO.getUserId()));
            
            if (existingUser instanceof Player) {
                player = (Player) existingUser;
            } else {
                throw new IllegalArgumentException("The user is not a player");
            }
        } else {
            // Créer un nouveau joueur
            player = new Player();
            // Définir les propriétés de l'utilisateur
            player.setEmail(playerDTO.getEmail());
            player.setFirstName(playerDTO.getFirstName());
            player.setLastName(playerDTO.getLastName());
            player.setAddress(playerDTO.getAddress());
            player.setPhone(playerDTO.getPhone());
            player.setProfilePicture(playerDTO.getProfilePicture());
            player.setUserName(playerDTO.getUserName());
            // Ajouter un mot de passe généré ou celui fourni
            player.setPassword(playerDTO.getPassword()); // En pratique, il faudrait encoder ce mot de passe
        }
        
        // Mettre à jour les propriétés spécifiques au joueur
        player.setLicenseNumber(playerDTO.getLicenseNumber());
        player.setDateOfBirth(playerDTO.getDateOfBirth());
        player.setPosition(playerDTO.getPosition().name());
        player.setStatus(playerDTO.getStatus());
        player.setTeam(team);
        
        // Sauvegarder le joueur
        Player savedPlayer = playerRepository.save(player);
        
        // Mettre à jour l'équipe si le joueur n'en faisait pas déjà partie
        if (!team.getPlayers().contains(savedPlayer)) {
            team.getPlayers().add(savedPlayer);
            teamRepository.save(team);
        }
        
        return mapTeamToTeamDTO(team);
    }

    @Override
    @Transactional
    public TeamDTO removePlayerFromTeam(Long coachId, Long teamId, Long playerId) {
        // Vérifier que le coach existe
        userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer l'équipe
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Vérifier que le coach est bien le propriétaire de l'équipe
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Coach is not authorized to remove players from this team");
        }
        
        // Récupérer le joueur
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Vérifier que le joueur appartient bien à l'équipe
        if (!player.getTeam().getId().equals(teamId)) {
            throw new IllegalArgumentException("Player does not belong to this team");
        }
        
        // Retirer le joueur de l'équipe
        team.getPlayers().remove(player);
        player.setTeam(null);
        
        // Sauvegarder les modifications
        playerRepository.save(player);
        Team updatedTeam = teamRepository.save(team);
        
        return mapTeamToTeamDTO(updatedTeam);
    }

    @Override
    @Transactional
    public void transferPlayer(Long coachId, Long sourceTeamId, Long targetTeamId, Long playerId) {
        // Vérifier que le coach existe
        userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer l'équipe source
        Team sourceTeam = teamRepository.findById(sourceTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("Source team not found with id: " + sourceTeamId));
        
        // Récupérer l'équipe cible
        Team targetTeam = teamRepository.findById(targetTeamId)
                .orElseThrow(() -> new ResourceNotFoundException("Target team not found with id: " + targetTeamId));
        
        // Vérifier que le coach est bien le propriétaire des deux équipes
        if (!sourceTeam.getCoach().getId().equals(coachId) || !targetTeam.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("Coach is not authorized to transfer players between these teams");
        }
        
        // Récupérer le joueur
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Vérifier que le joueur appartient bien à l'équipe source
        if (!player.getTeam().getId().equals(sourceTeamId)) {
            throw new IllegalArgumentException("Player does not belong to the source team");
        }
        
        // Transférer le joueur
        sourceTeam.getPlayers().remove(player);
        targetTeam.getPlayers().add(player);
        player.setTeam(targetTeam);
        
        // Sauvegarder les modifications
        playerRepository.save(player);
        teamRepository.save(sourceTeam);
        teamRepository.save(targetTeam);
    }

    @Override
    public List<OrganizerTeamSummaryDTO> getTeamsByCompetition(Long organizerId, Long competitionId) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        // Récupérer toutes les équipes participant à la compétition
        List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByCompetitionId(competitionId);
        
        // Mapper les équipes en DTOs
        return competitionTeams.stream()
                .map(ct -> {
                    Team team = ct.getTeam();
                    return OrganizerTeamSummaryDTO.builder()
                            .id(team.getId())
                            .name(team.getName())
                            .category(team.getCategory())
                            .playerCount(team.getPlayers().size())
                            .coachName(team.getCoach().getFirstName() + " " + team.getCoach().getLastName())
                            .coachId(team.getCoach().getId())
                            .status(ct.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CoachDTO> getCoachesByCompetition(Long organizerId, Long competitionId) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        // Récupérer toutes les équipes participant à la compétition
        List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByCompetitionId(competitionId);
        
        // Extraire les coachs uniques
        return competitionTeams.stream()
                .map(ct -> ct.getTeam().getCoach())
                .distinct()
                .map(this::mapCoachToCoachDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getAllTeams(TeamFilter filter) {
        // Récupérer toutes les équipes
        List<Team> teams = teamRepository.findAll();
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null) {
                teams = teams.stream()
                        .filter(team -> team.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getCategory() != null) {
                teams = teams.stream()
                        .filter(team -> team.getCategory().equals(filter.getCategory()))
                        .collect(Collectors.toList());
            }
        }
        
        // Mapper les équipes en DTOs
        return teams.stream()
                .map(this::mapTeamToTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TeamDTO getTeamById(Long teamId) {
        // Récupérer l'équipe par son ID
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        return mapTeamToTeamDTO(team);
    }

    @Override
    public List<TeamDTO> getTeamsByCoachId(Long coachId, TeamFilter filter) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer toutes les équipes du coach
        List<Team> teams = coach.getTeams();
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null) {
                teams = teams.stream()
                        .filter(team -> team.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getCategory() != null) {
                teams = teams.stream()
                        .filter(team -> team.getCategory().equals(filter.getCategory()))
                        .collect(Collectors.toList());
            }
        }
        
        // Mapper les équipes en DTOs
        return teams.stream()
                .map(this::mapTeamToTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getTeamsByCompetitionId(Long competitionId, TeamFilter filter) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        // Récupérer toutes les équipes participant à la compétition
        List<CompetitionTeam> competitionTeams = competitionTeamRepository.findByCompetitionId(competitionId);
        List<Team> teams = competitionTeams.stream()
                .map(CompetitionTeam::getTeam)
                .collect(Collectors.toList());
        
        // Appliquer les filtres si nécessaire
        if (filter != null) {
            if (filter.getName() != null) {
                teams = teams.stream()
                        .filter(team -> team.getName().toLowerCase().contains(filter.getName().toLowerCase()))
                        .collect(Collectors.toList());
            }
            if (filter.getCategory() != null) {
                teams = teams.stream()
                        .filter(team -> team.getCategory().equals(filter.getCategory()))
                        .collect(Collectors.toList());
            }
        }
        
        // Mapper les équipes en DTOs
        return teams.stream()
                .map(this::mapTeamToTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getTeamsByPlayerId(Long playerId, TeamFilter filter) {
        // Récupérer le joueur
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Récupérer l'équipe du joueur
        Team team = player.getTeam();
        
        // Vérifier si l'équipe respecte les critères de filtre
        if (filter != null) {
            boolean respectFilter = true;
            if (filter.getName() != null && !team.getName().toLowerCase().contains(filter.getName().toLowerCase())) {
                respectFilter = false;
            }
            if (filter.getCategory() != null && !team.getCategory().equals(filter.getCategory())) {
                respectFilter = false;
            }
            
            if (!respectFilter) {
                return new ArrayList<>();
            }
        }
        
        // Retourner l'équipe sous forme de DTO
        return List.of(mapTeamToTeamDTO(team));
    }

    @Override
    public List<StandingDTO> getTeamStandingsByTeamId(Long teamId) {
        // Récupérer l'équipe
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Récupérer tous les classements de l'équipe
        List<TeamStanding> standings = teamStandingRepository.findByTeamId(teamId);
        
        // Mapper les classements en DTOs
        return standings.stream()
                .map(this::mapTeamStandingToStandingDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StandingDTO> getTeamStandingsByCompetitionId(Long competitionId) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        // Récupérer tous les classements de la compétition, triés par rang
        List<TeamStanding> standings = teamStandingRepository.findByCompetitionIdOrderByRank(competitionId);
        
        // Mapper les classements en DTOs
        return standings.stream()
                .map(this::mapTeamStandingToStandingDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StandingDTO getTeamStandingByCompetitionIdAndTeamId(Long competitionId, Long teamId) {
        // Récupérer la compétition et l'équipe pour vérifier qu'elles existent
        competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // Récupérer le classement de l'équipe dans la compétition
        Optional<TeamStanding> standingOpt = teamStandingRepository.findByCompetitionIdAndTeamId(competitionId, teamId);
        
        // Retourner le classement sous forme de DTO
        return standingOpt.map(this::mapTeamStandingToStandingDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Team standing not found for team with id: " + teamId + " in competition with id: " + competitionId));
    }
    
    // Méthodes utilitaires pour la conversion de modèles en DTOs
    
    private TeamDTO mapTeamToTeamDTO(Team team) {
        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .logo(team.getLogo())
                .category(team.getCategory())
                .coachId(team.getCoach().getId())
                .coachName(team.getCoach().getFirstName() + " " + team.getCoach().getLastName())
                .playerCount(team.getPlayers().size())
                .competitionCount(team.getCompetitionTeams().size())
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }
    
    private CoachDTO mapCoachToCoachDTO(Coach coach) {
        return CoachDTO.builder()
                .id(coach.getId())
                .firstName(coach.getFirstName())
                .lastName(coach.getLastName())
                .email(coach.getEmail())
                .userName(coach.getUserName())
                .licenseNumber(coach.getLicenseNumber())
                .yearsOfExperience(coach.getYearsOfExperience())
                .numberOfTeams(coach.getTeams().size())
                .contactDetails(coach.getContactDetails())
                .specialization(coach.getSpecialization())
                .organization(coach.getOrganization())
                .biography(coach.getBiography())
                .build();
    }
    
    private StandingDTO mapTeamStandingToStandingDTO(TeamStanding standing) {
        // Calculer la forme récente (derniers 5 matchs)
        // Cela pourrait être implémenté en utilisant un service dédié aux matchs
        String form = calculateTeamForm(standing.getTeam().getId(), 5);
        
        return StandingDTO.builder()
                .id(standing.getId())
                .competitionId(standing.getCompetition().getId())
                .competitionName(standing.getCompetition().getName())
                .teamId(standing.getTeam().getId())
                .teamName(standing.getTeam().getName())
                .position(standing.getRank())
                .matchesPlayed(standing.getPlayedMatches())
                .wins(standing.getWins())
                .draws(standing.getDraws())
                .losses(standing.getLosses())
                .goalsFor(standing.getGoalsFor())
                .goalsAgainst(standing.getGoalsAgainst())
                .goalDifference(standing.getGoalDifference())
                .points(standing.getPoints())
                .form(form)
                .build();
    }
    
    /**
     * Méthode utilitaire pour calculer la forme récente d'une équipe
     * Retourne une chaîne contenant les résultats des derniers matchs sous la forme "W-L-D-W-W"
     * W = Victoire, L = Défaite, D = Match nul
     * 
     * @param teamId ID de l'équipe
     * @param count Nombre de matchs à considérer
     * @return Chaîne de forme
     */
    private String calculateTeamForm(Long teamId, int count) {
        // Dans une implémentation réelle, cette méthode devrait récupérer les derniers matchs 
        // et déterminer leur résultat pour l'équipe spécifiée
        
        // Pour l'instant, on retourne une forme basique simulée
        return "W-D-W-L-W";
    }
}