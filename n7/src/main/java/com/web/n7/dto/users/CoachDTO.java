package com.web.n7.dto.users;

import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class CoachDTO  extends UserDTO {
    private String licenseNumber;
    private Integer yearsOfExperience;
    private Integer numberOfTeams;
    private String contactDetails;
    private String specialization;
    private String organization;
    private String biography;
}

