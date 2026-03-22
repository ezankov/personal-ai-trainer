package com.trainer.backend.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, UUID> {
    List<TrainingPlan> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT p FROM TrainingPlan p WHERE p.user.id = :userId AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Optional<TrainingPlan> findActiveByUserId(UUID userId);
}
