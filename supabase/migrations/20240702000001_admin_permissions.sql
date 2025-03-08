-- إضافة صلاحيات للمشرف

-- تحديث المستخدم ليكون مشرف
UPDATE profiles
SET role = 'admin'
WHERE email = 'eng.mohamed87@live.com';

-- إضافة المستخدم إلى جدول الإشعارات
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT id, 'ترحيب', 'مرحباً بك في لوحة التحكم', 'system', false
FROM profiles
WHERE email = 'eng.mohamed87@live.com'
ON CONFLICT DO NOTHING;

-- إنشاء سياسة للمشرفين للوصول إلى جميع الجداول
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- سياسة المشرفين للوصول إلى جدول المستخدمين
DROP POLICY IF EXISTS "Admin can do anything" ON profiles;
CREATE POLICY "Admin can do anything"
ON profiles
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- سياسة المشرفين للوصول إلى جدول المحتوى
DROP POLICY IF EXISTS "Admin can do anything" ON content;
CREATE POLICY "Admin can do anything"
ON content
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- سياسة المشرفين للوصول إلى جدول طلبات المحتوى
DROP POLICY IF EXISTS "Admin can do anything" ON content_requests;
CREATE POLICY "Admin can do anything"
ON content_requests
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- سياسة المشرفين للوصول إلى جدول الرسائل
DROP POLICY IF EXISTS "Admin can do anything" ON messages;
CREATE POLICY "Admin can do anything"
ON messages
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- سياسة المشرفين للوصول إلى جدول الإشعارات
DROP POLICY IF EXISTS "Admin can do anything" ON notifications;
CREATE POLICY "Admin can do anything"
ON notifications
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- سياسة المشرفين للوصول إلى الإشعارات الخاصة بهم
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR SELECT
USING (user_id = auth.uid());

-- تحديث قائمة المشرفين في كود التطبيق
COMMENT ON TABLE profiles IS 'Admin emails: eng.mohamed87@live.com, wadhaalmeqareh@hotmail.com, Sarahalmarri1908@outlook.com, Fatmah_alahbabi@hotmail.com, thamertub@gmail.com, liyan2612@hotmail.com, anood99.mhad@hotmail.com';
