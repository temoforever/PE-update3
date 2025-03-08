import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Menu,
  User,
  LogOut,
  BookOpen,
  Home,
  Calendar as CalendarIcon,
  MessageCircle,
} from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Calendar from "@/components/Calendar";
import Contact from "@/components/Contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MainHeader = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "مع السلامة!",
        description: "تم تسجيل الخروج بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تسجيل الخروج",
      });
    }
  };

  return (
    <header className="bg-[#7C9D32] text-white py-2 px-4 shadow-md fixed top-0 left-0 right-0 z-50 h-[calc(env(safe-area-inset-top)+64px)] pt-safe hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 h-16">
        {/* Logo and Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-[#8fb339] hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">PE</span>
            <img
              src="https://i.imgur.com/fcLmxsY.png"
              alt="PE Community Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-bold text-white">COMMUNITY</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-[#8fb339]"
            onClick={() => navigate("/home")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            المحتوى
          </Button>

          <Dialog
            open={showCalendarDialog}
            onOpenChange={setShowCalendarDialog}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-[#8fb339]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                التقويم
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>التقويم الرياضي</DialogTitle>
              </DialogHeader>
              <Calendar className="border-none shadow-none" />
            </DialogContent>
          </Dialog>

          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-[#8fb339]">
                <MessageCircle className="mr-2 h-4 w-4" />
                اتصل بنا
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>اتصل بنا</DialogTitle>
              </DialogHeader>
              <Contact />
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            className="text-white hover:bg-[#8fb339]"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            الرئيسية
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin")}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1A1A1A] font-bold"
                >
                  لوحة التحكم
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-[#8fb339] hover:text-white"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FFD700] text-[#1A1A1A] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-[#7C9D32]">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 bg-white p-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">الإشعارات</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-[#7C9D32] hover:text-[#7C9D32]/90"
                      >
                        تحديد الكل كمقروء
                      </Button>
                    </div>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7C9D32]"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <NotificationItem
                              title={notification.title}
                              message={notification.message}
                              type={notification.type}
                              createdAt={notification.created_at}
                              isRead={notification.is_read}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          لا توجد إشعارات
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#8fb339] hover:text-white"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-white" align="end">
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="font-medium">مرحباً بك</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/profile")}
                      >
                        <User className="ml-2 h-4 w-4" />
                        الملف الشخصي
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/home")}
                      >
                        <BookOpen className="ml-2 h-4 w-4" />
                        دروسي
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setShowContactDialog(true);
                          document
                            .querySelector('[role="dialog"]')
                            ?.setAttribute("data-state", "closed");
                        }}
                      >
                        <MessageCircle className="ml-2 h-4 w-4" />
                        اتصل بنا
                      </Button>
                    </div>
                    <div className="border-t pt-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={handleSignOut}
                      >
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="text-white hover:bg-[#8fb339]"
              onClick={() => setShowAuthDialog(true)}
            >
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
        }}
      />
    </header>
  );
};

export default MainHeader;
