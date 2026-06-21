package com.referalshub.platform.controller;

import com.referalshub.platform.dto.AuthRequest;
import com.referalshub.platform.dto.AuthResponse;
import com.referalshub.platform.dto.RegisterRequest;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.entity.UserProfile;
import com.referalshub.platform.repository.UserProfileRepository;
import com.referalshub.platform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserProfileRepository userProfileRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = authService.getCurrentUserByEmail(principal.getName());
        String name = userProfileRepository.findByUserId(user.getId())
                .map(UserProfile::getName)
                .orElse(user.getEmail());

        return ResponseEntity.ok(AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .name(name)
                .build());
    }
}
