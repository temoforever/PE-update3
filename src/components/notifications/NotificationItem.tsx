import { Bell, BookOpen, Star, FileText } from "lucide-react";

interface NotificationItemProps {
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export function NotificationItem({
  title,
  message,
  type,
  createdAt,
  isRead,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case "content":
        return <BookOpen className="h-4 w-4 text-[#7C9D32]" />;
      case "achievement":
        return <Star className="h-4 w-4 text-[#FFD700]" />;
      case "request":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-[#7C9D32]" />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${!isRead ? "bg-[#7C9D32]/5" : ""}`}
    >
      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(createdAt).toLocaleDateString("ar-SA", {
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
      {!isRead && <div className="h-2 w-2 rounded-full bg-[#7C9D32] mt-2" />}
    </div>
  );
}
