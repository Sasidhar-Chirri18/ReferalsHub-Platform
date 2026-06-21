package com.referalshub.platform.controller;

import com.referalshub.platform.dto.NotificationDto;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.service.AuthService;
import com.referalshub.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(Principal principal, @PathVariable Long id) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        notificationService.markAsRead(user, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}
