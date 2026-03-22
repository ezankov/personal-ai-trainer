package com.trainer.backend.goal;

import com.trainer.backend.common.ApiResponse;
import com.trainer.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class RaceGoalController {

    private final RaceGoalService goalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RaceGoal>>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(goalService.getAll(user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RaceGoal>> create(
            @AuthenticationPrincipal User user,
            @RequestBody RaceGoal goal) {
        return ResponseEntity.ok(ApiResponse.ok(goalService.create(user.getId(), goal)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<RaceGoal>> getActive(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(goalService.getActive(user.getId())));
    }
}
