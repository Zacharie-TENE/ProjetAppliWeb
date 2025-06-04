package com.web.n7.repository;

import com.web.n7.model.Competition;
import com.web.n7.model.enumeration.competition.CompetitionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {
    
    /**
     * Trouve toutes les compétitions pour un organisateur donné
     * @param organizerId ID de l'organisateur
     * @return Liste des compétitions
     */
    List<Competition> findByOrganizerId(Long organizerId);
    
    /**
     * Trouve toutes les compétitions par statut
     * @param status Statut de la compétition
     * @return Liste des compétitions
     */
    List<Competition> findByStatus(CompetitionStatus status);
    
    /**
     * Trouve toutes les compétitions auxquelles participe une équipe
     * @param teamId ID de l'équipe
     * @return Liste des compétitions
     */
    @Query("SELECT c FROM Competition c JOIN c.competitionTeams ct WHERE ct.team.id = :teamId")
    List<Competition> findByTeamId(@Param("teamId") Long teamId);
    
    /**
     * Trouve toutes les compétitions auxquelles participent les équipes d'un coach
     * @param coachId ID du coach
     * @return Liste des compétitions
     */
    @Query("SELECT DISTINCT c FROM Competition c JOIN c.competitionTeams ct WHERE ct.team.coach.id = :coachId")
    List<Competition> findByCoachId(@Param("coachId") Long coachId);
    
    /**
     * Trouve toutes les compétitions à venir ou en cours
     * @param currentDate Date actuelle
     * @return Liste des compétitions
     */
    @Query("SELECT c FROM Competition c WHERE c.status IN :statuses AND c.endDate >= :currentDate")
    List<Competition> findActiveCompetitions(@Param("statuses") List<CompetitionStatus> statuses, @Param("currentDate") LocalDate currentDate);
    
    /**
     * Trouve toutes les compétitions qui commencent bientôt
     * @param currentDate Date actuelle
     * @param futureDays Nombre de jours dans le futur
     * @return Liste des compétitions
     */
    @Query("SELECT c FROM Competition c WHERE c.status = 'UPCOMING' AND c.startDate BETWEEN :currentDate AND :currentDate + :futureDays")
    List<Competition> findUpcomingCompetitions(@Param("currentDate") LocalDate currentDate, @Param("futureDays") Integer futureDays);
    
    /**
     * Recherche de compétitions par nom (recherche partielle)
     * @param name Partie du nom à rechercher
     * @return Liste des compétitions
     */
    List<Competition> findByNameContainingIgnoreCase(String name);
}