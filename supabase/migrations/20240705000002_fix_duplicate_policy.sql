-- إصلاح مشكلة تكرار سياسة "Users can view any profile"

-- حذف السياسة المكررة
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;

-- إعادة إنشاء السياسة بشكل صحيح إذا لم تكن موجودة
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view any profile'
  ) THEN
    CREATE POLICY "Users can view any profile"
    ON profiles
    FOR SELECT
    USING (true);
  END IF;
END
$$;
