package com.trainer.backend.athlete;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AthleteProfileRepository extends JpaRepository<AthleteProfile, UUID> {
    Optional<AthleteProfile> findByUserId(UUID userId);
}
