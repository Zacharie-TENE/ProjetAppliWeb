package com.web.n7.model;
import com.web.n7.model.enumeration.match.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "matches")
@Getter
@Setter
@ToString(exclude = {"competition", "participants", "matchSheets"})
@EqualsAndHashCode(exclude = {"competition", "participants", "matchSheets"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;// Barca vs Real Madrid
    private String description;// El clasico
    
    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
      @Builder.Default
    private List<MatchParticipant> participants = new ArrayList<>();

    @Column(name = "match_date", nullable = false)
    private LocalDateTime matchDate;

    @Column(name = "location")
    private String location;

    @Column(name = "home_score")
    private Integer homeScore;

    @Column(name = "away_score")
    private Integer awayScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "match_status", nullable = false)
    private MatchStatus status;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    @Builder.Default
    List<MatchSheet> matchSheets = new ArrayList<>();

    private int round;// Round number in the competition

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}