-- Create first super admin user
-- Replace 'admin@reclaim.app' with your actual admin email

INSERT INTO admin_users (user_id, email, role) 
SELECT id, email, 'super_admin' 
FROM auth.users 
WHERE email = 'admin@reclaim.app'
ON CONFLICT DO NOTHING;