package com.trainer.backend.plan;

import com.trainer.backend.common.ApiResponse;
import com.trainer.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class TrainingPlanController {

    private final TrainingPlanService planService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<TrainingPlan>> generate(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(planService.generate(user.getId())));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<TrainingPlan>> getActive(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(planService.getActive(user.getId())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrainingPlan>>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(planService.getAll(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainingPlan>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(planService.getById(id, user.getId())));
    }

    @PutMapping("/workouts/{workoutId}")
    public ResponseEntity<ApiResponse<Workout>> updateWorkout(
            @AuthenticationPrincipal User user,
            @PathVariable UUID workoutId,
            @RequestBody Workout updates) {
        return ResponseEntity.ok(ApiResponse.ok(planService.updateWorkout(workoutId, user.getId(), updates)));
    }
}
