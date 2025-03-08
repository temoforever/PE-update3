import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthMode = "login" | "register" | "forgot";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          title: "مرحباً بك!",
          description: "تم تسجيل الدخول بنجاح",
          variant: "default",
        });
        setFormData({ email: "", password: "", fullName: "" });
        onClose();
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "تم إنشاء الحساب!",
          description:
            "تم إنشاء الحساب بنجاح، يرجى تفعيل حسابك عبر البريد الإلكتروني",
          variant: "default",
        });
        setFormData({ email: "", password: "", fullName: "" });
        setMode("login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          formData.email,
        );
        if (error) throw error;
        alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        setMode("login");
      }
    } catch (error: any) {
      setError(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            {mode === "login"
              ? "تسجيل الدخول"
              : mode === "register"
                ? "إنشاء حساب جديد"
                : "نسيت كلمة المرور"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
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
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-black placeholder:text-gray-400"
                />
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
                className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-black placeholder:text-gray-400"
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
                    className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-black placeholder:text-gray-400"
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
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
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

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {mode === "login" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode("register")}
                    className="border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    إنشاء حساب جديد
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("forgot")}
                    className="text-gray-600 hover:text-gray-900"
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
                  className="border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  العودة إلى تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
