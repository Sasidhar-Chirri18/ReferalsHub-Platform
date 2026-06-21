package com.referalshub.platform.repository;

import com.referalshub.platform.entity.ReferralRequest;
import com.referalshub.platform.entity.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralRequestRepository extends JpaRepository<ReferralRequest, Long> {
    List<ReferralRequest> findByRequesterId(Long requesterId);
    List<ReferralRequest> findByJobCreatedById(Long referrerId);
    
    long countByRequesterId(Long requesterId);
    long countByRequesterIdAndStatus(Long requesterId, ReferralStatus status);
    
    long countByJobCreatedById(Long referrerId);
    long countByJobCreatedByIdAndStatus(Long referrerId, ReferralStatus status);
}
