package com.web.n7.dto.match;

import com.web.n7.model.enumeration.match.MatchSheetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchSheetValidationDTO {
    private Long matchSheetId;
    private Boolean isApproved;
    private MatchSheetStatus newStatus;
}