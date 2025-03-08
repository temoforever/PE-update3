import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

type AuthMode = "login" | "register" | "forgot";

interface FormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  school: string;
  specialization: string;
  yearsOfExperience: string;
}

export default function AuthForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    school: "",
    specialization: "",
    yearsOfExperience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent zoom on input focus
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        console.log("Attempting to sign in with:", { email: formData.email });
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error);
          // تبسيط التعامل مع الأخطاء
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("بيانات تسجيل الدخول غير صحيحة");
          } else {
            throw error;
          }
        }

        toast({
          description: "تم تسجيل الدخول بنجاح",
        });
        setFormData({
          email: "",
          password: "",
          fullName: "",
          phone: "",
          school: "",
          specialization: "",
          yearsOfExperience: "",
        });
        navigate("/");
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });
        if (error) throw error;
        toast({
          description:
            "تم إنشاء الحساب بنجاح، يرجى تفعيل حسابك عبر البريد الإلكتروني",
        });
        setFormData({
          email: "",
          password: "",
          fullName: "",
          phone: "",
          school: "",
          specialization: "",
          yearsOfExperience: "",
        });
        setMode("login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          formData.email,
        );
        if (error) throw error;
        toast({
          description:
            "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
        });
        setFormData({
          email: "",
          password: "",
          fullName: "",
          phone: "",
          school: "",
          specialization: "",
          yearsOfExperience: "",
        });
        setMode("login");
      }
    } catch (error: any) {
      setError(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end px-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#7C9D32]"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold mb-2">
          مرحباً بك في مجتمع التربية البدنية
        </h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {mode === "login"
            ? "تسجيل الدخول"
            : mode === "register"
              ? "إنشاء حساب جديد"
              : "نسيت كلمة المرور"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="space-y-6">
                <div>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="الاسم الكامل"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="text-right"
                  />
                </div>
                <div>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="text-right"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Input
                    id="school"
                    type="text"
                    required
                    placeholder="المدرسة"
                    value={formData.school}
                    onChange={(e) =>
                      setFormData({ ...formData, school: e.target.value })
                    }
                    className="text-right"
                  />
                </div>
                <div>
                  <Input
                    id="specialization"
                    type="text"
                    required
                    placeholder="التخصص"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    className="text-right"
                  />
                </div>
                <div>
                  <Input
                    id="yearsOfExperience"
                    type="text"
                    required
                    placeholder="سنوات الخبرة"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: e.target.value,
                      })
                    }
                    className="text-right"
                  />
                </div>
              </div>
            )}

            <div>
              <Input
                id="email"
                type="email"
                required
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                disabled={loading}
              >
                {loading
                  ? "جاري التحميل..."
                  : mode === "login"
                    ? "تسجيل الدخول"
                    : mode === "register"
                      ? "إنشاء حساب"
                      : "إرسال رابط إعادة التعيين"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {mode === "login" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode("register")}
                  >
                    إنشاء حساب جديد
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("forgot")}
                  >
                    نسيت كلمة المرور؟
                  </Button>
                </>
              )}
              {(mode === "register" || mode === "forgot") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("login")}
                >
                  العودة إلى تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
