package com.web.n7.model;

import com.web.n7.model.enumeration.competition.RequestType;
import com.web.n7.model.enumeration.competition.RequestStatus;
import com.web.n7.model.users.Coach;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "competition_requests")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompetitionRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;
    
    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private RequestType requestType; // REGISTRATION, WITHDRAWAL
    
    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", nullable = false)
    private RequestStatus requestStatus; // PENDING, APPROVED, REJECTED
    
    @Column(nullable = false)
    private String reason;
    
    @Column(name = "response_message")
    private String responseMessage;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}