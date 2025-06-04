package com.web.n7.model;

import com.web.n7.model.enumeration.match.MatchSheetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "match_sheets")
@Getter
@Setter
@ToString(exclude = {"match", "playerParticipations"})
@EqualsAndHashCode(exclude = {"match", "playerParticipations"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchSheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

        
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;


    @Column(name = "match_sheet_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private MatchSheetStatus status;

    @Column(name = "validation_date")
    private LocalDateTime validationDate;


    @Column(name = "submission_deadline")
    private LocalDate submissionDeadline;

    @OneToMany(mappedBy = "matchSheet", cascade = CascadeType.ALL)
    private List<PlayerParticipation> playerParticipations = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name="strategy")
    private String strategy;
}