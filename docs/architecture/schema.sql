-- BMS Initial Database Schema (PostgreSQL/SQL Standard)

-- 1. Church Hierarchy
CREATE TABLE unions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    union_id UUID REFERENCES unions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE local_churches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users & Authentication
CREATE TYPE user_role AS ENUM (
    'union_admin', 'field_admin', 'district_admin', 'church_admin', 
    'pastor', 'instructor', 'candidate'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    -- Hierarchy Assignment (Scoped access)
    union_id UUID REFERENCES unions(id),
    field_id UUID REFERENCES fields(id),
    district_id UUID REFERENCES districts(id),
    church_id UUID REFERENCES local_churches(id),
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Candidates
CREATE TYPE candidate_status AS ENUM (
    'registered', 'in_progress', 'ready', 'baptized'
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(10),
    address_province VARCHAR(100),
    address_district VARCHAR(100),
    address_sector VARCHAR(100),
    referral_source TEXT,
    previous_religion TEXT,
    instructor_id UUID REFERENCES users(id), -- Role must be 'instructor'
    status candidate_status DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bible Study Module
CREATE TABLE bible_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL UNIQUE,
    learning_objectives TEXT
);

CREATE TABLE candidate_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES bible_lessons(id),
    completion_date DATE,
    understanding_score INTEGER CHECK (understanding_score BETWEEN 1 AND 5),
    instructor_notes TEXT,
    next_lesson_date DATE,
    UNIQUE(candidate_id, lesson_id)
);

-- 5. Spiritual Preparation Module
CREATE TABLE spiritual_growth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    log_type VARCHAR(50), -- 'attendance', 'prayer_request', 'testimony', 'transformation'
    content TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE baptism_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_id UUID REFERENCES users(id), -- Role must be 'pastor' or 'admin'
    interview_date DATE,
    readiness_score INTEGER,
    feedback TEXT,
    is_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Baptism Management
CREATE TABLE baptism_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID REFERENCES local_churches(id),
    event_date TIMESTAMP NOT NULL,
    location TEXT,
    officiating_pastor_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE baptism_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES baptism_events(id),
    candidate_id UUID REFERENCES candidates(id) UNIQUE,
    witness_name VARCHAR(255),
    sponsor_name VARCHAR(255),
    certificate_number VARCHAR(50) UNIQUE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Membership Management
CREATE TYPE member_status AS ENUM (
    'active', 'inactive', 'transferred', 'deceased'
);

CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    baptism_record_id UUID REFERENCES baptism_records(id),
    current_church_id UUID REFERENCES local_churches(id),
    status member_status DEFAULT 'active',
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    from_church_id UUID REFERENCES local_churches(id),
    to_church_id UUID REFERENCES local_churches(id),
    request_date DATE NOT NULL,
    approval_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    notes TEXT
);

-- 8. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
