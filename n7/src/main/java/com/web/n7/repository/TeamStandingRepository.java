package com.web.n7.repository;

import com.web.n7.model.TeamStanding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamStandingRepository extends JpaRepository<TeamStanding, Long> {
    
    /**
     * Trouve tous les classements pour une équipe donnée
     * @param teamId ID de l'équipe
     * @return Liste des classements
     */
    List<TeamStanding> findByTeamId(Long teamId);
    
    /**
     * Trouve tous les classements pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des classements
     */
    List<TeamStanding> findByCompetitionId(Long competitionId);
    
    /**
     * Trouve le classement pour une équipe dans une compétition spécifique
     * @param competitionId ID de la compétition
     * @param teamId ID de l'équipe
     * @return Le classement si trouvé
     */
    Optional<TeamStanding> findByCompetitionIdAndTeamId(Long competitionId, Long teamId);
    
    /**
     * Trouve tous les classements triés par rang pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des classements ordonnée par rang
     */
    @Query("SELECT ts FROM TeamStanding ts WHERE ts.competition.id = :competitionId ORDER BY ts.rank ASC")
    List<TeamStanding> findByCompetitionIdOrderByRank(@Param("competitionId") Long competitionId);
    
    /**
     * Trouve tous les classements pour les équipes d'un coach spécifique
     * @param coachId ID du coach
     * @return Liste des classements
     */
    @Query("SELECT ts FROM TeamStanding ts WHERE ts.team.coach.id = :coachId")
    List<TeamStanding> findByCoachId(@Param("coachId") Long coachId);
    
    /**
     * Calcule le rang moyen d'une équipe dans toutes les compétitions
     * @param teamId ID de l'équipe
     * @return Rang moyen
     */
    @Query("SELECT AVG(ts.rank) FROM TeamStanding ts WHERE ts.team.id = :teamId")
    Double getAverageRankByTeamId(@Param("teamId") Long teamId);
} 