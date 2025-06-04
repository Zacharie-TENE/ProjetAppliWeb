package com.web.n7.repository;

import com.web.n7.model.Team;
import com.web.n7.model.users.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    /**
     * Trouve toutes les équipes gérées par un coach donné
     * @param coachId ID du coach
     * @return Liste des équipes
     */
    List<Team> findByCoachId(Long coachId);
    
    /**
     * Trouve toutes les équipes par nom (correspondance partielle)
     * @param name Nom de l'équipe
     * @return Liste des équipes
     */
    List<Team> findByNameContainingIgnoreCase(String name);
    
    /**
     * Trouve toutes les équipes participant à une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des équipes
     */
    @Query("SELECT t FROM Team t JOIN t.competitionTeams ct WHERE ct.competition.id = :competitionId")
    List<Team> findByCompetitionsId(@Param("competitionId") Long competitionId);
}