import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>🏃 AI Trainer</h1>
        <h2>Welcome back</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••••" />
          </div>
          @if (error) { <p class="error">{{ error }}</p> }
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        <p class="link">No account? <a routerLink="/auth/register">Register</a></p>
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
export class LoginComponent {
  form: ReturnType<FormBuilder['group']>;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid credentials'; this.loading = false; }
    });
  }
}
