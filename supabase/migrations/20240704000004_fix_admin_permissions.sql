-- منح المشرفين صلاحيات كاملة للحذف والتعديل على جميع الجداول

-- تعديل سياسات جدول المحتوى
DROP POLICY IF EXISTS "Admins can do anything with content" ON content;
CREATE POLICY "Admins can do anything with content"
ON content
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول طلبات المحتوى
DROP POLICY IF EXISTS "Admins can do anything with content_requests" ON content_requests;
CREATE POLICY "Admins can do anything with content_requests"
ON content_requests
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول الملفات الشخصية
DROP POLICY IF EXISTS "Admins can do anything with profiles" ON profiles;
CREATE POLICY "Admins can do anything with profiles"
ON profiles
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول الرسائل
DROP POLICY IF EXISTS "Admins can do anything with messages" ON messages;
CREATE POLICY "Admins can do anything with messages"
ON messages
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول الإشعارات
DROP POLICY IF EXISTS "Admins can do anything with notifications" ON notifications;
CREATE POLICY "Admins can do anything with notifications"
ON notifications
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول الأحداث
DROP POLICY IF EXISTS "Admins can do anything with events" ON events;
CREATE POLICY "Admins can do anything with events"
ON events
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول المحادثات
DROP POLICY IF EXISTS "Admins can do anything with chats" ON chats;
CREATE POLICY "Admins can do anything with chats"
ON chats
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- تعديل سياسات جدول رسائل المحادثات
DROP POLICY IF EXISTS "Admins can do anything with chat_messages" ON chat_messages;
CREATE POLICY "Admins can do anything with chat_messages"
ON chat_messages
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- إنشاء وظيفة للتحقق من صلاحيات المشرف
CREATE OR REPLACE FUNCTION is_full_admin()
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql;

-- منح صلاحيات للمشرفين على مخزن الملفات (بدون استخدام storage.policies)
CREATE POLICY "Admin Storage Full Access" ON storage.objects
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
