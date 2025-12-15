-- Seed Widget Templates
-- These are the initial 12 free widgets that ship with DAEMON

INSERT INTO widget_templates (id, name, description, category, tier, default_config) VALUES
('task-manager', 'Task Manager', 'Manage your tasks and to-dos', 'productivity', 'free', '{"defaultView": "list"}'),
('ai-assistant', 'AI Assistant', 'Chat with AI for quick answers', 'productivity', 'free', '{"model": "gpt-4"}'),
('sticky-notes', 'Sticky Notes', 'Quick notes and reminders', 'productivity', 'free', '{}'),
('clock', 'World Clock', 'Display time across timezones', 'utility', 'free', '{"timezones": ["UTC", "America/New_York"]}'),
('weather', 'Weather', 'Current weather and forecast', 'utility', 'free', '{"location": "San Francisco"}'),
('calculator', 'Calculator', 'Basic calculator', 'utility', 'free', '{}'),
('pomodoro', 'Pomodoro Timer', 'Focus timer with breaks', 'productivity', 'free', '{"workMinutes": 25, "breakMinutes": 5}'),
('quote', 'Daily Quote', 'Inspirational quotes', 'lifestyle', 'free', '{}'),
('habit-tracker', 'Habit Tracker', 'Track daily habits', 'productivity', 'free', '{}'),
('toybox', 'ToyBox', 'Mini games and utilities', 'utility', 'free', '{}'),
('mood-tracker', 'Mood Tracker', 'Log and track your mood', 'lifestyle', 'free', '{}'),
('heatmap', 'Activity Heatmap', 'Visual activity calendar', 'productivity', 'free', '{}');

-- Standard tier widgets (email, calendar, etc.)
INSERT INTO widget_templates (id, name, description, category, tier, required_integrations, default_config) VALUES
('gmail', 'Gmail', 'Email inbox peek', 'productivity', 'standard', ARRAY['google'], '{"unreadOnly": true}'),
('google-calendar', 'Google Calendar', 'Upcoming events', 'productivity', 'standard', ARRAY['google'], '{"daysAhead": 7}'),
('github', 'GitHub Activity', 'Your GitHub contributions', 'developer', 'standard', ARRAY['github'], '{}'),
('spotify', 'Spotify Player', 'Now playing and playlists', 'media', 'standard', ARRAY['spotify'], '{}'),
('obsidian', 'Obsidian Vault', 'Recent notes and search', 'productivity', 'standard', '{}', '{"vaultPath": "/vaults"}'),
('kanban', 'Kanban Board', 'Visual project board', 'productivity', 'standard', '{}', '{"columns": ["To Do", "In Progress", "Done"]}'),
('music-download', 'Music Downloader', 'Download and convert tracks', 'media', 'standard', '{}', '{}');

-- Pro tier widgets (Grafana, monitoring, etc.)
INSERT INTO widget_templates (id, name, description, category, tier, required_integrations, default_config) VALUES
('grafana', 'Grafana Dashboard', 'Monitor metrics and logs', 'developer', 'pro', '{}', '{"dashboardUrl": ""}'),
('prometheus', 'Prometheus Metrics', 'Real-time metrics', 'developer', 'pro', '{}', '{"endpoint": ""}'),
('jellyfin', 'Jellyfin Media', 'Continue watching', 'media', 'pro', '{}', '{"server": ""}'),
('plex', 'Plex Server', 'Media server status', 'media', 'pro', '{}', '{"server": ""}'),
('audiobookshelf', 'Audiobookshelf', 'Audiobook progress', 'media', 'pro', '{}', '{"server": ""}');
