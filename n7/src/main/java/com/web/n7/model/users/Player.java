package com.web.n7.model.users;
import com.web.n7.model.PlayerPerformance;
import com.web.n7.model.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

import com.web.n7.model.enumeration.player.PlayerStatus;

@EqualsAndHashCode(callSuper = true, exclude = {"team", "performances"})
@ToString(callSuper = true, exclude = {"team", "performances"})
@Getter
@Setter
@Entity
@Table(name = "players")
@AllArgsConstructor
@NoArgsConstructor
public class Player extends User {

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;  //pertinence j'en suis pas sur sauf si les joueurs mentent sur leur age ,mdr

    @Column(name = "position")
    private String position; //FORWARD,MIDFIELDER,DEFENDER,GOALKEEPER
    @Enumerated(EnumType.STRING)
    @Column(name = "player_status", nullable = false)
    private PlayerStatus status ; // Valeur par défau
    

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;


    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlayerPerformance> performances = new ArrayList<>();

}
