package com.referalshub.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReferralRequestDto {
    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotBlank(message = "Message is required")
    private String message;

    private String resumeUrl;
}
