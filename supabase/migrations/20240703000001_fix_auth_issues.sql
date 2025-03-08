-- إصلاح مشاكل المصادقة وصلاحيات الوصول

-- تعطيل RLS مؤقتًا للتحقق من المشكلة
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE content DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- إضافة سياسات عامة للقراءة
DROP POLICY IF EXISTS "Public profiles read access" ON profiles;
CREATE POLICY "Public profiles read access"
ON profiles
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public content read access" ON content;
CREATE POLICY "Public content read access"
ON content
FOR SELECT
USING (true);

-- تحديث المستخدم المشرف
UPDATE profiles
SET role = 'admin'
WHERE email = 'eng.mohamed87@live.com';

-- إضافة مستخدم مشرف جديد للاختبار
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'admin@example.com', crypt('admin123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (email) DO NOTHING;

-- إضافة المستخدم إلى جدول profiles
INSERT INTO profiles (id, email, username, full_name, role, avatar_url, created_at, updated_at)
SELECT 
  id, 
  'admin@example.com', 
  'admin', 
  'Admin User', 
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- إعادة تعيين كلمة المرور للمستخدم الحالي (اختياري)
-- يمكنك استخدام هذا الاستعلام لإعادة تعيين كلمة المرور للمستخدم الحالي
-- UPDATE auth.users
-- SET encrypted_password = crypt('newpassword', gen_salt('bf'))
-- WHERE email = 'eng.mohamed87@live.com';

-- تصحيح الإعدادات في جدول auth.config
UPDATE auth.config
SET value = jsonb_set(value, '{SITE_URL}', '"https://confident-perlman6-vmlg7.dev-2.tempolabs.ai"')
WHERE parameter = 'config';

UPDATE auth.config
SET value = jsonb_set(value, '{DISABLE_SIGNUP}', 'false')
WHERE parameter = 'config';

-- تمكين تسجيل الدخول بالبريد الإلكتروني
UPDATE auth.config
SET value = jsonb_set(value, '{EXTERNAL_EMAIL_ENABLED}', 'true')
WHERE parameter = 'config';

-- إعادة تفعيل RLS بعد الإصلاحات
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
