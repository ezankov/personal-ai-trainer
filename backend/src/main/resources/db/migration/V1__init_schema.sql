CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE athlete_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    sport_type VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
    experience_level VARCHAR(50) NOT NULL DEFAULT 'BEGINNER',
    weekly_volume_km float8,
    max_training_days_per_week INT NOT NULL DEFAULT 4,
    preferred_long_run_day VARCHAR(20),
    available_days VARCHAR(100),
    threshold_pace_sec_per_km INT,
    ftp_watts INT,
    notes TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE race_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    race_type VARCHAR(50) NOT NULL,
    race_date DATE NOT NULL,
    target_time_seconds INT,
    race_name VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE training_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES race_goals(id),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    ai_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE training_weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    focus VARCHAR(100),
    total_volume_km float8,
    recovery_week BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID NOT NULL REFERENCES training_weeks(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT,
    distance_km float8,
    intensity VARCHAR(50),
    ai_explanation TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    garmin_workout_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE coach_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_workouts_plan_id ON workouts(plan_id);
CREATE INDEX idx_workouts_scheduled_date ON workouts(scheduled_date);
CREATE INDEX idx_training_weeks_plan_id ON training_weeks(plan_id);
CREATE INDEX idx_coach_messages_user_id ON coach_messages(user_id);
