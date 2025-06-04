package com.web.n7.controller;

import java.util.List;

import com.web.n7.service.PlayerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdatePlayerDTO;
import com.web.n7.dto.organizer.OrganizerPlayerPerformanceDTO;
import com.web.n7.dto.player.PlayerPerformanceDTO;
import com.web.n7.dto.users.PlayerDTO;
import com.web.n7.filter.PlayerFilters;
import com.web.n7.serviceInterface.PlayerService;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerServiceImpl playerService;


    // Endpoints pour tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<PlayerDTO>> getAllPlayers(PlayerFilters filter) {
        return ResponseEntity.ok(playerService.getAllPlayers(filter));
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long playerId) {
        return ResponseEntity.ok(playerService.getPlayerById(playerId));
    }

    @GetMapping("/{playerId}/performance")
    public ResponseEntity<List<PlayerPerformanceDTO>> getPlayerPerformance(
            @PathVariable Long playerId, PlayerFilters filter) {
        return ResponseEntity.ok(playerService.getPlayerPerformance(playerId, filter));
    }

    // Endpoints pour les coachs
    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/team/{teamId}")
    public ResponseEntity<PlayerDTO> registerPlayer(
            @PathVariable Long coachId,
            @PathVariable Long teamId,
            @RequestBody RegisterPlayerDTO playerDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(playerService.registerPlayer(coachId, teamId, playerDTO));
    }

    @PreAuthorize("hasRole('COACH')")
    @PutMapping("/coach/{coachId}")
    public ResponseEntity<PlayerDTO> updatePlayer(
            @PathVariable Long coachId,
            @RequestBody UpdatePlayerDTO playerDTO) {
        return ResponseEntity.ok(playerService.updatePlayer(coachId, playerDTO));
    }

    //retirer un joueur d'une equipe, faut se rassurer que le joueur n est pas enregistré dans un match à venir
//mettre à jour le frontend de la requete 
    @PreAuthorize("hasRole('COACH')")
    @DeleteMapping("/coach/{coachId}/player/{playerId}")
    public ResponseEntity<Void> removePlayer(
            @PathVariable Long coachId,
            @PathVariable Long playerId,
            @PathVariable Long teamId) {
        playerService.removePlayer(coachId, playerId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}")
    public ResponseEntity<List<PlayerDTO>> getPlayersByCoach(@PathVariable Long coachId) {
        return ResponseEntity.ok(playerService.getPlayersByCoach(coachId));
    }

    //@PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/team/{teamId}")
    public ResponseEntity<List<PlayerDTO>> getPlayersByTeam(
            @PathVariable Long coachId,
            @PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(coachId, teamId));
    }

    // Endpoints pour les organisateurs
    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{organizerId}/competition/{competitionId}")
    public ResponseEntity<List<PlayerDTO>> getPlayersByCompetition(
            @PathVariable Long organizerId,
            @PathVariable Long competitionId) {
        return ResponseEntity.ok(playerService.getPlayersByCompetition(organizerId, competitionId));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/performance")
    public ResponseEntity<OrganizerPlayerPerformanceDTO> updatePlayerMatchPerformance(
            @PathVariable Long organizerId,
            @RequestBody OrganizerPlayerPerformanceDTO playerPerformanceDTO) {
        return ResponseEntity.ok(playerService.updatePlayerMatchPerformance(organizerId, playerPerformanceDTO));
    }
}