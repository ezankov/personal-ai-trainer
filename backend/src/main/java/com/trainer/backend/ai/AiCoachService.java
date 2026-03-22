package com.trainer.backend.ai;

import com.trainer.backend.athlete.AthleteProfile;
import com.trainer.backend.goal.RaceGoal;
import com.trainer.backend.plan.TrainingPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiCoachService {

    private final ChatClient chatClient;

    private static final String SYSTEM_PROMPT = """
            You are a professional running and cycling coach AI assistant.
            You create safe, science-based training plans and provide personalized coaching advice.
            Always prioritize athlete safety and progressive overload principles.
            Be concise, supportive, and practical in your responses.
            """;

    public String generatePlanSummary(AthleteProfile profile, RaceGoal goal, TrainingPlan plan) {
        String prompt = """
                Generate a brief motivational summary (2-3 sentences) for this training plan:
                - Athlete: %s experience, currently running %.1f km/week
                - Goal: %s on %s
                - Plan: %d weeks, starting %s
                Focus on what the athlete will achieve and the key training phases.
                """.formatted(
                profile.getExperienceLevel(),
                profile.getWeeklyVolumeKm() != null ? profile.getWeeklyVolumeKm() : 0,
                goal.getRaceType(),
                goal.getRaceDate(),
                plan.getWeeks().size(),
                plan.getStartDate()
        );
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(prompt)
                .call()
                .content();
    }

    public String explainWorkout(String workoutTitle, String workoutType, String description, String goalContext) {
        String prompt = """
                Explain this workout in 2-3 sentences for an athlete:
                Workout: %s (%s)
                Description: %s
                Goal context: %s
                Focus on WHY this workout is in the plan and what benefit it provides.
                """.formatted(workoutTitle, workoutType, description, goalContext);
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(prompt)
                .call()
                .content();
    }

    public String chat(String userMessage, String conversationHistory) {
        String contextualPrompt = conversationHistory.isBlank()
                ? userMessage
                : "Previous conversation:\n" + conversationHistory + "\n\nUser: " + userMessage;
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(contextualPrompt)
                .call()
                .content();
    }
}
