-- Make individualten@gmail.com a superuser with all features
-- Run via: docker exec ersen-db-1 psql -U ersen -d ersen -f /tmp/superuser.sql
-- Or paste directly into psql
-- First, check if user exists and create/update subscription
DO $$
DECLARE user_id_val INTEGER;
BEGIN -- Get or create user
SELECT id INTO user_id_val
FROM users
WHERE email = 'individualten@gmail.com';
IF user_id_val IS NOT NULL THEN -- Update user to admin role
UPDATE users
SET role = 'admin'
WHERE id = user_id_val;
-- Ensure pro tier subscription exists
INSERT INTO subscriptions (user_id, tier, status, stripe_subscription_id)
VALUES (user_id_val, 'pro', 'active', 'superuser_grant') ON CONFLICT (user_id) DO
UPDATE
SET tier = 'pro',
    status = 'active';
RAISE NOTICE 'User % upgraded to admin with pro tier',
'individualten@gmail.com';
ELSE RAISE NOTICE 'User not found: individualten@gmail.com';
END IF;
END $$;
-- Verify
SELECT u.id,
    u.email,
    u.role,
    s.tier,
    s.status
FROM users u
    LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'individualten@gmail.com';