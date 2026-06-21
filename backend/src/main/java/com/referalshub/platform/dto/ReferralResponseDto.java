package com.referalshub.platform.dto;

import com.referalshub.platform.entity.ReferralStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReferralResponseDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String jobCompany;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String message;
    private String resumeUrl;
    private ReferralStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
