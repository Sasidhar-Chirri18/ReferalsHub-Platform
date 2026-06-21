package com.referalshub.platform.service;

import com.referalshub.platform.config.JwtService;
import com.referalshub.platform.dto.AuthRequest;
import com.referalshub.platform.dto.AuthResponse;
import com.referalshub.platform.dto.RegisterRequest;
import com.referalshub.platform.entity.*;
import com.referalshub.platform.exception.BadRequestException;
import com.referalshub.platform.exception.ResourceNotFoundException;
import com.referalshub.platform.repository.ReferrerProfileRepository;
import com.referalshub.platform.repository.UserProfileRepository;
import com.referalshub.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final ReferrerProfileRepository referrerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        // Store standard profile information
        UserProfile profile = UserProfile.builder()
                .user(user)
                .name(request.getName())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .linkedinUrl(request.getLinkedinUrl())
                .portfolioUrl(request.getPortfolioUrl())
                .resumeUrl(request.getResumeUrl())
                .build();
        userProfileRepository.save(profile);

        // Referrers also get a referrer profile
        if (request.getRole() == Role.REFERRER) {
            ReferrerProfile referrerProfile = ReferrerProfile.builder()
                    .user(user)
                    .companyName(request.getCompanyName() != null ? request.getCompanyName() : "")
                    .designation(request.getDesignation() != null ? request.getDesignation() : "")
                    .yearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0)
                    .referralAvailability(true)
                    .build();
            referrerProfileRepository.save(referrerProfile);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .name(request.getName())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .name(profile.getName())
                .build();
    }

    public User getCurrentUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
