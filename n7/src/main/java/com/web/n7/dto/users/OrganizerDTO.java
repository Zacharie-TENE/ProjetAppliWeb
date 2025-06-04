package com.web.n7.dto.users;

import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrganizerDTO extends UserDTO {

    private String organization;
    private Integer activeCompetitionsCount;
    private String contactDetails;
    private String specialization;

}