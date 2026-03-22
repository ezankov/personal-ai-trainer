package com.trainer.backend.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CoachMessageRepository extends JpaRepository<CoachMessage, UUID> {
    List<CoachMessage> findTop20ByUserIdOrderByCreatedAtAsc(UUID userId);
}
