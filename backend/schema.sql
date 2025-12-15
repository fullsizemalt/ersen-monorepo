-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  workos_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id INTEGER REFERENCES users(id) PRIMARY KEY,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'free', -- 'free', 'standard', 'pro'
  status VARCHAR(50) DEFAULT 'active',
  current_period_end TIMESTAMP
);

-- Widget Templates (Catalog)
CREATE TABLE IF NOT EXISTS widget_templates (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  tier VARCHAR(50) DEFAULT 'free',
  thumbnail_url TEXT,
  component_key VARCHAR(100) -- Internal key for frontend component mapping
);

-- Active Widgets (Installed)
CREATE TABLE IF NOT EXISTS active_widgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES widget_templates(id),
  config JSONB DEFAULT '{}',
  position JSONB DEFAULT '{"x": 0, "y": 0, "w": 1, "h": 1}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integrations (OAuth tokens for widgets)
CREATE TABLE IF NOT EXISTS integrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'spotify', 'github'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, provider)
);

-- Add role to users if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
    END IF;
END
$$;
