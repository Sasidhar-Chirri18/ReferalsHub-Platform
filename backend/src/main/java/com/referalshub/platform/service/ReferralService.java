package com.referalshub.platform.service;

import com.referalshub.platform.dto.ReferralRequestDto;
import com.referalshub.platform.dto.ReferralResponseDto;
import com.referalshub.platform.entity.*;
import com.referalshub.platform.exception.BadRequestException;
import com.referalshub.platform.exception.ResourceNotFoundException;
import com.referalshub.platform.exception.UnauthorizedException;
import com.referalshub.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final ReferralRequestRepository referralRequestRepository;
    private final JobRepository jobRepository;
    private final UserProfileRepository userProfileRepository;
    private final ReferrerProfileRepository referrerProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReferralResponseDto submitRequest(User requester, ReferralRequestDto dto) {
        if (requester.getRole() != Role.USER) {
            throw new UnauthorizedException("Only candidates (USER role) can request referrals");
        }

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getCreatedBy() != null && job.getCreatedBy().getRole() == Role.REFERRER) {
            ReferrerProfile referrerProfile = referrerProfileRepository.findByUserId(job.getCreatedBy().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Referrer profile not found"));
            if (Boolean.FALSE.equals(referrerProfile.getReferralAvailability())) {
                throw new BadRequestException("This referrer is currently not accepting referral requests");
            }
        }

        String resumeUrl = dto.getResumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            UserProfile requesterProfile = userProfileRepository.findByUserId(requester.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
            resumeUrl = requesterProfile.getResumeUrl();
            if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
                throw new BadRequestException("Please upload a resume or provide a resume URL in your request");
            }
        }

        ReferralRequest request = ReferralRequest.builder()
                .job(job)
                .requester(requester)
                .message(dto.getMessage())
                .resumeUrl(resumeUrl)
                .status(ReferralStatus.PENDING)
                .build();

        request = referralRequestRepository.save(request);

        if (job.getCreatedBy() != null) {
            UserProfile requesterProfile = userProfileRepository.findByUserId(requester.getId()).orElse(null);
            String requesterName = requesterProfile != null ? requesterProfile.getName() : requester.getEmail();
            notificationService.createNotification(
                    job.getCreatedBy(),
                    "New referral request received from " + requesterName + " for job: " + job.getTitle()
            );
        }

        return mapToDto(request);
    }

    @Transactional
    public ReferralResponseDto updateStatus(User user, Long requestId, ReferralStatus newStatus) {
        ReferralRequest request = referralRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Referral request not found"));

        Job job = request.getJob();

        if (user.getRole() != Role.ADMIN && (job.getCreatedBy() == null || !job.getCreatedBy().getId().equals(user.getId()))) {
            throw new UnauthorizedException("You are not authorized to update this request status");
        }

        request.setStatus(newStatus);
        request = referralRequestRepository.save(request);

        String companyName = job.getCompany();
        String message = "Your referral request for " + job.getTitle() + " at " + companyName + " has been " + newStatus.name().toLowerCase() + ".";
        notificationService.createNotification(request.getRequester(), message);

        return mapToDto(request);
    }

    public List<ReferralResponseDto> getRequestsForRequester(User requester) {
        return referralRequestRepository.findByRequesterId(requester.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReferralResponseDto> getRequestsForReferrer(User referrer) {
        return referralRequestRepository.findByJobCreatedById(referrer.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReferralResponseDto> getAllRequests() {
        return referralRequestRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReferralResponseDto mapToDto(ReferralRequest req) {
        UserProfile requesterProfile = userProfileRepository.findByUserId(req.getRequester().getId()).orElse(null);
        String requesterName = requesterProfile != null ? requesterProfile.getName() : "Candidate";

        return ReferralResponseDto.builder()
                .id(req.getId())
                .jobId(req.getJob().getId())
                .jobTitle(req.getJob().getTitle())
                .jobCompany(req.getJob().getCompany())
                .requesterId(req.getRequester().getId())
                .requesterName(requesterName)
                .requesterEmail(req.getRequester().getEmail())
                .message(req.getMessage())
                .resumeUrl(req.getResumeUrl())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .updatedAt(req.getUpdatedAt())
                .build();
    }
}
