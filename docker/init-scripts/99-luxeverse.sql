-- 99-luxeverse.sql - Create luxeverse_user and database
-- Run automatically by postgres image on first container start (when data dir is empty)

-- Create user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'luxeverse_user') THEN
        CREATE ROLE luxeverse_user WITH LOGIN PASSWORD 'luxeverse_dev_password';
    END IF;
END
$$;

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE luxeverse_db OWNER luxeverse_user ENCODING UTF8'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'luxeverse_db')\gexec

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE luxeverse_db TO luxeverse_user;

-- Connect to luxeverse_db and grant schema privileges
\c luxeverse_db;

GRANT ALL ON SCHEMA public TO luxeverse_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO luxeverse_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO luxeverse_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO luxeverse_user;
