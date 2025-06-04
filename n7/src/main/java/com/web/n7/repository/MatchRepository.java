package com.web.n7.repository;

import com.web.n7.model.Match;
import com.web.n7.model.enumeration.match.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    
    /**
     * Trouve tous les matchs pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des matchs
     */
    List<Match> findByCompetitionId(Long competitionId);
    
    /**
     * Trouve tous les matchs pour une compétition donnée avec un statut spécifique
     * @param competitionId ID de la compétition
     * @param status Statut du match
     * @return Liste des matchs
     */
    List<Match> findByCompetitionIdAndStatus(Long competitionId, MatchStatus status);
    
    /**
     * Trouve tous les matchs futurs pour une compétition donnée
     * @param competitionId ID de la compétition
     * @param now Date et heure actuelles
     * @return Liste des matchs
     */
    @Query("SELECT m FROM Match m WHERE m.competition.id = :competitionId AND m.matchDate > :now ORDER BY m.matchDate ASC")
    List<Match> findUpcomingMatchesByCompetitionId(@Param("competitionId") Long competitionId, @Param("now") LocalDateTime now);
    
    /**
     * Trouve tous les matchs où une équipe participe
     * @param teamId ID de l'équipe
     * @return Liste des matchs
     */
    @Query("SELECT m FROM Match m JOIN m.participants mp WHERE mp.team.id = :teamId")
    List<Match> findByTeamId(@Param("teamId") Long teamId);
    
    /**
     * Trouve tous les matchs récents pour une équipe donnée
     * @param teamId ID de l'équipe
     * @param limit Nombre de matchs à retourner
     * @return Liste des matchs
     */
    @Query(value = "SELECT m.* FROM matches m JOIN match_participants mp ON m.id = mp.match_id " +
           "WHERE mp.team_id = :teamId AND m.match_status = 'COMPLETED' " +
           "ORDER BY m.match_date DESC LIMIT :limit", nativeQuery = true)
    List<Match> findRecentMatchesByTeamId(@Param("teamId") Long teamId, @Param("limit") int limit);
    
    /**
     * Trouve tous les matchs pour une équipe donnée avec un statut spécifique
     * @param teamId ID de l'équipe
     * @param status Statut du match
     * @return Liste des matchs
     */
    @Query("SELECT m FROM Match m JOIN m.participants mp WHERE mp.team.id = :teamId AND m.status = :status")
    List<Match> findByTeamIdAndStatus(@Param("teamId") Long teamId, @Param("status") MatchStatus status);
    
    /**
     * Trouve tous les matchs futurs pour une équipe donnée
     * @param teamId ID de l'équipe
     * @param now Date et heure actuelles
     * @return Liste des matchs
     */
    @Query("SELECT m FROM Match m JOIN m.participants mp WHERE mp.team.id = :teamId AND m.matchDate > :now ORDER BY m.matchDate ASC")
    List<Match> findUpcomingMatchesByTeamId(@Param("teamId") Long teamId, @Param("now") LocalDateTime now);
}