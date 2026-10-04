-- Dead Infrastructure Mapper - Initial Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Infrastructure Items (Registered or crowd-discovered public assets)
CREATE TABLE IF NOT EXISTS infrastructure_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    type VARCHAR(50) NOT NULL, -- streetlight, sidewalk, wheelchair_ramp, public_toilet, water_point, bus_stop, traffic_signal, other
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    current_status VARCHAR(30) DEFAULT 'operational', -- operational, degraded, broken, inaccessible, under_repair
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_infra_coords ON infrastructure_items (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_infra_type ON infrastructure_items (type);
CREATE INDEX IF NOT EXISTS idx_infra_status ON infrastructure_items (current_status);

-- 2. Citizen Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    infrastructure_id UUID REFERENCES infrastructure_items(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    reported_category VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    status VARCHAR(30) DEFAULT 'submitted', -- submitted, verified, in_progress, resolved, rejected
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    reporter_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_coords ON reports (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);

-- 3. Report Status Audit History
CREATE TABLE IF NOT EXISTS report_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    notes TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AI Analysis Results
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    detected_infrastructure_type VARCHAR(50),
    detected_damage_type VARCHAR(100),
    confidence_score FLOAT DEFAULT 0.0,
    is_duplicate_candidate BOOLEAN DEFAULT FALSE,
    duplicate_of_report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    raw_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) DEFAULT 'officer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
