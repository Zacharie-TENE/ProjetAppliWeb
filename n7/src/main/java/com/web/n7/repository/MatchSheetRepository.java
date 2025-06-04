package com.web.n7.repository;

import com.web.n7.model.MatchSheet;
import com.web.n7.model.enumeration.match.MatchSheetStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchSheetRepository extends JpaRepository<MatchSheet, Long> {
    
    /**
     * Trouve toutes les feuilles de match pour une équipe donnée
     * @param teamId ID de l'équipe
     * @return Liste des feuilles de match
     */
    List<MatchSheet> findByTeamId(Long teamId);
    
    /**
     * Trouve toutes les feuilles de match pour un match donné
     * @param matchId ID du match
     * @return Liste des feuilles de match
     */
    List<MatchSheet> findByMatchId(Long matchId);
    
    /**
     * Trouve toutes les feuilles de match pour un joueur donné
     * @param playerId ID du joueur
     * @return Liste des feuilles de match
     */
    @Query("SELECT ms FROM MatchSheet ms JOIN ms.playerParticipations pp WHERE pp.player.id = :playerId")
    List<MatchSheet> findByPlayerId(@Param("playerId") Long playerId);
    
    /**
     * Trouve toutes les feuilles de match pour une équipe et un statut donnés
     * @param teamId ID de l'équipe
     * @param status Statut de la feuille de match
     * @return Liste des feuilles de match
     */
    List<MatchSheet> findByTeamIdAndStatus(Long teamId, MatchSheetStatus status);
    
    /**
     * Trouve la feuille de match pour une équipe et un match donnés
     * @param teamId ID de l'équipe
     * @param matchId ID du match
     * @return Feuille de match
     */
    MatchSheet findByTeamIdAndMatchId(Long teamId, Long matchId);
}