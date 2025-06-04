package com.web.n7.model.users;


import com.web.n7.model.Competition;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "competitions")
@ToString(callSuper = true, exclude = "competitions")
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "organizers")
public class Organizer extends User {

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL)
    private List<Competition> competitions = new ArrayList<>();


    @Column(name = "specialization", nullable = false)
    private String specialization;

    private String organization;

 
    @Column(name = "contact_details", nullable = false)
    private String contactDetails;
}