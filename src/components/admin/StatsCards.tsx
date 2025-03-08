import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, BarChart, MessageSquare } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalContent: number;
  totalRequests: number;
}

export function StatsCards({
  totalUsers,
  totalContent,
  totalRequests,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-white shadow hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-[#748D19]" />
            المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart className="h-5 w-5 text-[#748D19]" />
            المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalContent}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-[#748D19]" />
            الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalRequests}</p>
        </CardContent>
      </Card>
    </div>
  );
}
