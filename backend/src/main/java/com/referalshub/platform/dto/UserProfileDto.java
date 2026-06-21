package com.referalshub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private String name;
    private String email;
    private String skills;
    private String experience;
    private String linkedinUrl;
    private String portfolioUrl;
    private String resumeUrl;
}
