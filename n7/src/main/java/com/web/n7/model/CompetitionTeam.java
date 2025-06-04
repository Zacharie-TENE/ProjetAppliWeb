package com.web.n7.model;

import com.web.n7.model.enumeration.competition.CompetitionTeamStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "competition_teams")
@Getter
@Setter
@ToString(exclude = {"competition", "team"})
@EqualsAndHashCode(exclude = {"competition", "team"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompetitionTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompetitionTeamStatus status;
}
