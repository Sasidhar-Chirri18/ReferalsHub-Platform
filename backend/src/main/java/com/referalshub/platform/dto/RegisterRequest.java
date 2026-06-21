package com.referalshub.platform.dto;

import com.referalshub.platform.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Name is required")
    private String name;

    // Candidate fields (for USER role)
    private String skills;
    private String experience;
    private String linkedinUrl;
    private String portfolioUrl;
    private String resumeUrl;

    // Referrer fields (for REFERRER role)
    private String companyName;
    private String designation;
    private Integer yearsOfExperience;
}
