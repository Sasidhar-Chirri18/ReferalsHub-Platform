package com.referalshub.platform.service;

import com.referalshub.platform.dto.ReferrerProfileDto;
import com.referalshub.platform.dto.UserProfileDto;
import com.referalshub.platform.entity.ReferrerProfile;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.entity.UserProfile;
import com.referalshub.platform.exception.ResourceNotFoundException;
import com.referalshub.platform.repository.ReferrerProfileRepository;
import com.referalshub.platform.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final ReferrerProfileRepository referrerProfileRepository;

    public UserProfileDto getUserProfile(User user) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        return UserProfileDto.builder()
                .name(profile.getName())
                .email(user.getEmail())
                .skills(profile.getSkills())
                .experience(profile.getExperience())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeUrl(profile.getResumeUrl())
                .build();
    }

    @Transactional
    public UserProfileDto updateUserProfile(User user, UserProfileDto dto) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        
        profile.setName(dto.getName());
        profile.setSkills(dto.getSkills());
        profile.setExperience(dto.getExperience());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        if (dto.getResumeUrl() != null && !dto.getResumeUrl().isEmpty()) {
            profile.setResumeUrl(dto.getResumeUrl());
        }
        
        profile = userProfileRepository.save(profile);
        return UserProfileDto.builder()
                .name(profile.getName())
                .email(user.getEmail())
                .skills(profile.getSkills())
                .experience(profile.getExperience())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeUrl(profile.getResumeUrl())
                .build();
    }

    public ReferrerProfileDto getReferrerProfile(User user) {
        UserProfile baseProfile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        ReferrerProfile refProfile = referrerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Referrer profile not found"));

        return ReferrerProfileDto.builder()
                .name(baseProfile.getName())
                .email(user.getEmail())
                .companyName(refProfile.getCompanyName())
                .designation(refProfile.getDesignation())
                .yearsOfExperience(refProfile.getYearsOfExperience())
                .referralAvailability(refProfile.getReferralAvailability())
                .build();
    }

    @Transactional
    public ReferrerProfileDto updateReferrerProfile(User user, ReferrerProfileDto dto) {
        UserProfile baseProfile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        ReferrerProfile refProfile = referrerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Referrer profile not found"));

        baseProfile.setName(dto.getName());
        userProfileRepository.save(baseProfile);

        refProfile.setCompanyName(dto.getCompanyName());
        refProfile.setDesignation(dto.getDesignation());
        refProfile.setYearsOfExperience(dto.getYearsOfExperience());
        if (dto.getReferralAvailability() != null) {
            refProfile.setReferralAvailability(dto.getReferralAvailability());
        }
        refProfile = referrerProfileRepository.save(refProfile);

        return ReferrerProfileDto.builder()
                .name(baseProfile.getName())
                .email(user.getEmail())
                .companyName(refProfile.getCompanyName())
                .designation(refProfile.getDesignation())
                .yearsOfExperience(refProfile.getYearsOfExperience())
                .referralAvailability(refProfile.getReferralAvailability())
                .build();
    }
}
