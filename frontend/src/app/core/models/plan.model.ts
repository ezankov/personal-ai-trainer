export type SportType = 'RUNNING' | 'CYCLING' | 'BOTH';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type RaceType = 'RACE_5K' | 'RACE_10K' | 'HALF_MARATHON' | 'MARATHON' | 'GRAN_FONDO' | 'TIME_TRIAL' | 'CUSTOM';
export type WorkoutType = 'EASY_RUN' | 'LONG_RUN' | 'TEMPO_RUN' | 'INTERVAL' | 'RECOVERY_RUN' | 'EASY_RIDE' | 'LONG_RIDE' | 'THRESHOLD_RIDE' | 'INTERVAL_RIDE' | 'CROSS_TRAINING' | 'REST';
export type WorkoutStatus = 'SCHEDULED' | 'COMPLETED' | 'SKIPPED' | 'MODIFIED';
export type Intensity = 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';

export interface AthleteProfile {
  id?: string;
  sportType: SportType;
  experienceLevel: ExperienceLevel;
  weeklyVolumeKm?: number;
  maxTrainingDaysPerWeek: number;
  preferredLongRunDay?: string;
  availableDays?: string;
  thresholdPaceSecPerKm?: number;
  ftpWatts?: number;
  notes?: string;
}

export interface RaceGoal {
  id?: string;
  raceType: RaceType;
  raceDate: string;
  targetTimeSeconds?: number;
  raceName?: string;
  active?: boolean;
}

export interface Workout {
  id: string;
  scheduledDate: string;
  workoutType: WorkoutType;
  title: string;
  description?: string;
  durationMinutes?: number;
  distanceKm?: number;
  intensity?: Intensity;
  aiExplanation?: string;
  status: WorkoutStatus;
}

export interface TrainingWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  focus?: string;
  totalVolumeKm?: number;
  recoveryWeek: boolean;
  workouts: Workout[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  aiSummary?: string;
  weeks: TrainingWeek[];
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
