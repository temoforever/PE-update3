-- حذف سياسة التحديث المكررة
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
