package com.web.n7.repository;

import com.web.n7.model.users.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {
    
    /**
     * Trouve tous les coachs avec des équipes dans une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des coachs
     */
    @Query("SELECT DISTINCT t.coach FROM Team t JOIN t.competitionTeams ct WHERE ct.competition.id = :competitionId")
    List<Coach> findByCompetitionId(@Param("competitionId") Long competitionId);
    
    /**
     * Trouve tous les coachs par licence
     * @param licenseNumber Numéro de licence
     * @return Le coach si trouvé
     */
    Optional<Coach> findByLicenseNumber(String licenseNumber);
} 