import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <nav class="sidebar">
        <div class="logo">🏃 AI Trainer</div>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/plan" routerLinkActive="active">Training Plan</a>
        <a routerLink="/coach" routerLinkActive="active">AI Coach</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </nav>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; }
    .sidebar { width: 220px; background: #1a1a2e; color: white; display: flex; flex-direction: column; padding: 24px 16px; gap: 8px; }
    .logo { font-size: 1.2rem; font-weight: 700; margin-bottom: 24px; }
    .sidebar a { color: #ccc; text-decoration: none; padding: 10px 12px; border-radius: 8px; }
    .sidebar a.active, .sidebar a:hover { background: #16213e; color: white; }
    .logout-btn { margin-top: auto; background: transparent; border: 1px solid #444; color: #ccc; padding: 10px; border-radius: 8px; cursor: pointer; }
    .content { flex: 1; overflow-y: auto; padding: 32px; background: #f8f9fa; }
  `]
})
export class MainLayoutComponent {
  constructor(public auth: AuthService) {}
}
