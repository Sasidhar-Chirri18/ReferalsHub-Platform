package com.referalshub.platform.controller;

import com.referalshub.platform.dto.ReferrerProfileDto;
import com.referalshub.platform.dto.UserProfileDto;
import com.referalshub.platform.entity.Role;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.service.AuthService;
import com.referalshub.platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        if (user.getRole() == Role.REFERRER) {
            return ResponseEntity.ok(userService.getReferrerProfile(user));
        } else {
            return ResponseEntity.ok(userService.getUserProfile(user));
        }
    }

    @PutMapping("/profile/user")
    public ResponseEntity<UserProfileDto> updateUserProfile(Principal principal, @RequestBody UserProfileDto dto) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(userService.updateUserProfile(user, dto));
    }

    @PutMapping("/profile/referrer")
    public ResponseEntity<ReferrerProfileDto> updateReferrerProfile(Principal principal, @RequestBody ReferrerProfileDto dto) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(userService.updateReferrerProfile(user, dto));
    }
}
