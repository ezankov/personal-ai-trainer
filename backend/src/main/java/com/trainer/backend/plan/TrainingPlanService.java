package com.trainer.backend.plan;

import com.trainer.backend.ai.AiCoachService;
import com.trainer.backend.athlete.AthleteProfile;
import com.trainer.backend.athlete.AthleteProfileService;
import com.trainer.backend.goal.RaceGoal;
import com.trainer.backend.goal.RaceGoalService;
import com.trainer.backend.plan.engine.TrainingPlanGenerator;
import com.trainer.backend.user.User;
import com.trainer.backend.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrainingPlanService {

    private final TrainingPlanRepository planRepository;
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final AthleteProfileService profileService;
    private final RaceGoalService goalService;
    private final TrainingPlanGenerator planGenerator;
    private final AiCoachService aiCoachService;

    @Transactional
    public TrainingPlan generate(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        AthleteProfile profile = profileService.getOrCreate(userId);
        RaceGoal goal = goalService.getActive(userId);

        // archive existing active plan
        planRepository.findActiveByUserId(userId).ifPresent(p -> {
            p.setStatus(TrainingPlan.PlanStatus.ARCHIVED);
            planRepository.save(p);
        });

        TrainingPlan plan = TrainingPlan.builder()
                .user(user)
                .goal(goal)
                .name("Training Plan for " + goal.getRaceType())
                .status(TrainingPlan.PlanStatus.ACTIVE)
                .startDate(LocalDate.now())
                .endDate(goal.getRaceDate())
                .build();

        plan = planGenerator.generate(profile, goal, plan);
        plan = planRepository.save(plan);

        // generate AI summary asynchronously-ish (sync for POC)
        try {
            String summary = aiCoachService.generatePlanSummary(profile, goal, plan);
            plan.setAiSummary(summary);
            plan = planRepository.save(plan);
        } catch (Exception e) {
            // AI summary is non-critical
        }

        return plan;
    }

    public TrainingPlan getActive(UUID userId) {
        return planRepository.findActiveByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("No active training plan found"));
    }

    public List<TrainingPlan> getAll(UUID userId) {
        return planRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public TrainingPlan getById(UUID planId, UUID userId) {
        TrainingPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        if (!plan.getUser().getId().equals(userId)) throw new EntityNotFoundException("Plan not found");
        return plan;
    }

    @Transactional
    public Workout updateWorkout(UUID workoutId, UUID userId, Workout updates) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found"));
        if (!workout.getPlan().getUser().getId().equals(userId))
            throw new EntityNotFoundException("Workout not found");

        if (updates.getTitle() != null) workout.setTitle(updates.getTitle());
        if (updates.getDescription() != null) workout.setDescription(updates.getDescription());
        if (updates.getDurationMinutes() != null) workout.setDurationMinutes(updates.getDurationMinutes());
        if (updates.getDistanceKm() != null) workout.setDistanceKm(updates.getDistanceKm());
        if (updates.getScheduledDate() != null) workout.setScheduledDate(updates.getScheduledDate());
        if (updates.getStatus() != null) workout.setStatus(updates.getStatus());

        return workoutRepository.save(workout);
    }
}
