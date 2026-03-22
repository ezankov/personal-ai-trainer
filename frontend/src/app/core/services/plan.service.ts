import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AthleteProfile, CoachMessage, RaceGoal, TrainingPlan, Workout } from '../models/plan.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> { success: boolean; data: T; }

@Injectable({ providedIn: 'root' })
export class PlanService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Profile
  getProfile() {
    return this.http.get<ApiResponse<AthleteProfile>>(`${this.api}/profile`).pipe(map(r => r.data));
  }

  updateProfile(profile: Partial<AthleteProfile>) {
    return this.http.put<ApiResponse<AthleteProfile>>(`${this.api}/profile`, profile).pipe(map(r => r.data));
  }

  // Goals
  getGoals() {
    return this.http.get<ApiResponse<RaceGoal[]>>(`${this.api}/goals`).pipe(map(r => r.data));
  }

  createGoal(goal: RaceGoal) {
    return this.http.post<ApiResponse<RaceGoal>>(`${this.api}/goals`, goal).pipe(map(r => r.data));
  }

  getActiveGoal() {
    return this.http.get<ApiResponse<RaceGoal>>(`${this.api}/goals/active`).pipe(map(r => r.data));
  }

  // Plans
  generatePlan() {
    return this.http.post<ApiResponse<TrainingPlan>>(`${this.api}/plans/generate`, {}).pipe(map(r => r.data));
  }

  getActivePlan() {
    return this.http.get<ApiResponse<TrainingPlan>>(`${this.api}/plans/active`).pipe(map(r => r.data));
  }

  updateWorkout(workoutId: string, updates: Partial<Workout>) {
    return this.http.put<ApiResponse<Workout>>(`${this.api}/plans/workouts/${workoutId}`, updates).pipe(map(r => r.data));
  }

  // Coach
  getChatHistory() {
    return this.http.get<ApiResponse<CoachMessage[]>>(`${this.api}/coach/history`).pipe(map(r => r.data));
  }

  sendMessage(message: string) {
    return this.http.post<ApiResponse<CoachMessage>>(`${this.api}/coach/chat`, { message }).pipe(map(r => r.data));
  }
}
