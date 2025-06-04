package com.web.n7.controller;

import java.util.List;

import com.web.n7.service.MatchServiceImpl;
import com.web.n7.serviceInterface.CompetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.web.n7.dto.coach.CoachMatchSheetManagementDTO;
import com.web.n7.dto.coach.CoachMatchSheetsResponseDTO;
import com.web.n7.dto.match.*;
import com.web.n7.filter.MatchFilter;
import com.web.n7.serviceInterface.MatchService;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {


    private final MatchServiceImpl matchService;

@GetMapping("/all")
public ResponseEntity<List<MatchDTO>> getAllMatches(MatchFilter filter){
    return ResponseEntity.ok(matchService.getAllMatches(filter));
}

    // Endpoints pour tous les utilisateurs
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<MatchDTO>> getMatchesByTeamId(
            @PathVariable Long teamId, MatchFilter filter) {
        return ResponseEntity.ok(matchService.getMatchesByTeamId(teamId, filter));
    }


    @GetMapping("/{matchId}")
    public ResponseEntity<MatchDTO> getMatchById(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.getMatchById(matchId));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<List<MatchDTO>> getMatchesByCompetitionId(
            @PathVariable Long competitionId, MatchFilter filter) {
        return ResponseEntity.ok(matchService.getMatchesByCompetitionId(competitionId, filter));
    }

    @GetMapping("/{matchId}/sheets")
    public ResponseEntity<List<MatchSheetDTO>> getMatchSheetByMatchId(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.getMatchSheetByMatchId(matchId));
    }

    @GetMapping("/sheets/{matchSheetId}")
    public ResponseEntity<MatchSheetDTO> getMatchSheetBy(@PathVariable Long matchSheetId) {
        return ResponseEntity.ok(matchService.getMatchSheetBy(matchSheetId));
    }

    @GetMapping("/{matchId}/consolidated")
    public ResponseEntity<ConsolidatedMatchDTO> getConsolidatedMatchSheetByMatchId(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.getConsolidatedMatchSheetByMatchId(matchId));
    }

    @GetMapping("/team/{teamId}/match/{matchId}")
    public ResponseEntity<MatchSheetDTO> getMatchByTeamId(
            @PathVariable Long teamId, @PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.getMatchByTeamId(teamId, matchId));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<MatchDTO>> getMatchesByPlayerId(@PathVariable Long playerId) {
        return ResponseEntity.ok(matchService.getMatchesByPlayerId(playerId));
    }

    // Endpoints pour les organisateurs
    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/organizer/{organizerId}")
    public ResponseEntity<MatchDTO> scheduleMatch(
            @PathVariable Long organizerId, @RequestBody MatchDTO matchDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(matchService.scheduleMatch(organizerId, matchDTO));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/status")
    public ResponseEntity<MatchDTO> updateMatchStatus(
            @PathVariable Long organizerId,
            @RequestBody MatchStatusUpdateDTO matchStatusUpdateDTO,
            @RequestParam String reason) {
        return ResponseEntity.ok(matchService.updateMatchStatus(organizerId, matchStatusUpdateDTO, reason));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}")
    public ResponseEntity<MatchDTO> updateMatchInfo(
            @PathVariable Long organizerId, @RequestBody MatchDTO matchDTO) {
        return ResponseEntity.ok(matchService.updateMatchInfo(organizerId, matchDTO));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/score")
    public ResponseEntity<MatchDTO> updateMatchScore(
            @PathVariable Long organizerId, @RequestBody MatchScoreUpdateDTO matchScoreUpdateDTO) {
        return ResponseEntity.ok(matchService.updateMatchScore(organizerId, matchScoreUpdateDTO));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/match/{matchId}/participants")
    public ResponseEntity<List<MatchParticipantDTO>> updateMatchParticipants(
            @PathVariable Long organizerId,
            @PathVariable Long matchId,
            @RequestBody List<MatchParticipantDTO> participants) {
        return ResponseEntity.ok(matchService.updateMatchParticipants(organizerId, matchId, participants));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/validate-sheet")
    public ResponseEntity<MatchSheetDTO> validateMatchSheet(
            @PathVariable Long organizerId,
            @RequestBody MatchSheetValidationDTO matchSheetValidationDTO,
            @RequestParam String comments) {
        return ResponseEntity.ok(matchService.validateMatchSheet(organizerId, matchSheetValidationDTO, comments));
    }

    // Endpoints pour les coachs
    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/team/{teamId}/sheets")
    public ResponseEntity<CoachMatchSheetsResponseDTO> getMatchSheetsByTeamAndCoach(
            @PathVariable Long coachId, @PathVariable Long teamId) {
        return ResponseEntity.ok(matchService.getMatchSheetsByTeamAndCoach(coachId, teamId));
    }

    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/sheets")
    public ResponseEntity<CoachMatchSheetsResponseDTO> getMatchSheetsByCoach(@PathVariable Long coachId) {
        return ResponseEntity.ok(matchService.getMatchSheetsByCoach(coachId));
    }

    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/sheet/{matchSheetId}")
    public ResponseEntity<CoachMatchSheetManagementDTO> getMatchSheet(
            @PathVariable Long coachId, @PathVariable Long matchSheetId) {
        return ResponseEntity.ok(matchService.getMatchSheet(coachId, matchSheetId));
    }

    @PreAuthorize("hasRole('COACH')")
    @PutMapping("/coach/{coachId}/sheet/{matchSheetId}")
    public ResponseEntity<CoachMatchSheetManagementDTO> updateMatchSheet(
            @PathVariable Long coachId,
            @PathVariable Long matchSheetId,
            @RequestBody CoachMatchSheetManagementDTO matchSheetDTO) {
        return ResponseEntity.ok(matchService.updateMatchSheet(coachId, matchSheetId, matchSheetDTO));
    }
}