package com.web.n7.controller;

import java.util.List;

import com.web.n7.service.CompetitionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.n7.dto.coach.CoachCompetitionRequestDTO;
import com.web.n7.dto.common.CompetitionDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionStatusUpdateDTO;
import com.web.n7.dto.organizer.OrganizerCompetitionsResponseDTO;
import com.web.n7.dto.organizer.TeamCompetitionStatusUpdateDTO;
import com.web.n7.filter.CompetitionFilter;
import com.web.n7.serviceInterface.CompetitionService;

@RestController
@RequestMapping("/api/competitions")
 @RequiredArgsConstructor
public class CompetitionController {


    private final CompetitionServiceImpl competitionService;


    // Endpoints pour tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<CompetitionDTO>> getAllCompetitions(CompetitionFilter filter) {
        return ResponseEntity.ok(competitionService.getAllCompetitions(filter));
    }

    @GetMapping("/{competitionId}")
    public ResponseEntity<CompetitionDTO> getCompetitionById(@PathVariable Long competitionId) {
        return ResponseEntity.ok(competitionService.getCompetitionById(competitionId));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<CompetitionDTO>> getCompetitionsByTeamId(
            @PathVariable Long teamId, CompetitionFilter filter) {
        return ResponseEntity.ok(competitionService.getCompetitionsByTeamId(teamId, filter));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CompetitionDTO>> getCompetitionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(competitionService.getCompetitionsByUserId(userId));
    }

    // Endpoints pour les organisateurs
    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/organizer/{organizerId}")
    public ResponseEntity<OrganizerCompetitionDTO> createCompetition(
            @PathVariable Long organizerId, @RequestBody OrganizerCompetitionDTO competitionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(competitionService.createCompetition(organizerId, competitionDTO));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/{competitionId}")
    public ResponseEntity<OrganizerCompetitionDTO> updateCompetition(
            @PathVariable Long organizerId, 
            @PathVariable Long competitionId, 
            @RequestBody OrganizerCompetitionDTO competitionDTO) {
        return ResponseEntity.ok(competitionService.updateCompetition(organizerId, competitionId, competitionDTO));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @DeleteMapping("/organizer/{organizerId}/{competitionId}")
    public ResponseEntity<Void> deleteCompetition(
            @PathVariable Long organizerId, 
            @PathVariable Long competitionId) {
        competitionService.deleteCompetition(organizerId, competitionId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<OrganizerCompetitionsResponseDTO> getCompetitionsByOrganizer(
            @PathVariable Long organizerId, CompetitionFilter filter) {
        return ResponseEntity.ok(competitionService.getCompetitionsByOrganizer(organizerId, filter));
    }

//    @PreAuthorize("hasRole('ORGANIZER')")
//    @GetMapping("/organizer/{organizerId}/{competitionId}")
//    public ResponseEntity<OrganizerCompetitionDTO> getCompetitionByIdForOrganizer(
//            @PathVariable Long organizerId,
//            @PathVariable Long competitionId) {
//        return ResponseEntity.ok(competitionService.getCompetitionById(organizerId, competitionId));
//    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/status")
    public ResponseEntity<OrganizerCompetitionDTO> updateCompetitionStatus(
            @PathVariable Long organizerId, 
            @RequestBody OrganizerCompetitionStatusUpdateDTO statusUpdateDTO,
            @RequestParam String reason) {
        return ResponseEntity.ok(competitionService.updateCompetitionStatus(organizerId, statusUpdateDTO, reason));
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/team-status")
    public ResponseEntity<Void> updateTeamCompetitionStatus(
            @PathVariable Long organizerId, 
            @RequestBody TeamCompetitionStatusUpdateDTO statusUpdateDTO,
            @RequestParam String reason) {
        competitionService.updateTeamCompetitionStatus(organizerId, statusUpdateDTO, reason);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/organizer/{organizerId}/request/{requestId}")
    public ResponseEntity<Void> processCompetitionRequest(
            @PathVariable Long organizerId, 
            @PathVariable Long requestId,
            @RequestParam boolean approved,
            @RequestParam String reason) {
        competitionService.processCompetitionRequest(organizerId, requestId, approved, reason);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer/{organizerId}/competition/{competitionId}/requests")
    public ResponseEntity<List<CoachCompetitionRequestDTO>> getRequestsByCompetitionId(
            @PathVariable Long organizerId,
            @PathVariable Long competitionId) {
        return ResponseEntity.ok(competitionService.getRequestsByCompetitionId(organizerId, competitionId));
    }

    // Endpoints pour les coachs
    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/team/{teamId}/register/{competitionId}")
    public ResponseEntity<CoachCompetitionRequestDTO> requestTeamRegistration(
            @PathVariable Long coachId, 
            @PathVariable Long teamId, 
            @PathVariable Long competitionId,
            @RequestParam String reason) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(competitionService.requestTeamRegistration(coachId, teamId, competitionId, reason));
    }

    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/team/{teamId}/withdraw/{competitionId}")
    public ResponseEntity<CoachCompetitionRequestDTO> requestTeamWithdrawal(
            @PathVariable Long coachId, 
            @PathVariable Long teamId, 
            @PathVariable Long competitionId,
            @RequestParam String reason) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(competitionService.requestTeamWithdrawal(coachId, teamId, competitionId, reason));
    }

    @PreAuthorize("hasRole('COACH')")
    @PostMapping("/coach/{coachId}/team/{teamId}/withdraw-all")
    public ResponseEntity<Void> requestTeamsWithdrawalIntoAllCompetition(
            @PathVariable Long coachId, 
            @PathVariable Long teamId,
            @RequestParam String reason) {
        competitionService.requestTeamsWithdrawalIntoAllCompetition(coachId, teamId, reason);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('COACH')")
    @GetMapping("/coach/{coachId}/requests")
    public ResponseEntity<List<CoachCompetitionRequestDTO>> getCompetitionRequestsByCoach(
            @PathVariable Long coachId) {
        return ResponseEntity.ok(competitionService.getCompetitionRequestsByCoach(coachId));
    }
}