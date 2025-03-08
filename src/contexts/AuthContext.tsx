import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const handleAuthChange = async () => {
        try {
          if (event === "SIGNED_IN" && session?.user) {
            // Get or create profile
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (!existingProfile) {
              // Create profile if it doesn't exist
              const { data: newProfile } = await supabase
                .from("profiles")
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    username: session.user.email?.split("@")[0],
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
                    role: "user",
                  },
                ])
                .select()
                .single();

              setUser({ ...session.user, profile: newProfile });
              setIsAdmin(false);
            } else {
              setUser({ ...session.user, profile: existingProfile });
              // التحقق مباشرة من دور المستخدم
              setIsAdmin(existingProfile?.role === "admin");
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setIsAdmin(false);
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch (error) {
          console.error("Error in auth change handler:", error);
          setUser(null);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      };

      handleAuthChange();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Get full profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        setUser({ ...session.user, profile });
        // التحقق مباشرة من دور المستخدم
        setIsAdmin(profile?.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkAdmin(userId: string | undefined) {
    if (!userId) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", userId)
        .single();

      const adminEmails = [
        "eng.mohamed87@live.com",
        "wadhaalmeqareh@hotmail.com",
        "Sarahalmarri1908@outlook.com",
        "Fatmah_alahbabi@hotmail.com",
        "thamertub@gmail.com",
        "liyan2612@hotmail.com",
        "anood99.mhad@hotmail.com",
      ];
      setIsAdmin(adminEmails.includes(profile?.email || ""));
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  }

  async function signOut() {
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

      // Clear state
      setUser(null);
      setIsAdmin(false);

      // Force reload to clear all state
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // Continue with cleanup even if there's an error
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setIsAdmin(false);
      window.location.href = "/";
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
