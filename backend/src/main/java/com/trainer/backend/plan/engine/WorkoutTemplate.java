package com.trainer.backend.plan.engine;

import com.trainer.backend.plan.Workout;

public record WorkoutTemplate(
        Workout.WorkoutType type,
        String title,
        String description,
        Integer durationMinutes,
        Workout.Intensity intensity,
        double volumeRatio
) {}
