import { Component, OnInit, signal } from '@angular/core';
import { PlanService } from '../../core/services/plan.service';
import { TrainingPlan, TrainingWeek, Workout } from '../../core/models/plan.model';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-plan',
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="plan-page">
      <div class="header">
        <h1>Training Plan</h1>
        <button class="btn-primary" (click)="regenerate()" [disabled]="loading()">
          {{ loading() ? 'Generating...' : '↺ Regenerate' }}
        </button>
      </div>

      @if (!plan()) {
        <div class="empty">
          <p>No plan yet. <a routerLink="/onboarding">Set up your goal first.</a></p>
        </div>
      } @else {
        @if (plan()!.aiSummary) {
          <div class="ai-summary">💡 {{ plan()!.aiSummary }}</div>
        }

        <div class="weeks">
          @for (week of plan()!.weeks; track week.id) {
            <div class="week" [class.recovery]="week.recoveryWeek">
              <div class="week-header">
                <strong>Week {{ week.weekNumber }}</strong>
                <span class="focus">{{ week.focus }}</span>
                @if (week.recoveryWeek) { <span class="badge recovery-badge">Recovery</span> }
                @if (week.totalVolumeKm) { <span class="volume">{{ week.totalVolumeKm | number:'1.0-1' }} km</span> }
              </div>
              <div class="workouts">
                @for (workout of week.workouts; track workout.id) {
                  <div class="workout-item" [class]="'status-' + workout.status.toLowerCase()">
                    <div class="workout-date">{{ workout.scheduledDate | date:'EEE d' }}</div>
                    <div class="workout-info">
                      <span class="type-badge">{{ formatType(workout.workoutType) }}</span>
                      <strong>{{ workout.title }}</strong>
                      <div class="workout-meta">
                        @if (workout.distanceKm) { <span>{{ workout.distanceKm }} km</span> }
                        @if (workout.durationMinutes) { <span>{{ workout.durationMinutes }} min</span> }
                        <span class="intensity-dot {{ workout.intensity?.toLowerCase() }}">{{ workout.intensity }}</span>
                      </div>
                    </div>
                    <div class="workout-actions">
                      <button class="status-btn" (click)="markComplete(workout)" [disabled]="workout.status === 'COMPLETED'">
                        {{ workout.status === 'COMPLETED' ? '✓' : 'Done' }}
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .plan-page { max-width: 900px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { margin: 0; }
    .btn-primary { background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .btn-primary:disabled { opacity: 0.6; }
    .ai-summary { background: #eef2ff; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 8px; margin-bottom: 24px; color: #3730a3; }
    .empty { text-align: center; padding: 60px; background: white; border-radius: 16px; }
    .weeks { display: flex; flex-direction: column; gap: 16px; }
    .week { background: white; border-radius: 12px; overflow: hidden; }
    .week.recovery { border-left: 4px solid #10b981; }
    .week-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
    .focus { color: #666; font-size: 0.875rem; flex: 1; }
    .badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .recovery-badge { background: #d1fae5; color: #065f46; }
    .volume { color: #888; font-size: 0.875rem; }
    .workouts { padding: 8px 0; }
    .workout-item { display: flex; align-items: center; gap: 16px; padding: 12px 20px; border-bottom: 1px solid #fafafa; }
    .workout-item.status-completed { opacity: 0.6; }
    .workout-date { width: 60px; font-size: 0.8rem; color: #888; font-weight: 500; }
    .workout-info { flex: 1; }
    .type-badge { background: #e0e7ff; color: #4f46e5; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-right: 8px; }
    .workout-info strong { font-size: 0.95rem; }
    .workout-meta { display: flex; gap: 10px; margin-top: 4px; font-size: 0.8rem; color: #666; }
    .intensity-dot { padding: 1px 6px; border-radius: 10px; font-size: 0.7rem; }
    .intensity-dot.easy { background: #d1fae5; color: #065f46; }
    .intensity-dot.moderate { background: #fef3c7; color: #92400e; }
    .intensity-dot.hard { background: #fee2e2; color: #991b1b; }
    .status-btn { background: #f3f4f6; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
    .status-btn:disabled { background: #d1fae5; color: #065f46; }
  `]
})
export class PlanComponent implements OnInit {
  plan = signal<TrainingPlan | null>(null);
  loading = signal(false);

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.planService.getActivePlan().subscribe({
      next: plan => this.plan.set(plan),
      error: () => this.plan.set(null)
    });
  }

  regenerate() {
    this.loading.set(true);
    this.planService.generatePlan().subscribe({
      next: plan => { this.plan.set(plan); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  markComplete(workout: Workout) {
    this.planService.updateWorkout(workout.id, { status: 'COMPLETED' }).subscribe({
      next: updated => {
        const plan = this.plan()!;
        plan.weeks.forEach(w => {
          const idx = w.workouts.findIndex(wo => wo.id === updated.id);
          if (idx >= 0) w.workouts[idx] = updated;
        });
        this.plan.set({ ...plan });
      }
    });
  }

  formatType(type: string): string {
    return type.replace(/_/g, ' ');
  }
}
