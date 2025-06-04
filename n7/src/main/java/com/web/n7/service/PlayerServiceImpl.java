package com.web.n7.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdatePlayerDTO;
import com.web.n7.dto.organizer.OrganizerPlayerPerformanceDTO;
import com.web.n7.dto.player.PlayerPerformanceDTO;
import com.web.n7.dto.users.PlayerDTO;
import com.web.n7.exception.ResourceNotFoundException;
import com.web.n7.exception.UnauthorizedException;
import com.web.n7.filter.PlayerFilters;
import com.web.n7.model.Competition;
import com.web.n7.model.PlayerPerformance;
import com.web.n7.model.Team;
import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Organizer;
import com.web.n7.model.users.Player;
import com.web.n7.model.users.User;
import com.web.n7.repository.CompetitionRepository;
import com.web.n7.repository.MatchSheetRepository;
import com.web.n7.repository.PlayerParticipationRepository;
import com.web.n7.repository.PlayerPerformanceRepository;
import com.web.n7.repository.PlayerRepository;
import com.web.n7.repository.TeamRepository;
import com.web.n7.repository.UserRepository;
import com.web.n7.serviceInterface.PlayerService;
import com.web.n7.util.RoleMapDTO;

import com.web.n7.model.enumeration.Role;
import com.web.n7.model.enumeration.player.PlayerStatus;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    // Injection des repositories nécessaires
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final CompetitionRepository competitionRepository;
    private final PlayerPerformanceRepository playerPerformanceRepository;
    private final MatchSheetRepository matchSheetRepository;
    private final PlayerParticipationRepository playerParticipationRepository;
    private final RoleMapDTO roleMapDTO;
    
    @Override
    @Transactional
    public PlayerDTO registerPlayer(Long coachId, Long teamId, RegisterPlayerDTO playerDTO) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        if (!team.getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("This coach is not authorized to add players to this team");
        }
        
        Player player;
        
        // Si l'userId est spécifié, on met à jour un utilisateur existant
        if (playerDTO.getUserId() != null) {
            User existingUser = userRepository.findById(playerDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + playerDTO.getUserId()));
            
            // Créer un nouveau joueur à partir de l'utilisateur existant
            player = new Player();
            player.setId(existingUser.getId());
            player.setEmail(existingUser.getEmail());
            player.setPassword(existingUser.getPassword());
            player.setRole(existingUser.getRole());
            player.setCreatedAt(existingUser.getCreatedAt());
            player.setUpdatedAt(LocalDateTime.now());
            
            // Mettre à jour les informations utilisateur
            player.setUserName(playerDTO.getUserName() != null ? playerDTO.getUserName() : existingUser.getUserName());
            player.setFirstName(playerDTO.getFirstName());
            player.setLastName(playerDTO.getLastName());
            player.setPhone(playerDTO.getPhone() != null ? playerDTO.getPhone() : existingUser.getPhone());
            player.setAddress(playerDTO.getAddress());
            player.setProfilePicture(playerDTO.getProfilePicture() != null ? playerDTO.getProfilePicture() : existingUser.getProfilePicture());
        } else {
            // Créer un nouveau joueur
            player = new Player();
            player.setEmail(playerDTO.getEmail());
            player.setPassword(playerDTO.getPassword());
            player.setPhone(playerDTO.getPhone());
            player.setUserName(playerDTO.getUserName());
            player.setFirstName(playerDTO.getFirstName());
            player.setLastName(playerDTO.getLastName());
            player.setAddress(playerDTO.getAddress());
            player.setProfilePicture(playerDTO.getProfilePicture());
            player.setRole(Role.PLAYER); // Définir le rôle PLAYER
            player.setCreatedAt(LocalDateTime.now());
            player.setUpdatedAt(LocalDateTime.now());
        }
        
        // Définir les propriétés spécifiques au joueur
        player.setLicenseNumber(playerDTO.getLicenseNumber());
        player.setDateOfBirth(playerDTO.getDateOfBirth());
        player.setPosition(playerDTO.getPosition().toString());
        
        // S'assurer que le statut n'est jamais null
        if (playerDTO.getStatus() != null) {
            player.setStatus(playerDTO.getStatus());
        } else {
            // Définir une valeur par défaut pour le statut
            player.setStatus(PlayerStatus.SUBSTITUTE);  // ou toute autre valeur par défaut appropriée
        }
        
        player.setTeam(team);
        player.setPerformances(new ArrayList<>());
        
        // Sauvegarder le joueur
        Player savedPlayer = playerRepository.save(player);
        
        // Convertir en DTO et retourner
        return (PlayerDTO) roleMapDTO.ToDTO(savedPlayer);
    }

    @Override
    @Transactional
    public PlayerDTO updatePlayer(Long coachId, UpdatePlayerDTO playerDTO) {
        // Vérifier que le joueur existe
        Player player = playerRepository.findById(playerDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerDTO.getId()));
        
        // Vérifier que le coach est autorisé à modifier ce joueur
        if (!player.getTeam().getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("This coach is not authorized to update this player");
        }
        
        // Mettre à jour les informations du joueur
        if (playerDTO.getUserName() != null) player.setUserName(playerDTO.getUserName());
        if (playerDTO.getFirstName() != null) player.setFirstName(playerDTO.getFirstName());
        if (playerDTO.getLastName() != null) player.setLastName(playerDTO.getLastName());
        if (playerDTO.getEmail() != null) player.setEmail(playerDTO.getEmail());
        if (playerDTO.getPhone() != null) player.setPhone(playerDTO.getPhone());
        if (playerDTO.getAddress() != null) player.setAddress(playerDTO.getAddress());
        if (playerDTO.getProfilePicture() != null) player.setProfilePicture(playerDTO.getProfilePicture());
        if (playerDTO.getLicenseNumber() != null) player.setLicenseNumber(playerDTO.getLicenseNumber());
        if (playerDTO.getDateOfBirth() != null) player.setDateOfBirth(playerDTO.getDateOfBirth());
        if (playerDTO.getPosition() != null) player.setPosition(playerDTO.getPosition());
        if (playerDTO.getStatus() != null) player.setStatus(playerDTO.getStatus());
        
        player.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder les modifications
        Player updatedPlayer = playerRepository.save(player);
        
        // Convertir en DTO et retourner
        return (PlayerDTO) roleMapDTO.ToDTO(updatedPlayer);
    }

    @Override
    @Transactional
    public void removePlayer(Long coachId, Long playerId) {
        // Vérifier que le joueur existe
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Vérifier que le coach est autorisé à supprimer ce joueur
        if (!player.getTeam().getCoach().getId().equals(coachId)) {
            throw new UnauthorizedException("This coach is not authorized to remove this player");
        }
        
        // Supprimer le joueur
        playerRepository.delete(player);
    }

    @Override
    public List<PlayerDTO> getPlayersByCoach(Long coachId) {
        // Vérifier que le coach existe
        Coach coach = (Coach) userRepository.findById(coachId)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found with id: " + coachId));
        
        // Récupérer tous les joueurs des équipes du coach
        List<Player> players = new ArrayList<>();
        coach.getTeams().forEach(team -> players.addAll(team.getPlayers()));
        
        // Convertir en DTOs et retourner
        return players.stream()
                .map(player -> (PlayerDTO) roleMapDTO.ToDTO(player))
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> getPlayersByTeam(Long coachId, Long teamId) {
        // Vérifier que l'équipe existe et appartient au coach
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        
        // if (!team.getCoach().getId().equals(coachId)) {
        //     throw new UnauthorizedException("This coach is not authorized to view players of this team");
        // }
        
        // Récupérer tous les joueurs de l'équipe
        List<Player> players = team.getPlayers();
        
        // Convertir en DTOs et retourner
        return players.stream()
                .map(player -> (PlayerDTO) roleMapDTO.ToDTO(player))
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> getPlayersByCompetition(Long organizerId, Long competitionId) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Competition not found with id: " + competitionId));
        
        // Vérifier que l'organisateur est autorisé à voir les joueurs de cette compétition
        Organizer organizer = (Organizer) userRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + organizerId));
        
        if (!competition.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedException("This organizer is not authorized to view players of this competition");
        }
        
        // Récupérer tous les joueurs des équipes participant à la compétition
        List<Player> players = new ArrayList<>();
        competition.getCompetitionTeams().forEach(competitionTeam -> {
            players.addAll(competitionTeam.getTeam().getPlayers());
        });
        
        // Convertir en DTOs et retourner
        return players.stream()
                .distinct()
                .map(player -> (PlayerDTO) roleMapDTO.ToDTO(player))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrganizerPlayerPerformanceDTO updatePlayerMatchPerformance(Long organizerId, OrganizerPlayerPerformanceDTO performanceDTO) {
        // Vérifier que le joueur existe
        Player player = playerRepository.findById(performanceDTO.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + performanceDTO.getPlayerId()));
        
        // Chercher la performance existante ou en créer une nouvelle
        PlayerPerformance performance = playerPerformanceRepository.findById(performanceDTO.getId())
                .orElse(new PlayerPerformance());
        
        // Mettre à jour les statistiques du joueur
        if (performanceDTO.getGoalsScored() != null) performance.setTotalGoals(performanceDTO.getGoalsScored());
        if (performanceDTO.getAssists() != null) performance.setTotalAssists(performanceDTO.getAssists());
        if (performanceDTO.getYellowCards() != null) performance.setTotalYellowCards(performanceDTO.getYellowCards());
        if (performanceDTO.getRedCards() != null) performance.setTotalRedCards(performanceDTO.getRedCards());
        if (performanceDTO.getMinutesPlayed() != null) performance.setTotalMinutesPlayed(performanceDTO.getMinutesPlayed());
        if (performanceDTO.getShotsOnTarget() != null) performance.setShotsOnTarget(performanceDTO.getShotsOnTarget());
        if (performanceDTO.getPenaltiesScored() != null) performance.setPenaltiesScored(performanceDTO.getPenaltiesScored());
        if (performanceDTO.getPenaltiesTaken() != null) performance.setPenaltiesTaken(performanceDTO.getPenaltiesTaken());
        if (performanceDTO.getSuccessfulDribbles() != null) performance.setSuccessfulDribbles(performanceDTO.getSuccessfulDribbles());
        if (performanceDTO.getPassAccuracy() != null) performance.setPassAccuracy(performanceDTO.getPassAccuracy());
        if (performanceDTO.getSuccessfulPasses() != null) performance.setSuccessfulPasses(performanceDTO.getSuccessfulPasses());
        if (performanceDTO.getBallsRecovered() != null) performance.setBallsRecovered(performanceDTO.getBallsRecovered());
        if (performanceDTO.getSuccessfulCrosses() != null) performance.setSuccessfulCrosses(performanceDTO.getSuccessfulCrosses());
        if (performanceDTO.getInterceptions() != null) performance.setInterceptions(performanceDTO.getInterceptions());
        if (performanceDTO.getBallsLost() != null) performance.setBallsLost(performanceDTO.getBallsLost());
        if (performanceDTO.getSavesMade() != null) performance.setSavesMade(performanceDTO.getSavesMade());
        if (performanceDTO.getCleanSheets() != null) performance.setCleanSheets(performanceDTO.getCleanSheets());
        if (performanceDTO.getPenaltiesSaved() != null) performance.setPenaltiesSaved(performanceDTO.getPenaltiesSaved());
        if (performanceDTO.getGoalsConceded() != null) performance.setGoalsConceded(performanceDTO.getGoalsConceded());
        if (performanceDTO.getSavePercentage() != null) performance.setSavePercentage(performanceDTO.getSavePercentage());
        if (performanceDTO.getRating() != null) performance.setRating(performanceDTO.getRating());
        if (performanceDTO.getNotes() != null) performance.setNotes(performanceDTO.getNotes());
        
        // Mettre à jour les timestamps
        if (performance.getCreatedAt() == null) {
            performance.setCreatedAt(LocalDateTime.now());
        }
        performance.setUpdatedAt(LocalDateTime.now());
        
        // Sauvegarder la performance
        PlayerPerformance savedPerformance = playerPerformanceRepository.save(performance);
        
        // Construire et retourner le DTO
        return OrganizerPlayerPerformanceDTO.builder()
                .id(savedPerformance.getId())
                .playerId(player.getId())
                .playerName(player.getFirstName() + " " + player.getLastName())
                .matchId(performanceDTO.getMatchId())
                .goalsScored(savedPerformance.getTotalGoals())
                .assists(savedPerformance.getTotalAssists())
                .yellowCards(savedPerformance.getTotalYellowCards())
                .redCards(savedPerformance.getTotalRedCards())
                .minutesPlayed(savedPerformance.getTotalMinutesPlayed())
                .shotsOnTarget(savedPerformance.getShotsOnTarget())
                .penaltiesScored(savedPerformance.getPenaltiesScored())
                .penaltiesTaken(savedPerformance.getPenaltiesTaken())
                .successfulDribbles(savedPerformance.getSuccessfulDribbles())
                .passAccuracy(savedPerformance.getPassAccuracy())
                .successfulPasses(savedPerformance.getSuccessfulPasses())
                .ballsRecovered(savedPerformance.getBallsRecovered())
                .successfulCrosses(savedPerformance.getSuccessfulCrosses())
                .interceptions(savedPerformance.getInterceptions())
                .ballsLost(savedPerformance.getBallsLost())
                .savesMade(savedPerformance.getSavesMade())
                .cleanSheets(savedPerformance.getCleanSheets())
                .penaltiesSaved(savedPerformance.getPenaltiesSaved())
                .goalsConceded(savedPerformance.getGoalsConceded())
                .savePercentage(savedPerformance.getSavePercentage())
                .rating(savedPerformance.getRating())
                .notes(savedPerformance.getNotes())
                .build();
    }

    @Override
    public List<PlayerDTO> getAllPlayers(PlayerFilters filter) {
        // Récupérer tous les joueurs
        List<Player> allPlayers = playerRepository.findAll();
        
        // Appliquer les filtres
        List<Player> filteredPlayers = allPlayers.stream()
                .filter(player -> filter.getUserName() == null || 
                        player.getUserName().toLowerCase().contains(filter.getUserName().toLowerCase()))
                .filter(player -> filter.getFirstName() == null || 
                        player.getFirstName().toLowerCase().contains(filter.getFirstName().toLowerCase()))
                .filter(player -> filter.getLastName() == null || 
                        player.getLastName().toLowerCase().contains(filter.getLastName().toLowerCase()))
                .filter(player -> filter.getPosition() == null || 
                        player.getPosition().equalsIgnoreCase(filter.getPosition()))
                .filter(player -> filter.getStatus() == null || 
                        player.getStatus().toString().equalsIgnoreCase(filter.getStatus()))
                .filter(player -> filter.getTeamName() == null || 
                        player.getTeam().getName().toLowerCase().contains(filter.getTeamName().toLowerCase()))
                .collect(Collectors.toList());
        
        // Convertir en DTOs et retourner
        return filteredPlayers.stream()
                .map(player -> (PlayerDTO) roleMapDTO.ToDTO(player))
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDTO getPlayerById(Long playerId) {
        // Récupérer le joueur par ID
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Convertir en DTO et retourner
        return (PlayerDTO) roleMapDTO.ToDTO(player);
    }

    @Override
    public List<PlayerPerformanceDTO> getPlayerPerformance(Long playerId, PlayerFilters filter) {
        // Vérifier que le joueur existe
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
        
        // Récupérer toutes les performances du joueur
        List<PlayerPerformance> performances = player.getPerformances();
        
        // Appliquer les filtres si nécessaire pour les compétitions
        if (filter != null && filter.getCompetitionName() != null) {
            performances = performances.stream()
                    .filter(perf -> perf.getCompetition().getName().toLowerCase()
                            .contains(filter.getCompetitionName().toLowerCase()))
                    .collect(Collectors.toList());
        }
        
        // Convertir en DTOs et retourner
        return performances.stream()
                .map(this::mapToPlayerPerformanceDTO)
                .collect(Collectors.toList());
    }
    
    // Méthode utilitaire pour mapper PlayerPerformance en PlayerPerformanceDTO
    private PlayerPerformanceDTO mapToPlayerPerformanceDTO(PlayerPerformance performance) {
        return PlayerPerformanceDTO.builder()
                .id(performance.getId())
                .playerId(performance.getPlayer().getId())
                .playerName(performance.getPlayer().getFirstName() + " " + performance.getPlayer().getLastName())
                .competitionId(performance.getCompetition().getId())
                .competitionName(performance.getCompetition().getName())
                .totalMatches(performance.getTotalMatches())
                .totalMinutesPlayed(performance.getTotalMinutesPlayed())
                .totalFouls(performance.getTotalFouls())
                .totalYellowCards(performance.getTotalYellowCards())
                .totalRedCards(performance.getTotalRedCards())
                .totalGoals(performance.getTotalGoals())
                .totalAssists(performance.getTotalAssists())
                .totalShots(performance.getTotalShots())
                .shotsOnTarget(performance.getShotsOnTarget())
                .penaltiesScored(performance.getPenaltiesScored())
                .penaltiesTaken(performance.getPenaltiesTaken())
                .successfulDribbles(performance.getSuccessfulDribbles())
                .passAccuracy(performance.getPassAccuracy())
                .successfulPasses(performance.getSuccessfulPasses())
                .ballsRecovered(performance.getBallsRecovered())
                .successfulCrosses(performance.getSuccessfulCrosses())
                .interceptions(performance.getInterceptions())
                .ballsLost(performance.getBallsLost())
                .savesMade(performance.getSavesMade())
                .cleanSheets(performance.getCleanSheets())
                .penaltiesSaved(performance.getPenaltiesSaved())
                .goalsConceded(performance.getGoalsConceded())
                .savePercentage(performance.getSavePercentage())
                .rating(performance.getRating())
                .notes(performance.getNotes())
                .build();
    }
}