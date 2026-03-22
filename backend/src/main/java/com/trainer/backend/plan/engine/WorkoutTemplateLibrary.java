package com.trainer.backend.plan.engine;

import com.trainer.backend.goal.RaceGoal;
import com.trainer.backend.plan.Workout;

import java.util.List;

public class WorkoutTemplateLibrary {

    public static List<WorkoutTemplate> getTemplates(RaceGoal.RaceType raceType, boolean recovery, boolean taper, int maxDays) {
        if (recovery) return recoveryWeekTemplates(maxDays);
        if (taper) return taperWeekTemplates(maxDays);
        return switch (raceType) {
            case RACE_5K, RACE_10K -> shortRaceTemplates(maxDays);
            case HALF_MARATHON -> halfMarathonTemplates(maxDays);
            case MARATHON -> marathonTemplates(maxDays);
            default -> shortRaceTemplates(maxDays);
        };
    }

    private static List<WorkoutTemplate> shortRaceTemplates(int maxDays) {
        List<WorkoutTemplate> all = List.of(
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Easy Run", "Comfortable conversational pace. Focus on form.", 40, Workout.Intensity.EASY, 0.25),
                new WorkoutTemplate(Workout.WorkoutType.INTERVAL, "Speed Intervals", "6x800m at 5K pace with 90s recovery jog.", 50, Workout.Intensity.HARD, 0.20),
                new WorkoutTemplate(Workout.WorkoutType.TEMPO_RUN, "Tempo Run", "20 min at comfortably hard pace (threshold).", 45, Workout.Intensity.MODERATE, 0.25),
                new WorkoutTemplate(Workout.WorkoutType.LONG_RUN, "Long Run", "Easy long run to build aerobic base.", 75, Workout.Intensity.EASY, 0.30)
        );
        return all.subList(0, Math.min(maxDays, all.size()));
    }

    private static List<WorkoutTemplate> halfMarathonTemplates(int maxDays) {
        List<WorkoutTemplate> all = List.of(
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Easy Run", "Easy aerobic run at conversational pace.", 45, Workout.Intensity.EASY, 0.20),
                new WorkoutTemplate(Workout.WorkoutType.TEMPO_RUN, "Tempo Run", "30 min at half marathon goal pace.", 55, Workout.Intensity.MODERATE, 0.20),
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Recovery Run", "Very easy short run to flush legs.", 30, Workout.Intensity.EASY, 0.10),
                new WorkoutTemplate(Workout.WorkoutType.INTERVAL, "Cruise Intervals", "3x2km at 10K pace with 2 min recovery.", 55, Workout.Intensity.HARD, 0.20),
                new WorkoutTemplate(Workout.WorkoutType.LONG_RUN, "Long Run", "Progressive long run, last 20% at goal pace.", 100, Workout.Intensity.MODERATE, 0.30)
        );
        return all.subList(0, Math.min(maxDays, all.size()));
    }

    private static List<WorkoutTemplate> marathonTemplates(int maxDays) {
        List<WorkoutTemplate> all = List.of(
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Easy Run", "Easy aerobic run.", 50, Workout.Intensity.EASY, 0.15),
                new WorkoutTemplate(Workout.WorkoutType.TEMPO_RUN, "Marathon Pace Run", "Run at goal marathon pace.", 60, Workout.Intensity.MODERATE, 0.20),
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Recovery Run", "Very easy short run.", 35, Workout.Intensity.EASY, 0.10),
                new WorkoutTemplate(Workout.WorkoutType.INTERVAL, "Lactate Intervals", "5x1km at 10K pace.", 55, Workout.Intensity.HARD, 0.15),
                new WorkoutTemplate(Workout.WorkoutType.LONG_RUN, "Long Run", "Aerobic long run, key session of the week.", 120, Workout.Intensity.EASY, 0.40)
        );
        return all.subList(0, Math.min(maxDays, all.size()));
    }

    private static List<WorkoutTemplate> recoveryWeekTemplates(int maxDays) {
        List<WorkoutTemplate> all = List.of(
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Easy Run", "Very easy recovery run.", 30, Workout.Intensity.EASY, 0.35),
                new WorkoutTemplate(Workout.WorkoutType.RECOVERY_RUN, "Recovery Jog", "Short easy jog to stay active.", 25, Workout.Intensity.EASY, 0.30),
                new WorkoutTemplate(Workout.WorkoutType.LONG_RUN, "Shorter Long Run", "Reduced long run for recovery week.", 60, Workout.Intensity.EASY, 0.35)
        );
        return all.subList(0, Math.min(maxDays, all.size()));
    }

    private static List<WorkoutTemplate> taperWeekTemplates(int maxDays) {
        List<WorkoutTemplate> all = List.of(
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Easy Run", "Easy shakeout run, keep legs fresh.", 30, Workout.Intensity.EASY, 0.35),
                new WorkoutTemplate(Workout.WorkoutType.TEMPO_RUN, "Short Tempo", "10 min at race pace to stay sharp.", 35, Workout.Intensity.MODERATE, 0.30),
                new WorkoutTemplate(Workout.WorkoutType.EASY_RUN, "Pre-Race Shakeout", "Very easy 20 min jog the day before.", 20, Workout.Intensity.EASY, 0.35)
        );
        return all.subList(0, Math.min(maxDays, all.size()));
    }
}
