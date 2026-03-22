package com.trainer.backend.plan;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_id", nullable = false)
    private TrainingWeek week;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private TrainingPlan plan;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutType workoutType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer durationMinutes;
    private Double distanceKm;

    @Enumerated(EnumType.STRING)
    private Intensity intensity;

    @Column(columnDefinition = "TEXT")
    private String aiExplanation;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutStatus status = WorkoutStatus.SCHEDULED;

    private String garminWorkoutId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum WorkoutType {
        EASY_RUN, LONG_RUN, TEMPO_RUN, INTERVAL, RECOVERY_RUN,
        EASY_RIDE, LONG_RIDE, THRESHOLD_RIDE, INTERVAL_RIDE,
        CROSS_TRAINING, REST
    }

    public enum Intensity { EASY, MODERATE, HARD, VERY_HARD }
    public enum WorkoutStatus { SCHEDULED, COMPLETED, SKIPPED, MODIFIED }
}
