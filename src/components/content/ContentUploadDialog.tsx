import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentUploadDialogProps {
  stageId: string;
  categoryId: string;
  isAdmin?: boolean;
  className?: string;
  contentType?: string;
  variant?: string;
  showIcon?: boolean;
  label?: string;
}

type ContentType = "image" | "video" | "file" | "talent";

export default function ContentUploadDialog({
  stageId,
  categoryId,
  isAdmin = false,
  className,
  contentType,
}: ContentUploadDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    url: "",
    type: (contentType as ContentType) || "image",
    file: null as File | null,
  });

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${stageId}/${categoryId}/${fileName}`;

      console.log("Uploading file to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

      console.log("File uploaded successfully, URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          description: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      let url = formData.url;

      // If there's a file, upload it first
      if (formData.file) {
        console.log("Uploading file...");
        url = await handleFileUpload(formData.file);
        console.log("File uploaded successfully, URL:", url);
      }

      if (!url && !formData.file) {
        toast({
          variant: "destructive",
          description: "يجب إدخال رابط أو رفع ملف",
        });
        return;
      }

      if (isAdmin) {
        console.log("Creating content as admin...");
        const { error } = await supabase.from("content").insert([
          {
            title: formData.title,
            description: formData.description,
            url,
            type: formData.type,
            stage_id: stageId,
            category_id: categoryId,
            created_by: user.id,
          },
        ]);

        if (error) throw error;

        console.log("Content created successfully");
        window.dispatchEvent(new CustomEvent("content-updated"));
        toast({
          title: "تم بنجاح!",
          description: "تم رفع المحتوى بنجاح",
          variant: "default",
        });
      } else {
        console.log("Creating content request...");
        // Get admin user
        const { data: adminData, error: adminError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", "eng.mohamed87@live.com")
          .single();

        if (adminError) {
          console.error("Error getting admin:", adminError);
          throw adminError;
        }

        if (!adminData?.id) {
          console.error("Admin not found");
          throw new Error("حدث خطأ في إرسال الطلب");
        }

        const { error } = await supabase.from("content_requests").insert([
          {
            title: formData.title,
            description: formData.description,
            url,
            type: formData.type,
            stage_id: stageId,
            category_id: categoryId,
            status: "pending",
            user_id: user.id,
            admin_id: adminData.id,
          },
        ]);

        if (error) throw error;

        console.log("Content request created successfully");
        toast({ description: "تم إرسال طلب إضافة المحتوى بنجاح" });
      }

      setFormData({
        title: "",
        description: "",
        url: "",
        type: "image",
        file: null,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: error.message || "حدث خطأ أثناء إرسال الطلب",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`bg-[#7C9D32] hover:bg-[#7C9D32]/90 ${className} block`}
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {isAdmin ? "رفع محتوى" : "طلب إضافة محتوى"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white w-[90vw] max-w-[425px]"
        dir="rtl"
        aria-describedby="dialog-description"
      >
        <p
          id="dialog-description"
          className="text-gray-600 text-sm text-center mb-4"
        >
          {isAdmin
            ? "قم برفع محتوى جديد مباشرة إلى المنصة"
            : "قم بإرسال طلب إضافة محتوى جديد للمراجعة من قبل المشرفين"}
        </p>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isAdmin ? "رفع محتوى جديد" : "طلب إضافة محتوى جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.type}
            onValueChange={(value: ContentType) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger className="w-full h-12 border-2">
              <SelectValue placeholder="اختر نوع المحتوى" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="image">صورة</SelectItem>
              <SelectItem value="video">فيديو</SelectItem>
              <SelectItem value="file">ملف</SelectItem>
              <SelectItem value="talent">موهوب</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="عنوان المحتوى"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="h-12 border-2"
            disabled={loading}
          />

          <Textarea
            placeholder="وصف المحتوى"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="min-h-[100px] border-2"
            disabled={loading}
          />

          <div className="space-y-2">
            <p className="text-right font-medium">رفع ملف</p>
            <div className="relative">
              <input
                id="file-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, file });
                  }
                }}
                accept={
                  formData.type === "image"
                    ? "image/*"
                    : formData.type === "video"
                      ? "video/*"
                      : "*"
                }
                className="w-full h-12 border-2 rounded-md px-3 py-2"
                disabled={loading}
                capture={undefined}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">أو</div>

          <div className="space-y-2">
            <p className="text-right font-medium">رابط خارجي</p>
            <Input
              placeholder="رابط المحتوى"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="h-12 border-2"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium bg-[#95B846] hover:bg-[#95B846]/90"
            disabled={loading}
          >
            {loading
              ? "جاري الإرسال..."
              : isAdmin
                ? "رفع المحتوى"
                : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
