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

interface ContentRequestDialogProps {
  stageId: string;
  categoryId: string;
}

type ContentType = "image" | "video" | "file" | "talent";

import { useNavigate } from "react-router-dom";

export default function ContentRequestDialog({
  stageId,
  categoryId,
}: ContentRequestDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    title: string;
    description: string;
    url: string;
    type: ContentType;
    file?: File | null;
    previewUrl?: string | null;
  }>({
    title: "",
    description: "",
    url: "",
    type: "image",
    file: null,
  });

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `requests/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

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
        setLoading(false);
        return;
      }

      // Get admin user
      const { data: adminData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", "eng.mohamed87@live.com")
        .single();

      if (!adminData?.id) {
        toast({
          variant: "destructive",
          description: "حدث خطأ في إرسال الطلب",
        });
        return;
      }

      let url = formData.url;

      // If there's a file, upload it first
      if (formData.file) {
        url = await handleFileUpload(formData.file);
      }

      const { error } = await supabase.from("content_requests").insert([
        {
          title: formData.title,
          description: formData.description,
          url: url,
          type: formData.type,
          stage_id: stageId,
          category_id: categoryId,
          status: "pending",
          user_id: user.id,
          admin_id: adminData.id,
        },
      ]);

      // Send notification to admin
      await supabase.from("notifications").insert([
        {
          user_id: adminData.id,
          title: "طلب محتوى جديد",
          message: `طلب إضافة ${formData.type === "image" ? "صورة" : formData.type === "video" ? "فيديو" : formData.type === "file" ? "ملف" : "موهوب"} جديد: ${formData.title}`,
          type: "content_request",
        },
      ]);

      if (error) throw error;

      toast({
        description:
          "تم إرسال طلب إضافة المحتوى بنجاح وسيتم مراجعته من قبل المشرف",
      });

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
          className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          طلب إضافة محتوى
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white"
        dir="rtl"
        aria-describedby="dialog-description"
      >
        <p
          id="dialog-description"
          className="text-gray-600 text-sm text-center mb-4"
        >
          قم بإرسال طلب إضافة محتوى جديد للمراجعة من قبل المشرفين
        </p>
        <DialogHeader className="text-right mb-4">
          <DialogTitle>طلب إضافة محتوى جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-2">
            <Select
              value={formData.type}
              onValueChange={(value: ContentType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="text-right w-full">
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="text-right w-full"
                align="end"
              >
                <SelectItem value="image">صورة</SelectItem>
                <SelectItem value="video">فيديو</SelectItem>
                <SelectItem value="file">ملف</SelectItem>
                <SelectItem value="talent">موهوب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="عنوان المحتوى"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="وصف المحتوى"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  className="block w-full cursor-pointer"
                >
                  <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {formData.previewUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={formData.previewUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 left-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              file: null,
                              previewUrl: null,
                            }));
                          }}
                        >
                          حذف
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-gray-500 mb-2">
                          انقر أو اسحب الملف هنا
                        </div>
                        <div className="text-sm text-gray-400">
                          {formData.type === "image"
                            ? "صور"
                            : formData.type === "video"
                              ? "فيديو"
                              : "ملفات"}
                        </div>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData((prev) => ({
                            ...prev,
                            file,
                            previewUrl: e.target?.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setFormData({ ...formData, file });
                      }
                    }
                  }}
                  accept={
                    formData.type === "image"
                      ? "image/*"
                      : formData.type === "video"
                        ? "video/*"
                        : "*"
                  }
                  className="block w-full absolute inset-0 opacity-0 cursor-pointer"
                  capture={
                    formData.type === "image" ? "environment" : undefined
                  }
                />
              </div>
              {formData.type === "image" && (
                <div className="mt-2">
                  {formData.previewUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={formData.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 left-2"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            file: null,
                            previewUrl: null,
                          }))
                        }
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">اختر صورة للمعاينة</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-center text-sm text-gray-500">أو</div>
            <div className="space-y-2">
              <Input
                placeholder="رابط المحتوى"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
