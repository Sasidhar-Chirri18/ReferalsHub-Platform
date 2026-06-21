package com.referalshub.platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Experience required is required")
    private String experienceRequired;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Apply link is required")
    private String applyLink;

    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
}
