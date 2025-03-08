import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#748D19] text-white py-3 px-4 md:px-6 shadow-md fixed top-0 left-0 right-0 z-50 h-[calc(env(safe-area-inset-top)+64px)] pt-safe">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 h-16">
        <h1 className="text-lg md:text-2xl font-bold">لوحة التحكم</h1>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 text-[#748D19] flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          الرئيسية
        </Button>
      </div>
    </div>
  );
}
