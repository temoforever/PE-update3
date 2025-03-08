import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, MessageSquare, BarChart, Home } from "lucide-react";
import { STAGES } from "@/lib/constants";
import ContentUploadDialog from "../content/ContentUploadDialog";
import { AdminHeader } from "./AdminHeader";
import { StatsCards } from "./StatsCards";
import { ContentManagementSection } from "./ContentManagementSection";

interface Stats {
  totalUsers: number;
  totalContent: number;
  totalRequests: number;
}

interface Admin {
  email: string;
  username: string;
  created_at: string;
}

interface ContentRequest {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  status: string;
  created_at: string;
  user_id: string;
  stage_id: string;
  category_id: string;
  user?: {
    username: string;
    email: string;
  };
}

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContent: 0,
    totalRequests: 0,
  });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
          navigate("/");
          return;
        }
        await Promise.all([
          fetchAdmins(),
          fetchContentRequests(),
          fetchMessages(),
          fetchStats(),
        ]);
      } catch (error) {
        console.error("Error initializing admin dashboard:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: contentCount } = await supabase
        .from("content")
        .select("*", { count: "exact", head: true });

      const { count: requestsCount } = await supabase
        .from("content_requests")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalContent: contentCount || 0,
        totalRequests: requestsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب الرسائل",
      });
    }
  };

  const fetchContentRequests = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("content_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const requestsWithUserDetails = await Promise.all(
        (data || []).map(async (request) => {
          const { data: userData } = await supabase
            .from("profiles")
            .select("username, email")
            .eq("id", request.user_id)
            .single();
          return { ...request, user: userData };
        }),
      );

      setContentRequests(requestsWithUserDetails);
    } catch (error) {
      console.error("Error in fetchContentRequests:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب طلبات المحتوى",
      });
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: string,
  ) => {
    try {
      const { data: request, error: requestError } = await supabase
        .from("content_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;

      const { error: updateError } = await supabase
        .from("content_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) throw updateError;

      if (status === "approved" && request) {
        const { error: contentError } = await supabase.from("content").insert([
          {
            title: request.title,
            description: request.description,
            url: request.url,
            type: request.type,
            stage_id: request.stage_id,
            category_id: request.category_id,
            created_by: request.user_id,
          },
        ]);

        if (contentError) throw contentError;
      }

      toast({
        description: `تم ${status === "approved" ? "قبول" : "رفض"} الطلب بنجاح`,
      });

      fetchContentRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
      });
    }
  };

  const handleViewRequest = (request: ContentRequest) => {
    if (request?.url) {
      window.open(request.url, "_blank");
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب قائمة المشرفين",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 pt-16" dir="rtl">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 mt-2">
        {/* Stats Cards */}
        <StatsCards
          totalUsers={stats.totalUsers}
          totalContent={stats.totalContent}
          totalRequests={stats.totalRequests}
        />

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="w-full flex overflow-x-auto bg-white p-1 rounded-lg">
            <TabsTrigger value="requests" className="flex-1">
              طلبات المحتوى
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1">
              إدارة المحتوى
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">
              الرسائل
            </TabsTrigger>
          </TabsList>

          {/* Content Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>طلبات المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              العنوان
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              النوع
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الحالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              تاريخ الطلب
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentRequests?.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {request.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.type === "image" && "صورة"}
                                {request.type === "video" && "فيديو"}
                                {request.type === "file" && "ملف"}
                                {request.type === "talent" && "موهوب"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    request.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : request.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {request.status === "pending" &&
                                    "قيد المراجعة"}
                                  {request.status === "approved" &&
                                    "تمت الموافقة"}
                                  {request.status === "rejected" && "مرفوض"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  request.created_at,
                                ).toLocaleDateString("ar-SA")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewRequest(request)}
                                  >
                                    عرض
                                  </Button>
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          handleUpdateRequestStatus(
                                            request.id,
                                            "approved",
                                          )
                                        }
                                      >
                                        قبول
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleUpdateRequestStatus(
                                            request.id,
                                            "rejected",
                                          )
                                        }
                                      >
                                        رفض
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <ContentManagementSection />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="البريد الإلكتروني"
                      className="flex-1"
                      dir="ltr"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <Button
                      onClick={async () => {
                        try {
                          const { data: existingUser } = await supabase
                            .from("profiles")
                            .select("id")
                            .eq("email", newAdminEmail)
                            .single();

                          if (existingUser) {
                            const { error: updateError } = await supabase
                              .from("profiles")
                              .update({ role: "admin" })
                              .eq("email", newAdminEmail);

                            if (updateError) throw updateError;
                          } else {
                            const tempPassword = Math.random()
                              .toString(36)
                              .slice(-8);

                            const { data: authData, error: authError } =
                              await supabase.auth.signUp({
                                email: newAdminEmail,
                                password: tempPassword,
                                options: {
                                  emailRedirectTo: window.location.origin,
                                },
                              });

                            if (authError) throw authError;

                            const { error: insertError } = await supabase
                              .from("profiles")
                              .insert([
                                {
                                  id: authData.user?.id,
                                  email: newAdminEmail,
                                  role: "admin",
                                  username: newAdminEmail.split("@")[0],
                                  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAdminEmail}`,
                                },
                              ]);

                            toast({
                              description: `تم إنشاء الحساب بنجاح. كلمة المرور المؤقتة: ${tempPassword}`,
                            });

                            if (insertError) throw insertError;
                          }

                          toast({
                            description: "تم إضافة المشرف بنجاح",
                          });
                          setNewAdminEmail("");
                          fetchAdmins();
                        } catch (error) {
                          console.error("Error adding admin:", error);
                          toast({
                            variant: "destructive",
                            description: "حدث خطأ أثناء إضافة المشرف",
                          });
                        }
                      }}
                      disabled={!newAdminEmail}
                      className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                    >
                      إضافة مستخدم جديد
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                البريد الإلكتروني
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                الاسم
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                تاريخ التسجيل
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                الإجراءات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {admins.map((admin) => (
                              <tr
                                key={admin.email}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {admin.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {admin.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    admin.created_at,
                                  ).toLocaleDateString("ar-SA")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const { error } = await supabase
                                          .from("profiles")
                                          .update({ role: "user" })
                                          .eq("email", admin.email);

                                        if (error) throw error;

                                        toast({
                                          description: "تم إزالة المشرف بنجاح",
                                        });
                                        fetchAdmins();
                                      } catch (error) {
                                        console.error(
                                          "Error removing admin:",
                                          error,
                                        );
                                        toast({
                                          variant: "destructive",
                                          description:
                                            "حدث خطأ أثناء إزالة المشرف",
                                        });
                                      }
                                    }}
                                  >
                                    حذف
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>الرسائل الواردة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              المرسل
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              البريد الإلكتروني
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الرسالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              التاريخ
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الحالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {messages?.map((message) => (
                            <tr key={message.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {message.sender_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {message.sender_email}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-xs truncate">
                                  {message.message}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  message.created_at,
                                ).toLocaleDateString("ar-SA")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    message.is_read
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {message.is_read ? "تمت القراءة" : "جديد"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Button
                                  size="sm"
                                  className="bg-[#7C9D32] hover:bg-[#7C9D32]/90 flex items-center gap-2"
                                  onClick={async () => {
                                    if (!message.is_read) {
                                      const { error } = await supabase
                                        .from("messages")
                                        .update({ is_read: true })
                                        .eq("id", message.id);

                                      if (error) {
                                        console.error(
                                          "Error marking message as read:",
                                          error,
                                        );
                                        return;
                                      }

                                      fetchMessages();
                                    }
                                  }}
                                >
                                  <Send className="h-4 w-4" />
                                  رد
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
