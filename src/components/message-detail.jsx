"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Clock,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "https://rastan.shop/api/contact";
const API_KEY =
  "blEd6yeJCk7WCSQpqPqO7qmKiUjCOabOP2TxJDxpyIomO6FegABNM2a7mHLVlyiky7mXJjR46xr9jUKNDkmYFPs7rCBw2n6CfJ0ba0yu785ghsUXDLwoQWv6toDk3ByU";

export function MessageDetail({ message, onMessageDeleted, onReplySent }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const emailTemplates = [
    {
      name: "Initial Inquiry Response",
      subject: "Thank you for your interest - Let's discuss your project",
      content: `Hi {name},

Thanks for contacting us. We'd love to learn more about your project...`,
    },
    {
      name: "Project Quote Follow-up",
      subject: "Video Project Proposal - {subject}",
      content: `Hi {name},

Thanks for the details. I've prepared a proposal...`,
    },
    {
      name: "Booking Confirmation",
      subject: "Project Confirmed - Next Steps",
      content: `Hi {name},

Great! Your booking is confirmed. Next steps...`,
    },
  ];

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

  if (!message) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full text-center py-12">
          <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No Message Selected
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select a message from the list to view details and reply.
          </p>
        </CardContent>
      </Card>
    );
  }

  const applyTemplate = (template) => {
    const personalizedContent = template.content
      .replace(/{name}/g, message.name || "")
      .replace(/{subject}/g, message.subject || "");

    setReplySubject(
      template.subject.replace(/{subject}/g, message.subject || "")
    );
    setReplyText(personalizedContent);
    setShowTemplates(false);
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
        onMessageDeleted?.(id);
      } else {
        toast.error("Failed to delete message", { description: data?.error });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting");
    }
  };

  const archiveMessage = async (id) => {
    if (!confirm("Archive this message?")) return;
    try {
      // If you have a real archive endpoint, replace this call.
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Message archived");
        onMessageDeleted?.(id);
      } else {
        toast.error("Failed to archive message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while archiving");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const id = message._id;
      const res = await fetch(`${API_URL}/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          subject: replySubject || `Re: ${message.subject || ""}`,
          message: replyText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Reply sent");
        setReplyText("");
        setReplySubject("");
        setIsReplying(false);
        onReplySent?.(id);
      } else {
        toast.error("Reply failed (backend may not support reply endpoint)", {
          description: data?.error,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while sending reply");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-chart-4";
      case "low":
        return "text-chart-2";
      default:
        return "text-muted-foreground";
    }
  };

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case "booking":
        return "default";
      case "inquiry":
        return "secondary";
      case "support":
        return "outline";
      case "feedback":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 leading-tight">
              {message.subject || "(No subject)"}
            </CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant={getCategoryBadgeVariant(message.category || "contact")}
              >
                {message.category || "Contact Me"}
              </Badge>
              <Badge
                variant="outline"
                className={getPriorityColor(message.priority)}
              >
                {message.priority || "normal"} priority
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => archiveMessage(message._id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMessage(message._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {safeInitials(message)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {message.name || message.email || "(No name)"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {message.email || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {safeTime(message)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.message || "(No message body)"}
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setIsReplying(true);
              setReplySubject(`Re: ${message.subject || ""}`);
            }}
            className="gap-2"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>

        {isReplying && (
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Reply to {message.name || message.email}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-xs"
                >
                  Use Template
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showTemplates && (
                <Card className="border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Email Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {emailTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => applyTemplate(template)}
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {template.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.content.substring(0, 100)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="reply-subject">Subject</Label>
                <Input
                  id="reply-subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Reply subject..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply-message">Message</Label>
                <Textarea
                  id="reply-message"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button onClick={handleReply} disabled={!replyText.trim()}>
                    Send Reply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText("");
                      setReplySubject("");
                      setShowTemplates(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Save Draft
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Schedule Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
