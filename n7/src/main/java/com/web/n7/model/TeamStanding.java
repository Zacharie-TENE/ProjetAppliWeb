package com.web.n7.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "standings")
@Builder
//stat of a team
public class TeamStanding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "rank", nullable = false)
    private Integer rank;

    @Column(name = "played_matches", nullable = false)
    private Integer playedMatches;

    @Column(name = "wins", nullable = false)
    private Integer wins;

    @Column(name = "draws", nullable = false)
    private Integer draws;

    @Column(name = "losses", nullable = false)
    private Integer losses;

    @Column(name = "goals_for", nullable = false)
    private Integer goalsFor;

    @Column(name = "goals_against", nullable = false)
    private Integer goalsAgainst;

    @Column(name = "points", nullable = false)
    private Integer points;

    @Column(name = "goal_difference", nullable = false)
    private Integer goalDifference;

    @Column(name = "home_wins", nullable = false)
    private Integer homeWins;

    @Column(name = "home_draws", nullable = false)
    private Integer homeDraws;

    @Column(name = "home_losses", nullable = false)
    private Integer homeLosses;

    @Column(name = "away_wins", nullable = false)
    private Integer awayWins;

    @Column(name = "away_draws", nullable = false)
    private Integer awayDraws;

    @Column(name = "away_losses", nullable = false)
    private Integer awayLosses;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


}