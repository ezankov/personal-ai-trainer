package com.trainer.backend.athlete;

import com.trainer.backend.user.User;
import com.trainer.backend.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AthleteProfileService {

    private final AthleteProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public AthleteProfile getOrCreate(UUID userId) {
        return profileRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            AthleteProfile profile = AthleteProfile.builder().user(user).build();
            return profileRepository.save(profile);
        });
    }

    @Transactional
    public AthleteProfile update(UUID userId, AthleteProfile updates) {
        AthleteProfile profile = getOrCreate(userId);
        if (updates.getSportType() != null) profile.setSportType(updates.getSportType());
        if (updates.getExperienceLevel() != null) profile.setExperienceLevel(updates.getExperienceLevel());
        if (updates.getWeeklyVolumeKm() != null) profile.setWeeklyVolumeKm(updates.getWeeklyVolumeKm());
        if (updates.getMaxTrainingDaysPerWeek() != null) profile.setMaxTrainingDaysPerWeek(updates.getMaxTrainingDaysPerWeek());
        if (updates.getPreferredLongRunDay() != null) profile.setPreferredLongRunDay(updates.getPreferredLongRunDay());
        if (updates.getAvailableDays() != null) profile.setAvailableDays(updates.getAvailableDays());
        if (updates.getThresholdPaceSecPerKm() != null) profile.setThresholdPaceSecPerKm(updates.getThresholdPaceSecPerKm());
        if (updates.getFtpWatts() != null) profile.setFtpWatts(updates.getFtpWatts());
        if (updates.getNotes() != null) profile.setNotes(updates.getNotes());
        return profileRepository.save(profile);
    }
}
