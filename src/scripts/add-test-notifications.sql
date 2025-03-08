-- Get the user's ID first (replace USER_EMAIL with the actual email)
DO $$
DECLARE
    user_id uuid;
BEGIN
    -- Get the user ID
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = 'eng.mohamed87@live.com'
    LIMIT 1;

    -- Insert notifications for that user
    INSERT INTO notifications (user_id, title, message, type)
    VALUES 
        (user_id, 'محتوى جديد', 'تم إضافة درس جديد في المرحلة الابتدائية', 'content'),
        (user_id, 'إنجاز جديد', 'أحسنت! لقد أكملت 5 دروس', 'achievement'),
        (user_id, 'طلب جديد', 'تم استلام طلب إضافة محتوى جديد', 'request');

    RAISE NOTICE 'Notifications added for user %', user_id;
END $$;