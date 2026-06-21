package com.referalshub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    // User Dashboard Stats
    private Long totalRequests;
    private Long pendingRequests;
    private Long acceptedRequests;
    private Long referredRequests;

    // Referrer Dashboard Stats
    private Long jobsPosted;
    private Long requestsReceived;
    private Long acceptedReferrals;

    // Admin Dashboard Stats
    private Long usersCount;
    private Long jobsCount;
    private Long referralCount;
}
