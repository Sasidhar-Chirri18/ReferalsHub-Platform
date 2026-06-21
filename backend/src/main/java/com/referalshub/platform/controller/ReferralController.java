package com.referalshub.platform.controller;

import com.referalshub.platform.dto.ReferralRequestDto;
import com.referalshub.platform.dto.ReferralResponseDto;
import com.referalshub.platform.entity.ReferralStatus;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.service.AuthService;
import com.referalshub.platform.service.ReferralService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ReferralResponseDto> submitRequest(
            Principal principal,
            @Valid @RequestBody ReferralRequestDto dto
    ) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(referralService.submitRequest(user, dto));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<ReferralResponseDto>> getMyRequests(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(referralService.getRequestsForRequester(user));
    }

    @GetMapping("/received-requests")
    public ResponseEntity<List<ReferralResponseDto>> getReceivedRequests(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(referralService.getRequestsForReferrer(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReferralResponseDto>> getAllRequests() {
        return ResponseEntity.ok(referralService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReferralResponseDto> updateStatus(
            Principal principal,
            @PathVariable Long id,
            @RequestParam ReferralStatus status
    ) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(referralService.updateStatus(user, id, status));
    }
}
