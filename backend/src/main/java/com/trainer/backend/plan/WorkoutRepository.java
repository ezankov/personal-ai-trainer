package com.trainer.backend.plan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface WorkoutRepository extends JpaRepository<Workout, UUID> {
    List<Workout> findByPlanIdAndScheduledDateBetweenOrderByScheduledDate(
            UUID planId, LocalDate from, LocalDate to);
}
