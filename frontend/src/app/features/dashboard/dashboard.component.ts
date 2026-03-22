import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanService } from '../../core/services/plan.service';
import { TrainingPlan, Workout } from '../../core/models/plan.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      @if (!plan()) {
        <div class="empty-state">
          <p>No training plan yet. Set up your goal and generate your first plan.</p>
          <a routerLink="/onboarding" class="btn-primary">Get Started</a>
        </div>
      } @else {
        <div class="summary-card">
          <h2>{{ plan()!.name }}</h2>
          <p class="ai-summary">{{ plan()!.aiSummary }}</p>
          <div class="meta">
            <span>{{ plan()!.startDate }} → {{ plan()!.endDate }}</span>
          </div>
        </div>

        @if (nextWorkout()) {
          <div class="next-workout">
            <h3>Next Workout</h3>
            <div class="workout-card">
              <span class="badge">{{ nextWorkout()!.workoutType }}</span>
              <strong>{{ nextWorkout()!.title }}</strong>
              <p>{{ nextWorkout()!.description }}</p>
              <div class="workout-meta">
                @if (nextWorkout()!.distanceKm) { <span>{{ nextWorkout()!.distanceKm }} km</span> }
                @if (nextWorkout()!.durationMinutes) { <span>{{ nextWorkout()!.durationMinutes }} min</span> }
                <span class="intensity {{ nextWorkout()!.intensity?.toLowerCase() }}">{{ nextWorkout()!.intensity }}</span>
              </div>
            </div>
          </div>
        }

        <div class="actions">
          <a routerLink="/plan" class="btn-primary">View Full Plan</a>
          <a routerLink="/coach" class="btn-secondary">Ask AI Coach</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard { max-width: 800px; }
    h1 { margin: 0 0 24px; }
    .empty-state { text-align: center; padding: 60px; background: white; border-radius: 16px; }
    .empty-state p { color: #666; margin-bottom: 16px; }
    .summary-card { background: white; padding: 24px; border-radius: 16px; margin-bottom: 24px; }
    .ai-summary { color: #555; margin: 8px 0; line-height: 1.6; }
    .meta { color: #888; font-size: 0.875rem; }
    .next-workout h3 { margin: 0 0 12px; }
    .workout-card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
    .badge { background: #e0e7ff; color: #4f46e5; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .workout-card strong { display: block; margin: 8px 0 4px; font-size: 1.1rem; }
    .workout-card p { color: #666; margin: 0 0 12px; }
    .workout-meta { display: flex; gap: 12px; font-size: 0.875rem; color: #555; }
    .intensity { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
    .intensity.easy { background: #d1fae5; color: #065f46; }
    .intensity.moderate { background: #fef3c7; color: #92400e; }
    .intensity.hard { background: #fee2e2; color: #991b1b; }
    .actions { display: flex; gap: 12px; }
    .btn-primary { background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .btn-secondary { background: white; color: #4f46e5; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; border: 1px solid #4f46e5; }
  `]
})
export class DashboardComponent implements OnInit {
  plan = signal<TrainingPlan | null>(null);
  nextWorkout = signal<Workout | null>(null);

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.planService.getActivePlan().subscribe({
      next: plan => {
        this.plan.set(plan);
        const today = new Date().toISOString().split('T')[0];
        const upcoming = plan.weeks.flatMap(w => w.workouts)
          .filter(w => w.scheduledDate >= today && w.status === 'SCHEDULED')
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
        this.nextWorkout.set(upcoming[0] ?? null);
      },
      error: () => this.plan.set(null)
    });
  }
}
