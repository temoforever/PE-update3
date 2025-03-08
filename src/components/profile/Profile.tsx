import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  school?: string;
  specialization?: string;
  years_of_experience?: string;
  role?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("No profile found");
        throw new Error("لم يتم العثور على الملف الشخصي");
      }

      setProfile(profile);
      // التحقق مباشرة من دور المستخدم
      setIsAdmin(profile.role === "admin");
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        description:
          error.message || "حدث خطأ أثناء جلب البيانات. حاول مرة أخرى.",
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          school: profile.school,
          specialization: profile.specialization,
          years_of_experience: profile.years_of_experience,
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast({ description: "تم تحديث الملف الشخصي بنجاح" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            لم يتم العثور على الملف الشخصي
          </h1>
          <Button onClick={() => navigate("/login")}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-8">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full"
            />
          </div>

          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input value={profile.email} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>المدرسة</Label>
              <Input
                value={profile.school || ""}
                onChange={(e) =>
                  setProfile({ ...profile, school: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>التخصص</Label>
              <Input
                value={profile.specialization || ""}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>سنوات الخبرة</Label>
              <Input
                value={profile.years_of_experience || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    years_of_experience: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              {isAdmin && (
                <Button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                >
                  لوحة التحكم
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                رجوع
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                حذف الحساب
              </h3>
              <p className="text-gray-600 mb-4">
                عند حذف حسابك، سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن
                استعادتها.
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  if (
                    window.confirm(
                      "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",
                    )
                  ) {
                    try {
                      setUpdating(true);

                      // Delete all user content
                      const { error: contentError } = await supabase
                        .from("content")
                        .delete()
                        .eq("created_by", profile.id);

                      if (contentError) {
                        console.error(
                          "Error deleting user content:",
                          contentError,
                        );
                      }

                      // Delete all user content requests
                      const { error: requestsError } = await supabase
                        .from("content_requests")
                        .delete()
                        .eq("user_id", profile.id);

                      if (requestsError) {
                        console.error(
                          "Error deleting user requests:",
                          requestsError,
                        );
                      }

                      // Try to delete the user using the RPC function first
                      const { data: rpcData, error: deleteError } =
                        await supabase.rpc("delete_user");

                      if (deleteError) {
                        console.error(
                          "RPC delete failed, attempting admin delete:",
                          deleteError,
                        );

                        // Then try to delete the auth user using admin API
                        const { error: authError } =
                          await supabase.auth.admin.deleteUser(profile.id);

                        if (authError) {
                          console.error(
                            "Admin delete failed, falling back to sign out:",
                            authError,
                          );
                          // If all delete methods fail, try regular signOut
                          try {
                            await supabase.auth.signOut();
                          } catch (signOutError) {
                            console.error(
                              "Error during signOut fallback:",
                              signOutError,
                            );
                            // Continue with cleanup even if signOut fails
                          }
                        }
                      } else {
                        console.log(
                          "User deleted successfully via RPC function:",
                          rpcData,
                        );
                      }

                      toast({
                        description: "تم حذف الحساب بنجاح",
                      });

                      // Navigate to a confirmation page
                      navigate("/account-deleted");
                    } catch (error) {
                      console.error("Error deleting account:", error);
                      toast({
                        variant: "destructive",
                        description: "حدث خطأ أثناء حذف الحساب",
                      });
                    } finally {
                      setUpdating(false);
                    }
                  }
                }}
                className="w-full"
              >
                حذف الحساب
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
