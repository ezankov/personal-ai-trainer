import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  readonly currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, req).pipe(
      tap(res => this.setUser(res.data))
    );
  }

  register(req: RegisterRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, req).pipe(
      tap(res => this.setUser(res.data))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setUser(user: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    this.currentUser.set(user);
  }

  private loadUser(): AuthResponse | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? { token } as AuthResponse : null;
  }
}
