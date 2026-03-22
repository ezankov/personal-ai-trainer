package com.trainer.backend.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RaceGoalRepository extends JpaRepository<RaceGoal, UUID> {
    List<RaceGoal> findByUserIdOrderByRaceDateDesc(UUID userId);
    Optional<RaceGoal> findByUserIdAndActiveTrue(UUID userId);
}
