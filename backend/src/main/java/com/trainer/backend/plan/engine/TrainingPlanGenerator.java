package com.trainer.backend.plan.engine;

import com.trainer.backend.athlete.AthleteProfile;
import com.trainer.backend.goal.RaceGoal;
import com.trainer.backend.plan.TrainingPlan;
import com.trainer.backend.plan.TrainingWeek;
import com.trainer.backend.plan.Workout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class TrainingPlanGenerator {

    public TrainingPlan generate(AthleteProfile profile, RaceGoal goal, TrainingPlan plan) {
        LocalDate start = plan.getStartDate();
        LocalDate raceDate = goal.getRaceDate();
        long totalWeeks = ChronoUnit.WEEKS.between(start, raceDate);
        if (totalWeeks < 4) throw new IllegalArgumentException("Need at least 4 weeks before race date");

        Set<String> availableDays = parseAvailableDays(profile.getAvailableDays());
        int maxDays = profile.getMaxTrainingDaysPerWeek() != null ? profile.getMaxTrainingDaysPerWeek() : 4;

        List<TrainingWeek> weeks = new ArrayList<>();
        for (int w = 0; w < totalWeeks; w++) {
            LocalDate weekStart = start.plusWeeks(w);
            LocalDate weekEnd = weekStart.plusDays(6);
            boolean isRecovery = (w + 1) % 4 == 0;
            boolean isTaper = w >= totalWeeks - 2;

            TrainingWeek week = TrainingWeek.builder()
                    .plan(plan)
                    .weekNumber(w + 1)
                    .startDate(weekStart)
                    .endDate(weekEnd)
                    .recoveryWeek(isRecovery)
                    .focus(determineFocus(w, totalWeeks, isRecovery, isTaper))
                    .build();

            List<Workout> workouts = buildWorkouts(week, plan, profile, goal, w, totalWeeks, isRecovery, isTaper, availableDays, maxDays);
            week.setWorkouts(workouts);
            double volume = workouts.stream()
                    .filter(wo -> wo.getDistanceKm() != null)
                    .mapToDouble(Workout::getDistanceKm).sum();
            week.setTotalVolumeKm(volume);
            weeks.add(week);
        }
        plan.setWeeks(weeks);
        return plan;
    }

    private List<Workout> buildWorkouts(TrainingWeek week, TrainingPlan plan, AthleteProfile profile,
                                         RaceGoal goal, int weekIndex, long totalWeeks,
                                         boolean isRecovery, boolean isTaper,
                                         Set<String> availableDays, int maxDays) {
        double baseVolume = profile.getWeeklyVolumeKm() != null ? profile.getWeeklyVolumeKm() : 20.0;
        double progressionFactor = isRecovery ? 0.7 : isTaper ? 0.6 : 1.0 + (weekIndex * 0.05);
        double weekVolume = Math.min(baseVolume * progressionFactor, baseVolume * 1.5);

        List<WorkoutTemplate> templates = WorkoutTemplateLibrary.getTemplates(
                goal.getRaceType(), isRecovery, isTaper, maxDays);

        List<Workout> workouts = new ArrayList<>();
        LocalDate day = week.getStartDate();
        int assigned = 0;

        for (int d = 0; d < 7 && assigned < templates.size(); d++) {
            String dayName = day.getDayOfWeek().name().substring(0, 3);
            if (availableDays.isEmpty() || availableDays.contains(dayName)) {
                WorkoutTemplate template = templates.get(assigned);
                double distance = (weekVolume / templates.size()) * template.volumeRatio();
                workouts.add(Workout.builder()
                        .week(week)
                        .plan(plan)
                        .scheduledDate(day)
                        .workoutType(template.type())
                        .title(template.title())
                        .description(template.description())
                        .durationMinutes(template.durationMinutes())
                        .distanceKm(Math.round(distance * 10.0) / 10.0)
                        .intensity(template.intensity())
                        .build());
                assigned++;
            }
            day = day.plusDays(1);
        }
        return workouts;
    }

    private String determineFocus(int weekIndex, long totalWeeks, boolean isRecovery, boolean isTaper) {
        if (isTaper) return "Taper & Race Preparation";
        if (isRecovery) return "Recovery & Adaptation";
        double progress = (double) weekIndex / totalWeeks;
        if (progress < 0.3) return "Base Building";
        if (progress < 0.6) return "Aerobic Development";
        return "Race-Specific Sharpening";
    }

    private Set<String> parseAvailableDays(String availableDays) {
        if (availableDays == null || availableDays.isBlank()) return Set.of();
        return Set.of(availableDays.toUpperCase().split(","));
    }
}
