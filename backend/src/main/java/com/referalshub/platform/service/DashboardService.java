package com.referalshub.platform.service;

import com.referalshub.platform.dto.DashboardStatsDto;
import com.referalshub.platform.entity.Role;
import com.referalshub.platform.entity.ReferralStatus;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.repository.JobRepository;
import com.referalshub.platform.repository.ReferralRequestRepository;
import com.referalshub.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ReferralRequestRepository referralRequestRepository;

    public DashboardStatsDto getDashboardStats(User user) {
        DashboardStatsDto.DashboardStatsDtoBuilder builder = DashboardStatsDto.builder();

        if (user.getRole() == Role.USER || user.getRole() == Role.ADMIN) {
            builder.totalRequests(referralRequestRepository.countByRequesterId(user.getId()));
            builder.pendingRequests(referralRequestRepository.countByRequesterIdAndStatus(user.getId(), ReferralStatus.PENDING));
            builder.acceptedRequests(referralRequestRepository.countByRequesterIdAndStatus(user.getId(), ReferralStatus.ACCEPTED));
            builder.referredRequests(referralRequestRepository.countByRequesterIdAndStatus(user.getId(), ReferralStatus.REFERRED));
        }

        if (user.getRole() == Role.REFERRER || user.getRole() == Role.ADMIN) {
            builder.jobsPosted(jobRepository.countByCreatedById(user.getId()));
            builder.requestsReceived(referralRequestRepository.countByJobCreatedById(user.getId()));
            builder.acceptedReferrals(referralRequestRepository.countByJobCreatedByIdAndStatus(user.getId(), ReferralStatus.REFERRED));
        }

        if (user.getRole() == Role.ADMIN) {
            builder.usersCount(userRepository.count());
            builder.jobsCount(jobRepository.count());
            builder.referralCount(referralRequestRepository.count());
        }

        return builder.build();
    }
}
