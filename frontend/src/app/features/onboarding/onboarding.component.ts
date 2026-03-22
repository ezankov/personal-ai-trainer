import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService } from '../../core/services/plan.service';

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule],
  template: `
    <div class="onboarding">
      <div class="card">
        <div class="steps">
          <span [class.active]="step() === 1">1. Profile</span>
          <span [class.active]="step() === 2">2. Goal</span>
          <span [class.active]="step() === 3">3. Generate</span>
        </div>

        @if (step() === 1) {
          <h2>Your Athlete Profile</h2>
          <form [formGroup]="profileForm" (ngSubmit)="nextStep()">
            <div class="field">
              <label>Sport</label>
              <select formControlName="sportType">
                <option value="RUNNING">Running</option>
                <option value="CYCLING">Cycling</option>
              </select>
            </div>
            <div class="field">
              <label>Experience Level</label>
              <select formControlName="experienceLevel">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div class="field">
              <label>Current weekly volume (km)</label>
              <input type="number" formControlName="weeklyVolumeKm" placeholder="e.g. 30" />
            </div>
            <div class="field">
              <label>Max training days per week</label>
              <input type="number" formControlName="maxTrainingDaysPerWeek" min="2" max="7" />
            </div>
            <div class="field">
              <label>Available days (e.g. MON,WED,FRI,SUN)</label>
              <input type="text" formControlName="availableDays" placeholder="MON,WED,FRI,SUN" />
            </div>
            <button type="submit">Next →</button>
          </form>
        }

        @if (step() === 2) {
          <h2>Your Race Goal</h2>
          <form [formGroup]="goalForm" (ngSubmit)="nextStep()">
            <div class="field">
              <label>Race Type</label>
              <select formControlName="raceType">
                <option value="RACE_5K">5K</option>
                <option value="RACE_10K">10K</option>
                <option value="HALF_MARATHON">Half Marathon</option>
                <option value="MARATHON">Marathon</option>
              </select>
            </div>
            <div class="field">
              <label>Race Date</label>
              <input type="date" formControlName="raceDate" />
            </div>
            <div class="field">
              <label>Race Name (optional)</label>
              <input type="text" formControlName="raceName" placeholder="e.g. Vienna City Marathon" />
            </div>
            <button type="submit">Next →</button>
          </form>
        }

        @if (step() === 3) {
          <h2>Ready to generate your plan!</h2>
          <p>We'll create a personalized training plan based on your profile and goal.</p>
          @if (error()) { <p class="error">{{ error() }}</p> }
          <button (click)="generate()" [disabled]="loading()">
            {{ loading() ? 'Generating...' : '🚀 Generate My Plan' }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .onboarding { max-width: 500px; margin: 0 auto; }
    .card { background: white; padding: 40px; border-radius: 16px; }
    .steps { display: flex; gap: 16px; margin-bottom: 32px; font-size: 0.875rem; color: #999; }
    .steps .active { color: #4f46e5; font-weight: 600; }
    h2 { margin: 0 0 24px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    label { font-size: 0.875rem; font-weight: 500; }
    input, select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
    button { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 8px; }
    button:disabled { opacity: 0.6; }
    .error { color: #e53e3e; font-size: 0.875rem; }
    p { color: #666; margin-bottom: 16px; }
  `]
})
export class OnboardingComponent {
  step = signal(1);
  loading = signal(false);
  error = signal('');

  profileForm = this.fb.group({
    sportType: ['RUNNING'],
    experienceLevel: ['BEGINNER'],
    weeklyVolumeKm: [20],
    maxTrainingDaysPerWeek: [4],
    availableDays: ['MON,WED,FRI,SUN']
  });

  goalForm = this.fb.group({
    raceType: ['HALF_MARATHON'],
    raceDate: ['', Validators.required],
    raceName: ['']
  });

  constructor(private fb: FormBuilder, private planService: PlanService, private router: Router) {}

  nextStep() {
    if (this.step() === 1) {
      this.planService.updateProfile(this.profileForm.value as any).subscribe({
        next: () => this.step.set(2),
        error: () => this.step.set(2) // continue even if profile update fails
      });
    } else if (this.step() === 2) {
      this.planService.createGoal(this.goalForm.value as any).subscribe({
        next: () => this.step.set(3),
        error: (e) => this.error.set(e.error?.message || 'Failed to save goal')
      });
    }
  }

  generate() {
    this.loading.set(true);
    this.planService.generatePlan().subscribe({
      next: () => this.router.navigate(['/plan']),
      error: (e) => { this.error.set(e.error?.message || 'Failed to generate plan'); this.loading.set(false); }
    });
  }
}
