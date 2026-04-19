-- Initialize database for Swachh Vision
-- This file is automatically executed when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created automatically by SQLAlchemy but included for reference

-- Users table indexes
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Detections table indexes  
-- CREATE INDEX IF NOT EXISTS idx_detections_user ON detections(user_id);
-- CREATE INDEX IF NOT EXISTS idx_detections_status ON detections(status);
-- CREATE INDEX IF NOT EXISTS idx_detections_created ON detections(created_at);

-- Alerts table indexes
-- CREATE INDEX IF NOT EXISTS idx_alerts_detection ON alerts(detection_id);
-- CREATE INDEX IF NOT EXISTS idx_alerts_sent ON alerts(email_sent);

-- Set up default admin user (password: admin123)
-- This will be handled by the application registration system

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
