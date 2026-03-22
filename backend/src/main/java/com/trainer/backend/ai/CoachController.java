package com.trainer.backend.ai;

import com.trainer.backend.common.ApiResponse;
import com.trainer.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coach")
@RequiredArgsConstructor
public class CoachController {

    private final AiCoachService aiCoachService;
    private final CoachMessageRepository messageRepository;

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<CoachMessage>>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                messageRepository.findTop20ByUserIdOrderByCreatedAtAsc(user.getId())));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<CoachMessage>> chat(
            @AuthenticationPrincipal User user,
            @RequestBody ChatRequest request) {

        // save user message
        CoachMessage userMsg = messageRepository.save(CoachMessage.builder()
                .user(user).role("user").content(request.message()).build());

        // build conversation history
        List<CoachMessage> history = messageRepository.findTop20ByUserIdOrderByCreatedAtAsc(user.getId());
        String historyText = history.stream()
                .map(m -> m.getRole() + ": " + m.getContent())
                .collect(Collectors.joining("\n"));

        // get AI response
        String reply = aiCoachService.chat(request.message(), historyText);

        CoachMessage assistantMsg = messageRepository.save(CoachMessage.builder()
                .user(user).role("assistant").content(reply).build());

        return ResponseEntity.ok(ApiResponse.ok(assistantMsg));
    }

    public record ChatRequest(String message) {}
}
