package com.web.n7.repository;

import com.web.n7.model.PlayerParticipation;
import com.web.n7.model.enumeration.player.PlayerStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerParticipationRepository extends JpaRepository<PlayerParticipation, Long> {
    
    /**
     * Trouve toutes les participations pour une feuille de match donnée
     * @param matchSheetId ID de la feuille de match
     * @return Liste des participations
     */
    List<PlayerParticipation> findByMatchSheetId(Long matchSheetId);
    
    /**
     * Trouve toutes les participations pour un joueur donné
     * @param playerId ID du joueur
     * @return Liste des participations
     */
    List<PlayerParticipation> findByPlayerId(Long playerId);
    
    /**
     * Trouve toutes les participations pour un joueur et un statut donnés
     * @param playerId ID du joueur
     * @param status Statut du joueur
     * @return Liste des participations
     */
    List<PlayerParticipation> findByPlayerIdAndStatus(Long playerId, PlayerStatus status);
    
    /**
     * Compte le nombre de participations pour un joueur
     * @param playerId ID du joueur
     * @return Nombre de participations
     */
    @Query("SELECT COUNT(pp) FROM PlayerParticipation pp WHERE pp.player.id = :playerId")
    Long countByPlayerId(@Param("playerId") Long playerId);
} 