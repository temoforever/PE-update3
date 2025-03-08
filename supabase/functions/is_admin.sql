-- دالة للتحقق من صلاحيات المشرف
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT (role = 'admin') INTO is_admin
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$;