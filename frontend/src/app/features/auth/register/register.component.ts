import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>🏃 AI Trainer</h1>
        <h2>Create your account</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label>Name</label>
            <input type="text" formControlName="name" placeholder="Your name" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Min 8 characters" />
          </div>
          @if (error) { <p class="error">{{ error }}</p> }
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>
        <p class="link">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f4f8; }
    .auth-card { background: white; padding: 40px; border-radius: 16px; width: 360px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 1.5rem; margin: 0 0 4px; }
    h2 { color: #555; font-weight: 400; margin: 0 0 24px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    label { font-size: 0.875rem; font-weight: 500; color: #333; }
    input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
    button { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 8px; }
    button:disabled { opacity: 0.6; }
    .error { color: #e53e3e; font-size: 0.875rem; }
    .link { text-align: center; margin-top: 16px; font-size: 0.875rem; color: #666; }
    .link a { color: #4f46e5; }
  `]
})
export class RegisterComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/onboarding']),
      error: (e) => { this.error = e.error?.message || 'Registration failed'; this.loading = false; }
    });
  }
}
