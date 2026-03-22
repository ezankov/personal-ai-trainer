package com.trainer.backend.athlete;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.trainer.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "athlete_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AthleteProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SportType sportType = SportType.RUNNING;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceLevel experienceLevel = ExperienceLevel.BEGINNER;

    private Double weeklyVolumeKm;
    @Builder.Default
    private Integer maxTrainingDaysPerWeek = 4;
    private String preferredLongRunDay;
    private String availableDays; // comma-separated: MON,WED,FRI,SUN
    private Integer thresholdPaceSecPerKm;
    private Integer ftpWatts;
    private String notes;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum SportType { RUNNING, CYCLING, BOTH }
    public enum ExperienceLevel { BEGINNER, INTERMEDIATE, ADVANCED }
}
