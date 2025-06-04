package com.web.n7.model.users;

import com.web.n7.model.Team;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;


@EqualsAndHashCode(callSuper = true, exclude = "teams")
@ToString(callSuper = true, exclude = "teams")
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "coaches")
public class Coach extends User {
    
    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Team> teams = new ArrayList<>();

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "specialization", nullable = false)
    private String specialization;

    @Column(name = "years_of_experience", nullable = false)
    private Integer yearsOfExperience;

    @Column(name = "contact_details", nullable = false)
    private String contactDetails;


    @Column(name = "organization", nullable = false)
    private String organization;

    @Column(name = "biography")
    private String biography;
}