package com.web.n7.model;

import com.web.n7.model.enumeration.match.MatchRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "match_participants")
@Getter
@Setter
@ToString(exclude = {"match", "team"})
@EqualsAndHashCode(exclude = {"match", "team"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchRole role;
}
