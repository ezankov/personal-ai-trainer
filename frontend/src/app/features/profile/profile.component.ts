import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PlanService } from '../../core/services/plan.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <h1>Athlete Profile</h1>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="row">
            <div class="field">
              <label>Sport</label>
              <select formControlName="sportType">
                <option value="RUNNING">Running</option>
                <option value="CYCLING">Cycling</option>
                <option value="BOTH">Both</option>
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
          </div>
          <div class="row">
            <div class="field">
              <label>Weekly Volume (km)</label>
              <input type="number" formControlName="weeklyVolumeKm" />
            </div>
            <div class="field">
              <label>Max Training Days/Week</label>
              <input type="number" formControlName="maxTrainingDaysPerWeek" min="2" max="7" />
            </div>
          </div>
          <div class="field">
            <label>Available Days (e.g. MON,WED,FRI,SUN)</label>
            <input type="text" formControlName="availableDays" />
          </div>
          <div class="row">
            <div class="field">
              <label>Threshold Pace (sec/km)</label>
              <input type="number" formControlName="thresholdPaceSecPerKm" placeholder="e.g. 270" />
            </div>
            <div class="field">
              <label>FTP (watts, cycling)</label>
              <input type="number" formControlName="ftpWatts" placeholder="e.g. 250" />
            </div>
          </div>
          <div class="field">
            <label>Notes / Constraints</label>
            <textarea formControlName="notes" rows="3" placeholder="e.g. knee injury history, prefer morning runs"></textarea>
          </div>
          @if (saved()) { <p class="success">Profile saved!</p> }
          <button type="submit" [disabled]="loading()">
            {{ loading() ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 700px; }
    h1 { margin: 0 0 24px; }
    .card { background: white; padding: 32px; border-radius: 16px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    label { font-size: 0.875rem; font-weight: 500; color: #333; }
    input, select, textarea { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: inherit; }
    button { background: #4f46e5; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
    button:disabled { opacity: 0.6; }
    .success { color: #065f46; background: #d1fae5; padding: 8px 12px; border-radius: 8px; font-size: 0.875rem; }
  `]
})
export class ProfileComponent implements OnInit {
  form: ReturnType<FormBuilder['group']>;
  loading = signal(false);
  saved = signal(false);

  constructor(private fb: FormBuilder, private planService: PlanService) {
    this.form = this.fb.group({
      sportType: ['RUNNING'],
      experienceLevel: ['BEGINNER'],
      weeklyVolumeKm: [null],
      maxTrainingDaysPerWeek: [4],
      availableDays: [''],
      thresholdPaceSecPerKm: [null],
      ftpWatts: [null],
      notes: ['']
    });
  }

  ngOnInit() {
    this.planService.getProfile().subscribe({
      next: profile => this.form.patchValue(profile as any),
      error: () => {}
    });
  }

  save() {
    this.loading.set(true);
    this.saved.set(false);
    this.planService.updateProfile(this.form.value as any).subscribe({
      next: () => { this.saved.set(true); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
