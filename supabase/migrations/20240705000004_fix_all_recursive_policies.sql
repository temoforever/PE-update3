-- إصلاح جميع سياسات التكرار اللانهائي في قاعدة البيانات

-- حذف جميع السياسات التي قد تسبب تكرار لانهائي
DROP POLICY IF EXISTS "Admins can do anything with profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can do anything with content" ON content;
DROP POLICY IF EXISTS "Admins can do anything with content_requests" ON content_requests;
DROP POLICY IF EXISTS "Admins can do anything with messages" ON messages;
DROP POLICY IF EXISTS "Admins can do anything with notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can do anything with events" ON events;
DROP POLICY IF EXISTS "Admins can do anything with chats" ON chats;
DROP POLICY IF EXISTS "Admins can do anything with chat_messages" ON chat_messages;

-- إنشاء وظيفة آمنة للتحقق من صلاحيات المشرف
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (role = 'admin') INTO is_admin FROM profiles WHERE id = auth.uid();
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql;

-- إعادة إنشاء السياسات باستخدام الوظيفة الآمنة
CREATE POLICY "Admins can do anything with profiles"
ON profiles
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with content"
ON content
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with content_requests"
ON content_requests
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with messages"
ON messages
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with notifications"
ON notifications
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with events"
ON events
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with chats"
ON chats
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can do anything with chat_messages"
ON chat_messages
FOR ALL
USING (public.is_admin());

-- إضافة سياسات للمستخدمين العاديين
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
