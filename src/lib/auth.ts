import { supabase } from "./supabase";

export const getErrorMessage = (error: string) => {
  switch (error) {
    case "Invalid login credentials":
      return "بيانات تسجيل الدخول غير صحيحة";
    case "User already registered":
      return "هذا البريد الإلكتروني مسجل مسبقاً";
    case "Email not confirmed":
      return "يرجى تأكيد البريد الإلكتروني أولاً";
    case "Invalid email":
      return "البريد الإلكتروني غير صالح";
    case "Password should be at least 6 characters":
      return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    case "Unable to validate email address: invalid format":
      return "صيغة البريد الإلكتروني غير صحيحة";
    case "Auth session missing!":
      return "الرجاء تسجيل الدخول مرة أخرى";
    case "Email rate limit exceeded":
      return "تم تجاوز عدد المحاولات المسموح بها، الرجاء المحاولة لاحقاً";
    default:
      return "حدث خطأ، يرجى المحاولة مرة أخرى";
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    return { ...session.user, profile };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    // Check if there's an active session first
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
      // Sign out from supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error in signOut:", error);
        // Continue with cleanup even if there's an error
      }
    }

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Hard reload to clear all state
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out:", error);
    // Continue with cleanup even if there's an error
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }
};

export const deleteAccount = async (userId: string) => {
  try {
    // First delete profile data
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) throw profileError;

    // Then delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error(
        "Admin delete failed, falling back to sign out:",
        authError,
      );
      // If admin delete fails, try regular signOut
      await supabase.auth.signOut();
    }

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
