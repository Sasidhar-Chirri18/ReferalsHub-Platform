package com.referalshub.platform.controller;

import com.referalshub.platform.dto.JobDto;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.service.AuthService;
import com.referalshub.platform.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<JobDto> createJob(Principal principal, @Valid @RequestBody JobDto dto) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(jobService.createJob(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(Principal principal, @PathVariable Long id, @Valid @RequestBody JobDto dto) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        return ResponseEntity.ok(jobService.updateJob(user, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(Principal principal, @PathVariable Long id) {
        User user = authService.getCurrentUserByEmail(principal.getName());
        jobService.deleteJob(user, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDto>> searchJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location
    ) {
        return ResponseEntity.ok(jobService.searchJobs(search, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }
}
