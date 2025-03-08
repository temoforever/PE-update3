import React, { useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  date: Date;
  title: string;
  type: "training" | "competition" | "meeting";
}

const Calendar = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [showAddEvent, setShowAddEvent] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    type: "training" as "training" | "competition" | "meeting",
  });

  useEffect(() => {
    checkAdmin();
    fetchEvents();
    setupRealtimeSubscription();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(profile?.role === "admin");
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    setEvents(
      data.map((event) => ({
        ...event,
        date: new Date(event.date),
      })),
    );
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          const newEvent: Event = {
            id: payload.new.id,
            title: payload.new.title,
            type: payload.new.type,
            date: new Date(payload.new.date),
          };
          setEvents((current) => [...current, newEvent]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleAddEvent = async () => {
    if (!date || !newEvent.title || !newEvent.type) return;

    try {
      const { error } = await supabase.from("events").insert([
        {
          title: newEvent.title,
          type: newEvent.type,
          date: date.toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        description: "تم إضافة الحدث بنجاح",
      });

      setNewEvent({ title: "", type: "training" });
      setShowAddEvent(false);
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إضافة الحدث",
      });
    }
  };

  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  );

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "training":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "competition":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "meeting":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case "training":
        return "تدريب";
      case "competition":
        return "منافسة";
      case "meeting":
        return "اجتماع";
      default:
        return type;
    }
  };

  return (
    <Card className={cn("bg-white shadow-sm max-w-[300px] mx-auto", className)}>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-lg font-semibold text-center">
          التقويم الرياضي
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto rounded-md"
            classNames={{
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent/20 text-accent-foreground",
              day: "h-7 w-7 p-0 font-normal text-sm text-center hover:bg-accent/20 rounded-full",
              head_cell: "text-muted-foreground font-normal text-xs",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              nav_button:
                "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-0.5",
              nav_button_next: "absolute right-0.5",
              caption: "relative py-0.5 text-sm font-medium",
              table: "w-full border-collapse space-y-0.5",
              root: "w-[260px]",
            }}
          />

          {selectedDateEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-center">أحداث اليوم</h3>
              <div className="space-y-1.5">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 bg-white rounded-md border text-sm hover:border-primary/20 transition-colors"
                  >
                    <span className="font-medium truncate">{event.title}</span>
                    <Badge
                      className={cn(
                        "ml-2 text-xs",
                        getEventBadgeColor(event.type),
                      )}
                    >
                      {getEventTypeName(event.type)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
