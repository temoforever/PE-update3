import React from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("🚀 بدء عملية التسجيل...");

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement)
      .value;

    try {
      // 1️⃣ إنشاء الحساب
      console.log("1️⃣ إنشاء الحساب...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.log("❌ خطأ أثناء إنشاء الحساب:", error.message);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      console.log("✅ تم إنشاء الحساب بنجاح:", data);

      // 2️⃣ إضافة البيانات إلى جدول Profiles
      if (data.user) {
        console.log("📝 إدراج البيانات في جدول profiles...");
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username: email.split("@")[0],
            full_name: fullName,
            email,
            role: "user",
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          },
        ]);

        if (profileError) {
          console.log("❌ خطأ في إدراج الملف الشخصي:", profileError.message);
          setError(profileError.message);
          setIsLoading(false);
          return;
        }

        console.log("✅ تم إنشاء الملف الشخصي بنجاح!");

        // Sign in automatically after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.log("❌ خطأ في تسجيل الدخول التلقائي:", signInError.message);
          throw signInError;
        }

        toast({
          description: "تم إنشاء الحساب وتسجيل الدخول بنجاح!",
          variant: "default",
        });

        window.location.href = "/";
      }
    } catch (err: any) {
      console.log("❌ خطأ غير متوقع:", err);
      setError("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
      console.log("🔄 تم إنهاء عملية التسجيل.");
    }
  };

  // Rest of the component code...
  // (Keep all other functions and JSX the same)

  return (
    // Keep the existing return JSX
    <div>Existing JSX</div>
  );
};

export default Login;
