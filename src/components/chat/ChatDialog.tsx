import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ChatDialogProps {
  onClose?: () => void;
}

export default function ChatDialog({ onClose }: ChatDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create chat
      let { data: existingChat } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "open")
        .single();

      if (!existingChat) {
        const { data: newChat } = await supabase
          .from("chats")
          .insert([{ user_id: user.id }])
          .select()
          .single();
        existingChat = newChat;
      }

      if (existingChat) {
        setChatId(existingChat.id);
        // Load messages
        const { data: messages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("chat_id", existingChat.id)
          .order("created_at", { ascending: true });

        if (messages) setMessages(messages);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => [...current, newMessage]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    setSending(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("chat_messages").insert([
        {
          chat_id: chatId,
          sender_id: user.id,
          message: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إرسال الرسالة",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === (supabase.auth.getUser() as any).data?.user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_id ===
                  (supabase.auth.getUser() as any).data?.user?.id
                    ? "bg-[#7C9D32] text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString("ar-SA")}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
