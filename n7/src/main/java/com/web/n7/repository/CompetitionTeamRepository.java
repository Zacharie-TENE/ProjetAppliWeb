package com.web.n7.repository;

import com.web.n7.model.CompetitionTeam;
import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetitionTeamRepository extends JpaRepository<CompetitionTeam, Long> {
    
    /**
     * Trouve toutes les associations CompetitionTeam pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des CompetitionTeam
     */
    List<CompetitionTeam> findByCompetitionId(Long competitionId);
    
    /**
     * Trouve toutes les associations CompetitionTeam pour une équipe donnée
     * @param teamId ID de l'équipe
     * @return Liste des CompetitionTeam
     */
    List<CompetitionTeam> findByTeamId(Long teamId);
    
    /**
     * Trouve l'association CompetitionTeam pour une compétition et une équipe données
     * @param competitionId ID de la compétition
     * @param teamId ID de l'équipe
     * @return L'association CompetitionTeam si elle existe
     */
    CompetitionTeam findByCompetitionIdAndTeamId(Long competitionId, Long teamId);
    
    /**
     * Trouve toutes les associations CompetitionTeam avec un statut donné
     * @param status Le statut recherché
     * @return Liste des CompetitionTeam
     */
    List<CompetitionTeam> findByStatus(CompetitionTeamStatus status);

    /**
     * Supprime une association CompetitionTeam pour une compétition et une équipe données
     * @param competitionId ID de la compétition
     * @param teamId ID de l'équipe
     */
    void deleteByCompetitionIdAndTeamId(Long id, Long id2);


    /**
     * Vérifie si une association CompetitionTeam existe pour une compétition et une équipe données
     * @param competitionId ID de la compétition
     * @param teamId ID de l'équipe
     * @return true si l'association existe, false sinon
     */
    @Query("SELECT CASE WHEN COUNT(ct) > 0 THEN true ELSE false END FROM CompetitionTeam ct WHERE ct.competition.id = :competitionId AND ct.team.id = :teamId")
    boolean existsByCompetitionIdAndTeamId(Long competitionId, Long teamId);

    /**
     * Trouve toutes les associations CompetitionTeam pour une liste d'équipes données
     * @param teamIds Liste des IDs d'équipes
     * @return Liste des CompetitionTeam
     */
    @Query("SELECT ct FROM CompetitionTeam ct WHERE ct.team.id IN :teamIds")
    List<CompetitionTeam> findByTeamIdIn(List<Long> teamIds);

    /**
     * Compte le nombre d'associations CompetitionTeam pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Nombre d'associations CompetitionTeam
     */
    @Query("SELECT COUNT(ct) FROM CompetitionTeam ct WHERE ct.competition.id = :id")
    int countByCompetitionId(Long id);
    
}