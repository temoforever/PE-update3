import { supabase } from "./supabase";

export const checkIsAdmin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    console.log("Checking admin status for user:", user.id);

    // استخدام RPC بدلاً من الاستعلام المباشر
    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error("RPC error:", error);
      // استخدام الطريقة التقليدية كخطة بديلة
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return false;
      }

      return profile?.role === "admin";
    }

    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const requireAdmin = async (navigate: (path: string) => void) => {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    navigate("/");
    return false;
  }
  return true;
};
