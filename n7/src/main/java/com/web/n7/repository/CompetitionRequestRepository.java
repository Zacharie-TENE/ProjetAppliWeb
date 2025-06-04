package com.web.n7.repository;

import com.web.n7.model.CompetitionRequest;
import com.web.n7.model.enumeration.competition.RequestStatus;
import com.web.n7.model.enumeration.competition.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitionRequestRepository extends JpaRepository<CompetitionRequest, Long> {

    /**
     * Trouve toutes les demandes de compétition pour un coach donné
     * @param coachId ID du coach
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByCoachId(Long coachId);
    
    /**
     * Trouve toutes les demandes de compétition pour une équipe donnée
     * @param teamId ID de l'équipe
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByTeamId(Long teamId);
    
    /**
     * Trouve toutes les demandes de compétition pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByCompetitionId(Long competitionId);
    
    /**
     * Trouve toutes les demandes de compétition pour une compétition donnée avec un statut spécifique
     * @param competitionId ID de la compétition
     * @param status Statut de la demande
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByCompetitionIdAndRequestStatus(Long competitionId, RequestStatus status);
    
    /**
     * Trouve toutes les demandes de compétition par type de demande
     * @param requestType Type de demande
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByRequestType(RequestType requestType);
    
    /**
     * Trouve une demande de compétition pour une équipe, une compétition et un type de demande spécifiques
     * @param teamId ID de l'équipe
     * @param competitionId ID de la compétition
     * @param requestType Type de demande
     * @return Demande de compétition si trouvée
     */
    Optional<CompetitionRequest> findByTeamIdAndCompetitionIdAndRequestType(Long teamId, Long competitionId, RequestType requestType);
    
    /**
     * Trouve toutes les demandes de compétition en attente pour une compétition donnée
     * @param competitionId ID de la compétition
     * @return Liste des demandes
     */
    @Query("SELECT cr FROM CompetitionRequest cr WHERE cr.competition.id = :competitionId AND cr.requestStatus = 'PENDING'")
    List<CompetitionRequest> findPendingRequestsByCompetitionId(@Param("competitionId") Long competitionId);
    
    /**
     * Trouve toutes les demandes de compétition pour les équipes d'un coach avec un statut spécifique
     * @param coachId ID du coach
     * @param status Statut de la demande
     * @return Liste des demandes
     */
    List<CompetitionRequest> findByCoachIdAndRequestStatus(Long coachId, RequestStatus status);

    /**
     * Vérifie si une demande de compétition existe pour une équipe, une compétition et un type de demande spécifiques
     * @param teamId ID de l'équipe
     * @param competitionId ID de la compétition
     * @param requestType Type de demande
     * @param requestStatus Statut de la demande
     * @return true si la demande existe, false sinon
     */
    @Query("SELECT CASE WHEN COUNT(cr) > 0 THEN true ELSE false END FROM CompetitionRequest cr WHERE cr.team.id = :teamId AND cr.competition.id = :competitionId AND cr.requestType = :requestType AND cr.requestStatus = :requestStatus")
    boolean existsByTeamIdAndCompetitionIdAndRequestTypeAndRequestStatus(
            @Param("teamId") Long teamId, 
            @Param("competitionId") Long competitionId,
            @Param("requestType") RequestType requestType, 
            @Param("requestStatus") RequestStatus requestStatus);
}