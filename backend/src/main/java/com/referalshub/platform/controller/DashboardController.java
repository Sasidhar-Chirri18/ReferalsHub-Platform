package com.referalshub.platform.controller;

import com.referalshub.platform.dto.DashboardStatsDto;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.service.AuthService;
import com.referalshub.platform.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(dashboardService.getDashboardStats(user));
    }
}
