"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { MessagesList } from "@/components/messages-list";
import { MessageDetail } from "@/components/message-detail";
import { EmailComposer } from "@/components/email-composer";
import { SentEmails } from "@/components/sent-emails";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { PortfolioEditor } from "@/components/portfolio-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, ImageIcon, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * computeEmailCountAnd30DayChange(messages, now = new Date())
 *
 * messages: array of objects. each object should have a date-like field:
 *   createdAt OR created_at OR time OR timestamp OR date
 *
 * returns:
 * {
 *   total: number,
 *   current30: number,
 *   previous30: number,
 *   diff: number,
 *   changePercent: number|null,
 *   changeLabel: string
 * }
 */
function computeEmailCountAnd30DayChange(messages = [], now = new Date()) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const nowTs = now instanceof Date ? now.getTime() : new Date(now).getTime();

  const startCurrent = nowTs - 30 * ONE_DAY_MS; // (startCurrent, now]
  const startPrevious = nowTs - 60 * ONE_DAY_MS; // (startPrevious, startCurrent]

  let total = 0;
  let current30 = 0;
  let previous30 = 0;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    total += 1;

    const candidate =
      m?.createdAt ??
      m?.created_at ??
      m?.time ??
      m?.timestamp ??
      m?.date ??
      null;

    if (!candidate) continue;

    let ts = null;
    if (candidate instanceof Date) ts = candidate.getTime();
    else if (typeof candidate === "number") ts = candidate;
    else if (typeof candidate === "string") {
      const parsed = Date.parse(candidate);
      if (!isNaN(parsed)) ts = parsed;
    }

    if (ts === null || isNaN(ts)) continue;

    if (ts > startCurrent && ts <= nowTs) {
      current30 += 1;
    } else if (ts > startPrevious && ts <= startCurrent) {
      previous30 += 1;
    }
  }

  const diff = current30 - previous30;

  let changePercent = null;
  let changeLabel = "N/A";

  if (previous30 === 0) {
    if (current30 === 0) {
      changePercent = 0;
      changeLabel = "0.00%";
    } else {
      changePercent = null;
      changeLabel = "+0";
    }
  } else {
    changePercent = ((current30 - previous30) / previous30) * 100;
    changeLabel =
      (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
  }

  return {
    total,
    current30,
    previous30,
    diff,
    changePercent,
    changeLabel,
  };
}

export default function AdminDashboard() {
  const { isSignedIn, user } = useUser();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [totalViews, setTotalViews] = useState(0);
  const [visitorsChange, setVisitorsChange] = useState("0");
  const [showcasedCount, setShowcasedCount] = useState(0);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // email-specific states
  const [messagesCount, setMessagesCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [emailCurrent30, setEmailCurrent30] = useState(0);
  const [emailPrevious30, setEmailPrevious30] = useState(0);
  const [emailChangeLabel, setEmailChangeLabel] = useState("0.00%");

  // API key (move to secure storage / proxy in production)
  const API_KEY =
    "blEd6yeJCk7WCSQpqPqO7qmKiUjCOabOP2TxJDxpyIomO6FegABNM2a7mHLVlyiky7mXJjR46xr9jUKNDkmYFPs7rCBw2n6CfJ0ba0yu785ghsUXDLwoQWv6toDk3ByU";

  const handlePortfolioSave = (item, formData) => {
    const xhr = new XMLHttpRequest();

    let endpoint;
    if (item?.originalId) {
      endpoint = `https://rastan.shop/api/uploads/${
        item.originalCategory || item.category
      }/${item.originalId}`;
    } else {
      endpoint = `https://rastan.shop/api/upload/${item.category}`;
    }

    xhr.open("POST", endpoint);

    xhr.setRequestHeader("x-api-key", API_KEY);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        console.log(`Progress: ${progress}%`);
        if (progress === 100) {
          toast.info("Upload complete, processing...");
        }
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("✅ Success:\n" + xhr.responseText);
        setError(null);

        const isEdit = item?.originalId;
        toast.success(
          `Portfolio item ${isEdit ? "updated" : "created"} successfully!`,
          {
            description: "Your changes have been saved and are now live.",
            duration: 4000,
          }
        );

        setRefreshTrigger((prev) => prev + 1);
        setSelectedPortfolioItem(null);
      } else {
        const errorMessage = `❌ Error ${xhr.status}:\n${xhr.responseText}`;
        setError(errorMessage);
        toast.error("Failed to save portfolio item", {
          description: `Server error (${xhr.status}): Please try again or contact support.`,
          duration: 5000,
        });
      }
    };

    xhr.onerror = function () {
      const errorMessage = "❌ Network Error";
      setError(errorMessage);
      toast.error("Network Error", {
        description:
          "Failed to connect to the server. Please check your internet connection and try again.",
        duration: 5000,
      });
    };

    xhr.ontimeout = function () {
      const errorMessage = "❌ Request Timeout";
      setError(errorMessage);
      toast.error("Request Timeout", {
        description:
          "The upload is taking too long. Please try again with a smaller file or check your connection.",
        duration: 5000,
      });
    };

    xhr.timeout = 30000;
    xhr.send(formData);
  };

  // fetch visitor stats and showcased count (existing logic)
  useEffect(() => {
    async function fetchTotalViews() {
      try {
        const response = await fetch("https://rastan.shop/api/visitors/count");
        if (response.ok) {
          const data = await response.json();
          setTotalViews(Number(data.count ?? 0));
        } else {
          console.error("Failed to fetch total views:", response.status);
          toast.error("Failed to load visitor statistics", {
            description: `Could not fetch total views (Error: ${response.status})`,
          });
        }
      } catch (err) {
        console.error("Error fetching total views:", err);
        toast.error("Connection Error", {
          description:
            "Failed to load visitor statistics. Please refresh the page.",
        });
      }
    }

    async function fetchVisitorsChange() {
      try {
        const response = await fetch("https://rastan.shop/api/visitors/data", {
          headers: {
            "x-api-key": API_KEY,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch change:", response.status);
          toast.error("Failed to load analytics data", {
            description: `Could not fetch visitor trends (Error: ${response.status})`,
          });
          return;
        }

        let data = await response.json();

        if (!Array.isArray(data)) {
          if (Array.isArray(data.data)) {
            data = data.data;
          } else if (Array.isArray(data.visitors)) {
            data = data.visitors;
          } else {
            console.error("Unexpected API response format:", data);
            toast.warning("Data Format Issue", {
              description: "Received unexpected data format from analytics API",
            });
            return;
          }
        }

        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 30);

        const pastData = data.filter((item) => {
          const created = item.createdAt ? new Date(item.createdAt) : null;
          return created && created <= pastDate;
        });

        const pastCount = pastData.length;
        const currentCount = data.length;

        const changeValue = pastCount
          ? (((currentCount - pastCount) / pastCount) * 100).toFixed(2)
          : "0";

        setVisitorsChange(changeValue);
      } catch (err) {
        console.error("Error fetching change:", err);
        toast.error("Analytics Error", {
          description:
            "Failed to load visitor trend data. Please refresh the page.",
        });
      }
    }

    async function fetchShowcasedCount() {
      try {
        const response = await fetch("https://rastan.shop/api/uploads-count");
        if (response.ok) {
          const data = await response.json();
          setShowcasedCount(Number(data.totalCount ?? 0));
        } else {
          console.error("Failed to fetch showcased count:", response.status);
          toast.error("Failed to load portfolio statistics", {
            description: `Could not fetch portfolio count (Error: ${response.status})`,
          });
        }
      } catch (err) {
        console.error("Error fetching showcased count:", err);
        toast.error("Portfolio Error", {
          description:
            "Failed to load portfolio statistics. Please refresh the page.",
        });
      }
    }

    fetchVisitorsChange();
    fetchTotalViews();
    fetchShowcasedCount();
  }, []); // run once

  // fetch contact messages to compute counts and recent messages
  useEffect(() => {
    let mounted = true;

    async function fetchContactMessagesAndStats() {
      try {
        const res = await fetch("https://rastan.shop/api/contact", {
          headers: { "x-api-key": API_KEY, "cache-control": "no-cache" },
        });

        if (!res.ok) {
          console.error("Failed to fetch contacts:", res.status);
          return;
        }

        const data = await res.json();

        // Normalize shape
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.messages)) list = data.messages;
        else if (data && Array.isArray(data.data)) list = data.data;
        else if (data && Array.isArray(data.contacts)) list = data.contacts;

        const normalized = list.map((m) => ({
          _id: m._id || m.id,
          name: m.name || m.email || "(No name)",
          email: m.email || "",
          subject: m.subject || "(No subject)",
          message: m.message || m.body || "",
          preview:
            m.preview || (m.message ? m.message.substring(0, 120) + "..." : ""),
          unread: typeof m.unread === "boolean" ? m.unread : m.read === false,
          priority: m.priority || "normal",
          category: (m.category || "contact").toString().toLowerCase(),
          createdAt: m.createdAt || m.time || m.created_at || null,
        }));

        // compute counts & change for last 30 days
        const stats = computeEmailCountAnd30DayChange(normalized, new Date());
        if (!mounted) return;
        setMessagesCount(stats.total);
        setEmailCurrent30(stats.current30);
        setEmailPrevious30(stats.previous30);
        setEmailChangeLabel(stats.changeLabel);

        // prepare recent top 3 contact messages (category === 'contact')
        const contactsOnly = normalized
          .filter((m) => (m.category || "contact") === "contact")
          .sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta;
          });

        const top3 = contactsOnly.slice(0, 3).map((m) => ({
          id: m._id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          preview: m.preview,
          time: m.createdAt
            ? new Date(m.createdAt).toLocaleString()
            : "Unknown",
          unread: m.unread,
          priority: m.priority,
          category: m.category,
          archived: false,
        }));

        if (mounted) setRecentMessages(top3);
      } catch (err) {
        console.error("Error fetching recent messages:", err);
      }
    }

    fetchContactMessagesAndStats();

    return () => {
      mounted = false;
    };
  }, [refreshTrigger]);

  useEffect(() => {
    if (error) {
      toast.error("An error occurred", {
        description: error.replace(/❌|✅/g, "").trim(),
        duration: 5000,
      });
    }
  }, [error]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be signed in to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleReply = (messageId, reply) => {
    console.log(`Replying to message ${messageId}:`, reply);
    toast.success("Reply sent successfully!", {
      description: "Your response has been sent to the client.",
    });
  };

  const handleArchive = (messageId) => {
    console.log(`Archiving message ${messageId}`);
    toast.success("Message archived", {
      description: "The message has been moved to your archive.",
    });
  };

  const handlePortfolioCancel = () => {
    setSelectedPortfolioItem(null);
  };

  // Stats cards: use dynamic values for Total Emails and change label for emails
  const stats = [
    {
      title: "Total Emails",
      value: messagesCount,
      change: emailChangeLabel,
      icon: MessageSquare,
      color: "text-chart-1",
    },
    {
      title: "Emails Sent",
      value: "89",
      change: "+8%",
      icon: Mail,
      color: "text-chart-2",
    },
    {
      title: "Portfolio Views",
      value: totalViews,
      change: `+${visitorsChange}%`,
      icon: Eye,
      color: "text-chart-3",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "messages":
        return (
          <div
            className={cn(
              "grid gap-6 h-full",
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            <MessagesList
              onMessageSelect={setSelectedMessage}
              selectedMessageId={selectedMessage?._id}
              refreshTrigger={refreshTrigger}
              messagesCount={setMessagesCount}
            />
            {(!isMobile || selectedMessage) && (
              <MessageDetail
                message={selectedMessage}
                onMessageDeleted={(id) => {
                  setSelectedMessage(null);
                  setRefreshTrigger((p) => p + 1);
                }}
                onReplySent={(id) => toast.success("Reply sent")}
              />
            )}
          </div>
        );
      case "email":
        return (
          <Tabs defaultValue="compose" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="compose" className="text-sm">
                Compose
              </TabsTrigger>
              <TabsTrigger value="sent" className="text-sm">
                Sent
              </TabsTrigger>
            </TabsList>
            <TabsContent value="compose" className="space-y-6">
              <EmailComposer />
            </TabsContent>
            <TabsContent value="sent" className="space-y-6">
              <SentEmails />
            </TabsContent>
          </Tabs>
        );
      case "portfolio":
        return (
          <div
            className={cn(
              "grid gap-6 h-full",
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            <PortfolioGallery
              onItemSelect={setSelectedPortfolioItem}
              selectedItemId={selectedPortfolioItem?.id}
              refreshTrigger={refreshTrigger}
            />
            {(!isMobile || selectedPortfolioItem) && (
              <PortfolioEditor
                item={selectedPortfolioItem}
                onCancel={handlePortfolioCancel}
                onSave={handlePortfolioSave}
                setError={setError}
                error={error}
              />
            )}
          </div>
        );
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
                        {stat.title}
                      </CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color} shrink-0`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg lg:text-2xl font-bold">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary">{stat.change}</span> from
                        last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <MessageSquare className="h-5 w-5" />
                    Recent Emails
                  </CardTitle>
                  <CardDescription>
                    Latest client inquiries and messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveSection("messages");
                        setSelectedMessage({
                          _id: message.id,
                          name: message.name,
                          email: message.email,
                          subject: message.subject,
                          message: message.preview,
                          preview: message.preview,
                          time: message.time,
                          unread: message.unread,
                          priority: message.priority,
                          category: message.category,
                        });
                      }}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {(message.name || message.email)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {message.name}
                          </p>
                          {message.unread && (
                            <Badge
                              variant="secondary"
                              className="h-2 w-2 p-0 rounded-full"
                            />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.preview}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Portfolio Performance
                  </CardTitle>
                  <CardDescription>
                    Your portfolio engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-chart-2" />
                      <span className="text-sm">Profile Views</span>
                    </div>
                    <span className="font-semibold">{totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-4 w-4 text-chart-4" />
                      <span className="text-sm">Projects Showcased</span>
                    </div>
                    <span className="font-semibold">
                      {Math.floor(showcasedCount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
              section coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        messagesCount={messagesCount}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={
            activeSection === "dashboard"
              ? "Dashboard Overview"
              : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
          }
          subtitle={
            activeSection === "dashboard"
              ? "Welcome back! Here's what's happening with your portfolio."
              : activeSection === "messages"
              ? "Manage and respond to client messages and inquiries."
              : activeSection === "email"
              ? "Compose professional emails and track your sent communications."
              : activeSection === "portfolio"
              ? "Manage your portfolio showcase and edit project details."
              : undefined
          }
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
