package com.referalshub.platform.repository;

import com.referalshub.platform.entity.ReferrerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReferrerProfileRepository extends JpaRepository<ReferrerProfile, Long> {
    Optional<ReferrerProfile> findByUserId(Long userId);
}
