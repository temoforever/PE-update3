-- حذف السياسة المكررة فقط دون محاولة إعادة إنشائها
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;
