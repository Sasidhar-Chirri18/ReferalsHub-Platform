package com.referalshub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReferrerProfileDto {
    private String name;
    private String email;
    private String companyName;
    private String designation;
    private Integer yearsOfExperience;
    private Boolean referralAvailability;
}
