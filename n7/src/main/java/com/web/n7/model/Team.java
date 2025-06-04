package com.web.n7.model;


import com.web.n7.model.users.Coach;
import com.web.n7.model.users.Player;
import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter
@Setter
@ToString(exclude = {"coach", "players", "competitionTeams"})
@EqualsAndHashCode(exclude = {"coach", "players", "competitionTeams"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String logo;

    @Column(nullable = false)
    private String category; // Par exemple: JUNIOR, SENIOR, VETERAN, ou n'importe quoi du genre juste extension pas besoin d'implementer ca pour le moment.

    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)

    @Builder.Default
    private List<Player> players = new ArrayList<>();

    
    @Builder.Default
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompetitionTeam> competitionTeams = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}