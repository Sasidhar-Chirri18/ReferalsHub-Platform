package com.referalshub.platform.service;

import com.referalshub.platform.dto.JobDto;
import com.referalshub.platform.entity.Job;
import com.referalshub.platform.entity.Role;
import com.referalshub.platform.entity.User;
import com.referalshub.platform.entity.UserProfile;
import com.referalshub.platform.exception.ResourceNotFoundException;
import com.referalshub.platform.exception.UnauthorizedException;
import com.referalshub.platform.repository.JobRepository;
import com.referalshub.platform.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public JobDto createJob(User user, JobDto dto) {
        if (user.getRole() == Role.USER) {
            throw new UnauthorizedException("Only referrers and admins can post jobs");
        }

        Job job = Job.builder()
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .experienceRequired(dto.getExperienceRequired())
                .description(dto.getDescription())
                .applyLink(dto.getApplyLink())
                .createdBy(user)
                .build();

        job = jobRepository.save(job);
        return mapToDto(job);
    }

    @Transactional
    public JobDto updateJob(User user, Long jobId, JobDto dto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (user.getRole() != Role.ADMIN && (job.getCreatedBy() == null || !job.getCreatedBy().getId().equals(user.getId()))) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }

        job.setTitle(dto.getTitle());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setDescription(dto.getDescription());
        job.setApplyLink(dto.getApplyLink());

        job = jobRepository.save(job);
        return mapToDto(job);
    }

    @Transactional
    public void deleteJob(User user, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (user.getRole() != Role.ADMIN && (job.getCreatedBy() == null || !job.getCreatedBy().getId().equals(user.getId()))) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<JobDto> searchJobs(String search, String location) {
        return jobRepository.searchJobs(search, location).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return mapToDto(job);
    }

    public Job getJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }

    private JobDto mapToDto(Job job) {
        String createdByName = "Admin";
        if (job.getCreatedBy() != null) {
            createdByName = userProfileRepository.findByUserId(job.getCreatedBy().getId())
                    .map(UserProfile::getName)
                    .orElse(job.getCreatedBy().getEmail());
        }

        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .experienceRequired(job.getExperienceRequired())
                .description(job.getDescription())
                .applyLink(job.getApplyLink())
                .createdById(job.getCreatedBy() != null ? job.getCreatedBy().getId() : null)
                .createdByName(createdByName)
                .createdAt(job.getCreatedAt())
                .build();
    }
}
