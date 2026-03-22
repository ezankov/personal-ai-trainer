package com.trainer.backend.goal;

import com.trainer.backend.user.User;
import com.trainer.backend.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RaceGoalService {

    private final RaceGoalRepository goalRepository;
    private final UserRepository userRepository;

    public List<RaceGoal> getAll(UUID userId) {
        return goalRepository.findByUserIdOrderByRaceDateDesc(userId);
    }

    @Transactional
    public RaceGoal create(UUID userId, RaceGoal goal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        // deactivate previous active goal
        goalRepository.findByUserIdAndActiveTrue(userId).ifPresent(g -> {
            g.setActive(false);
            goalRepository.save(g);
        });
        goal.setUser(user);
        goal.setActive(true);
        return goalRepository.save(goal);
    }

    public RaceGoal getActive(UUID userId) {
        return goalRepository.findByUserIdAndActiveTrue(userId)
                .orElseThrow(() -> new EntityNotFoundException("No active goal found"));
    }
}
