import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        description: "تم تسجيل الدخول بنجاح",
      });

      navigate("/");
    } catch (error: any) {
      setError(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-12 px-4">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        العودة للرئيسية
      </Button>

      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          مرحباً بك في مجتمع التربية البدنية
        </h1>
        <h2 className="text-xl font-bold text-gray-900">تسجيل الدخول</h2>
      </div>

      <Card className="max-w-md mx-auto w-full p-6">
        <h3 className="text-lg font-semibold mb-6 text-center">أدخل بياناتك</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="text-right"
          />

          <Input
            type="password"
            required
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="text-right"
          />

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#95B846] hover:bg-[#95B846]/90"
            disabled={loading}
          >
            تسجيل الدخول
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
