package com.web.n7.controller;

import java.util.List;

import com.web.n7.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.web.n7.dto.coach.CreateTeamDTO;
import com.web.n7.dto.coach.RegisterPlayerDTO;
import com.web.n7.dto.coach.UpdateTeamDTO;
import com.web.n7.dto.organizer.OrganizerTeamSummaryDTO;
import com.web.n7.dto.users.CoachDTO;
import com.web.n7.dto.teams.StandingDTO;
import com.web.n7.dto.teams.TeamDTO;
import com.web.n7.filter.TeamFilter;
import com.web.n7.serviceInterface.TeamService;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {


  
    private final  TeamService teamService;



    // Endpoints pour tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams(TeamFilter filter) {
        return ResponseEntity.ok(teamService.getAllTeams(filter));
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamById(teamId));
    }

    @GetMapping("/coach/{coachId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByCoachId(
            @PathVariable Long coachId, TeamFilter filter) {
        return ResponseEntity.ok(teamService.getTeamsByCoachId(coachId, filter));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByCompetitionId(
            @PathVariable Long competitionId, TeamFilter filter) {
        return ResponseEntity.ok(teamService.getTeamsByCompetitionId(competitionId, filter));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByPlayerId(
            @PathVariable Long playerId, TeamFilter filter) {
        return ResponseEntity.ok(teamService.getTeamsByPlayerId(playerId, filter));
    }

    @GetMapping("/{teamId}/standings")
    public ResponseEntity<List<StandingDTO>> getTeamStandingsByTeamId(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamStandingsByTeamId(teamId));
    }

    @GetMapping("/competition/{competitionId}/standings")
    public ResponseEntity<List<StandingDTO>> getTeamStandingsByCompetitionId(
            @PathVariable Long competitionId) {
        return ResponseEntity.ok(teamService.getTeamStandingsByCompetitionId(competitionId));
    }

    @GetMapping("/competition/{competitionId}/team/{teamId}/standing")
    public ResponseEntity<StandingDTO> getTeamStandingByCompetitionIdAndTeamId(
            @PathVariable Long competitionId,
            @PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamStandingByCompetitionIdAndTeamId(competitionId, teamId));
    }

    // Endpoints pour les coachs
    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}")
    public ResponseEntity<TeamDTO> createTeam(
            @PathVariable Long coachId,
            @RequestBody CreateTeamDTO createTeamDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teamService.createTeam(coachId, createTeamDTO));
    }

    @PreAuthorize("hasRole('COACH')")
    @PutMapping("/coach/{coachId}")
    public ResponseEntity<TeamDTO> updateTeam(
            @PathVariable Long coachId,
            @RequestBody UpdateTeamDTO updateTeamDTO) {
        return ResponseEntity.ok(teamService.updateTeam(coachId, updateTeamDTO));
    }

    @PreAuthorize("hasRole('COACH')")
    @DeleteMapping("/coach/{coachId}/team/{teamId}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long coachId,
            @PathVariable Long teamId) {
        teamService.deleteTeam(coachId, teamId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/all")
    public ResponseEntity<List<TeamDTO>> getAllTeamsByCoach(@PathVariable Long coachId) {
        return ResponseEntity.ok(teamService.getAllTeamsByCoach(coachId));
    }

    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/team/{teamId}/player")
    public ResponseEntity<TeamDTO> addPlayerToTeam(
            @PathVariable Long coachId,
            @PathVariable Long teamId,
            @RequestBody RegisterPlayerDTO playerDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teamService.addPlayerToTeam(coachId, teamId, playerDTO));
    }

    @PreAuthorize("hasRole('COACH')")
    @DeleteMapping("/coach/{coachId}/team/{teamId}/player/{playerId}")
    public ResponseEntity<TeamDTO> removePlayerFromTeam(
            @PathVariable Long coachId,
            @PathVariable Long teamId,
            @PathVariable Long playerId) {
        return ResponseEntity.ok(teamService.removePlayerFromTeam(coachId, teamId, playerId));
    }

    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/transfer/from/{sourceTeamId}/to/{targetTeamId}/player/{playerId}")
    public ResponseEntity<Void> transferPlayer(
            @PathVariable Long coachId,
            @PathVariable Long sourceTeamId,
            @PathVariable Long targetTeamId,
            @PathVariable Long playerId) {
        teamService.transferPlayer(coachId, sourceTeamId, targetTeamId, playerId);
        return ResponseEntity.ok().build();
    }

    // Endpoints pour les organisateurs
    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{organizerId}/competition/{competitionId}")
    public ResponseEntity<List<OrganizerTeamSummaryDTO>> getTeamsByCompetition(
            @PathVariable Long organizerId,
            @PathVariable Long competitionId) {
        return ResponseEntity.ok(teamService.getTeamsByCompetition(organizerId, competitionId));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{organizerId}/competition/{competitionId}/coaches")
    public ResponseEntity<List<CoachDTO>> getCoachesByCompetition(
            @PathVariable Long organizerId,
            @PathVariable Long competitionId) {
        return ResponseEntity.ok(teamService.getCoachesByCompetition(organizerId, competitionId));
    }
 
}