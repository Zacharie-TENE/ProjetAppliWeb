package com.web.n7.model;

import com.web.n7.model.users.Player;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_performances")
@Getter
@Setter
@ToString(exclude = {"player", "competition"})
@EqualsAndHashCode(exclude = {"player", "competition"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
 
    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;



// === Statistiques communes à tous les postes ===
    @Column(name = "total_matches")
    private Integer totalMatches;

    @Column(name = "total_fouls")
    private Integer totalFouls;

    
    @Column(name = "total_yellow_cards")
    private Integer totalYellowCards;
    
    @Column(name = "total_red_cards")
    private Integer totalRedCards;
    
    @Column(name = "total_minutes_played")
    private Integer totalMinutesPlayed;


    // === Pour les attaquants ===
    @Column(name = "total_goals")
    private Integer totalGoals; // buts marqués
    
    @Column(name = "total_assists")
    private Integer totalAssists; // passes décisives
    
    @Column(name = "total_shots")
    private Integer totalShots; // tirs tentés
    
    @Column(name = "shots_on_target")
    private Integer shotsOnTarget; // tirs cadrés
    
    @Column(name = "penalties_scored")
    private Integer penaltiesScored;
    
    @Column(name = "penalties_taken")
    private Integer penaltiesTaken;
    
    @Column(name = "successful_dribbles")
    private Integer successfulDribbles;
    


// === Pour les milieux de terrain ===
    @Column(name = "pass_accuracy")
    private Double passAccuracy; // précision de passe en %

    @Column(name = "successful_passes")
    private Integer successfulPasses;

    @Column(name = "balls_recovered")
    private Integer ballsRecovered;

    @Column(name = "successful_crosses")
    private Integer successfulCrosses;


// === Pour les défenseurs ===
    @Column(name = "interceptions")
    private Integer interceptions;

    @Column(name = "balls_lost")
    private Integer ballsLost;

  
    // === Pour les gardiens de but ===

    @Column(name = "saves_made")
    private Integer savesMade; // arrêts réalisés

    @Column(name = "clean_sheets")
    private Integer cleanSheets; // matchs sans but encaissé

    @Column(name = "penalties_saved")
    private Integer penaltiesSaved;

    @Column(name = "goals_conceded")
    private Integer goalsConceded;

    @Column(name = "save_percentage")
    private Double savePercentage; // % d'arrêts réussis


    @Column(name = "rating")
    private Double rating;

    @Column(name = "notes", columnDefinition = "LONGVARCHAR")
    private String notes;//description de la performance globale par le coach

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}