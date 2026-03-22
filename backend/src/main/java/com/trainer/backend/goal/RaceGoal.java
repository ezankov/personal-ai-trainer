package com.trainer.backend.goal;

import com.trainer.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "race_goals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RaceGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RaceType raceType;

    @Column(nullable = false)
    private LocalDate raceDate;

    private Integer targetTimeSeconds;
    private String raceName;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum RaceType {
        RACE_5K, RACE_10K, HALF_MARATHON, MARATHON,
        GRAN_FONDO, TIME_TRIAL, CUSTOM
    }
}
