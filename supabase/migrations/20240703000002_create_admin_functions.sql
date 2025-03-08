-- إنشاء دالة للتحقق من صلاحيات المشرف
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

-- إنشاء دالة لإضافة مشرف جديد
CREATE OR REPLACE FUNCTION add_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success boolean;
BEGIN
  -- التحقق من أن المستخدم الحالي مشرف
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'غير مصرح لك بإضافة مشرفين';
  END IF;
  
  -- تحديث دور المستخدم إلى مشرف
  UPDATE profiles
  SET role = 'admin'
  WHERE email = admin_email;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- إنشاء دالة لحذف مشرف
CREATE OR REPLACE FUNCTION remove_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success boolean;
BEGIN
  -- التحقق من أن المستخدم الحالي مشرف
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'غير مصرح لك بإزالة مشرفين';
  END IF;
  
  -- تحديث دور المستخدم إلى مستخدم عادي
  UPDATE profiles
  SET role = 'user'
  WHERE email = admin_email;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- إنشاء دالة لحذف المستخدم
CREATE OR REPLACE FUNCTION delete_user_data(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success boolean;
BEGIN
  -- حذف محتوى المستخدم
  DELETE FROM content WHERE created_by = user_id;
  
  -- حذف طلبات المحتوى
  DELETE FROM content_requests WHERE user_id = user_id;
  
  -- حذف الإشعارات
  DELETE FROM notifications WHERE user_id = user_id;
  
  -- حذف الملف الشخصي
  DELETE FROM profiles WHERE id = user_id;
  
  RETURN true;
END;
$$;
