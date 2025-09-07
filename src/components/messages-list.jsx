"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Search, Archive } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_URL = "http://rastan.shop/api/contact";
const API_KEY =
  "blEd6yeJCk7WCSQpqPqO7qmKiUjCOabOP2TxJDxpyIomO6FegABNM2a7mHLVlyiky7mXJjR46xr9jUKNDkmYFPs7rCBw2n6CfJ0ba0yu785ghsUXDLwoQWv6toDk3ByU";

export function MessagesList({
  onMessageSelect,
  selectedMessageId,
  refreshTrigger,
  messagesCount,
}) {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchMessages() {
      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          headers: { "x-api-key": API_KEY },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // normalize possible shapes
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.messages)) list = data.messages;
        else if (data && Array.isArray(data.data)) list = data.data;
        messagesCount(list.length);
        const normalized = list.map((m) => ({
          _id: m._id || m.id,
          name: m.name || m.email || "(No name)",
          email: m.email || "",
          subject: m.subject || "(No subject)",
          message: m.message || m.body || "",
          preview:
            m.preview || (m.message ? m.message.substring(0, 120) + "..." : ""),
          unread: typeof m.unread === "boolean" ? m.unread : m.read === false,
          category: m.category || "contact",
          priority: m.priority || "normal",
          createdAt: m.createdAt || m.time || null,
        }));

        if (mounted) setMessages(normalized);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        toast.error("Failed to fetch messages", { description: err.message });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMessages();
    return () => (mounted = false);
  }, [refreshTrigger]);

  const safeInitials = (msg) => {
    const source = (msg?.name || msg?.email || "").toString().trim();
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const safeTime = (msg) => {
    if (msg?.createdAt) {
      try {
        return new Date(msg.createdAt).toLocaleString();
      } catch {
        return msg.createdAt;
      }
    }
    return msg?.time || "Unknown";
  };

  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Message deleted");
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessageId === id) onMessageSelect?.(null);
      } else {
        toast.error("Failed to delete message", {
          description: data?.error || "Unknown error",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Network error while deleting message");
    }
  };

  const filteredMessages = messages.filter((message) => {
    const name = (message.name || "").toString().toLowerCase();
    const subject = (message.subject || "").toString().toLowerCase();
    const email = (message.email || "").toString().toLowerCase();

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      subject.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const isUnread = !!message.unread;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unread" && isUnread) ||
      (filterStatus === "read" && !isUnread);

    const matchesCategory =
      filterCategory === "all" || message.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages {loading ? "(Loading...)" : `(${filteredMessages.length})`}
        </CardTitle>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredMessages.length === 0 && !loading ? (
            <div className="p-6 text-center text-muted-foreground">
              No messages.
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  "p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors",
                  selectedMessageId === message._id && "bg-accent",
                  message.unread && "bg-primary/5"
                )}
                onClick={() => onMessageSelect?.(message)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {safeInitials(message)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-sm truncate",
                            message.unread ? "font-semibold" : "font-medium"
                          )}
                        >
                          {message.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{message.category}</span>
                        <span className="ml-2">{safeTime(message)}</span>
                      </div>
                    </div>

                    <p className="text-sm truncate mb-1">{message.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {message.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {message.email}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message._id);
                          }}
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
