package com.web.n7.model;

import com.web.n7.model.enumeration.competition.CompetitionType;
import com.web.n7.model.enumeration.competition.CompetitionStatus;
import com.web.n7.model.users.Organizer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "competitions")
@Getter
@Setter
@ToString(exclude = {"competitionTeams", "matches"})
@EqualsAndHashCode(exclude = {"competitionTeams", "matches"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "competition_type", nullable = false)
    private CompetitionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "competition_status", nullable = false)
    private CompetitionStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "category")
    private String category;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "registration_deadline")
    private LocalDate registrationDeadline;

    @Column(nullable = false)
    private String location;

    @Column(name = "max_teams")
    private Integer maxTeams;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CompetitionTeam> competitionTeams = new ArrayList<>();

    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Match> matches = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}