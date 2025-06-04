package com.web.n7.dto.users;

import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDTO extends UserDTO {
    private String contactDetails;


}