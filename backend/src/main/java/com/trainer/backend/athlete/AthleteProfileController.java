package com.trainer.backend.athlete;

import com.trainer.backend.common.ApiResponse;
import com.trainer.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class AthleteProfileController {

    private final AthleteProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<AthleteProfile>> get(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getOrCreate(user.getId())));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AthleteProfile>> update(
            @AuthenticationPrincipal User user,
            @RequestBody AthleteProfile updates) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.update(user.getId(), updates)));
    }
}
