package com.web.n7.model;

import com.web.n7.model.enumeration.player.PlayerPosition;
import com.web.n7.model.users.Player;
import com.web.n7.model.enumeration.player.PlayerStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "player_participations")
@Getter
@Setter
@ToString(exclude = {"matchSheet", "player"})
@EqualsAndHashCode(exclude = {"matchSheet", "player"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_sheet_id", nullable = false)
    private MatchSheet matchSheet;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "shirt_number")
    private Integer shirtNumber; //numero de maillot du joeur(facultatif mais je le laisse)

    @Enumerated(EnumType.STRING)
    @Column(name = "player_status", nullable = false)
    private PlayerStatus status;

    @Column(name = "position")
    private PlayerPosition position;

    @Column(name = "goals_scored")
    private Integer goalsScored;

    @Column(name = "yellow_cards")
    private Integer yellowCards;

    @Column(name = "red_cards")
    private Integer redCards;

    @Column(name = "minutes_played")
    private Integer minutesPlayed;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "substitution_in_time")
    private Integer substitutionInTime;  // Minute d'entrée en jeu , pas obligatoire

    @Column(name = "substitution_out_time")
    private Integer substitutionOutTime; // Minute de sortie du jeu, pas obligatoire




}
