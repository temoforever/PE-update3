-- Function to delete a user completely from Supabase

-- Create the function
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id uuid;
  result json;
BEGIN
  -- Get the user ID from the current session
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Delete user content
  DELETE FROM public.content WHERE created_by = _user_id;
  
  -- Delete user content requests
  DELETE FROM public.content_requests WHERE user_id = _user_id;
  
  -- Delete user notifications
  DELETE FROM public.notifications WHERE user_id = _user_id;
  
  -- Delete user messages
  DELETE FROM public.chat_messages WHERE sender_id = _user_id;
  
  -- Delete user chats
  DELETE FROM public.chats WHERE user_id = _user_id;
  
  -- Delete user profile
  DELETE FROM public.profiles WHERE id = _user_id;
  
  -- Delete the user from auth.users
  -- This requires superuser privileges, so it might not work directly
  BEGIN
    DELETE FROM auth.users WHERE id = _user_id;
    result := json_build_object('success', true, 'message', 'User completely deleted');
  EXCEPTION WHEN OTHERS THEN
    -- If we can't delete from auth.users, we'll return partial success
    result := json_build_object('success', true, 'message', 'User data deleted, but auth record may remain');
  END;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
