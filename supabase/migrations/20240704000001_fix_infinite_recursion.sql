-- إصلاح مشكلة التكرار اللانهائي في سياسات جدول الملفات الشخصية

-- حذف السياسات الحالية التي تسبب التكرار اللانهائي
DROP POLICY IF EXISTS "Admins can do anything with profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- إنشاء سياسات جديدة بدون تكرار لانهائي
CREATE POLICY "Admins can do anything with profiles"
ON profiles
FOR ALL
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Users can view any profile"
ON profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
