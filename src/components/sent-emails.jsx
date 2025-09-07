"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Search,
  Eye,
  Reply,
  Forward,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockSentEmails = [
  {
    id: 1,
    to: "sarah@company.com",
    subject: "Wedding Videography Packages & Pricing",
    preview:
      "Thank you for your interest in our wedding videography services...",
    sentTime: "2 hours ago",
    status: "opened",
    priority: "high",
    category: "wedding",
    openCount: 3,
    lastOpened: "1 hour ago",
  },
  {
    id: 2,
    to: "marcus@techstartup.com",
    subject: "Corporate Video Production Proposal",
    preview: "Thank you for considering our video production services...",
    sentTime: "5 hours ago",
    status: "replied",
    priority: "high",
    category: "corporate",
    openCount: 2,
    lastOpened: "3 hours ago",
  },
  {
    id: 3,
    to: "elena@creativestudio.com",
    subject: "Thank you for your interest - Let's discuss your project",
    preview: "Thank you for reaching out about your video project...",
    sentTime: "1 day ago",
    status: "delivered",
    priority: "normal",
    category: "inquiry",
    openCount: 1,
    lastOpened: "18 hours ago",
  },
  {
    id: 4,
    to: "david@nonprofitorg.org",
    subject: "Documentary Project - Special Pricing Available",
    preview:
      "I'm excited about your documentary project and would love to help...",
    sentTime: "2 days ago",
    status: "opened",
    priority: "medium",
    category: "nonprofit",
    openCount: 4,
    lastOpened: "6 hours ago",
  },
  {
    id: 5,
    to: "amanda@luxuryevents.com",
    subject: "Luxury Event Coverage - Premium Package Details",
    preview: "Thank you for considering us for your luxury gala coverage...",
    sentTime: "3 days ago",
    status: "delivered",
    priority: "high",
    category: "events",
    openCount: 0,
  },
  {
    id: 6,
    to: "james@filmproduction.com",
    subject: "Feature Film Collaboration - Availability Confirmed",
    preview:
      "I'm thrilled about the opportunity to work on your feature film...",
    sentTime: "4 days ago",
    status: "replied",
    priority: "normal",
    category: "film",
    openCount: 2,
    lastOpened: "2 days ago",
  },
  {
    id: 7,
    to: "lisa@realestategroup.com",
    subject: "Real Estate Video Package - Monthly Contract Proposal",
    preview:
      "I'm excited to propose a comprehensive video solution for your listings...",
    sentTime: "1 week ago",
    status: "opened",
    priority: "medium",
    category: "real-estate",
    openCount: 5,
    lastOpened: "2 days ago",
  },
  {
    id: 8,
    to: "robert@sportsclub.com",
    subject: "Sports Event Coverage - Tournament Availability",
    preview:
      "Thank you for your interest in professional sports videography...",
    sentTime: "1 week ago",
    status: "delivered",
    priority: "low",
    category: "sports",
    openCount: 1,
    lastOpened: "5 days ago",
  },
  {
    id: 9,
    to: "michelle@fashionbrand.com",
    subject: "Fashion Campaign Video - Creative Concept Proposal",
    preview:
      "I'm excited about your spring collection campaign and have some creative ideas...",
    sentTime: "2 weeks ago",
    status: "bounced",
    priority: "medium",
    category: "fashion",
    openCount: 0,
  },
  {
    id: 10,
    to: "alex@techconference.com",
    subject: "Conference Documentation - Comprehensive Coverage Plan",
    preview:
      "Thank you for considering us for your tech conference documentation...",
    sentTime: "2 weeks ago",
    status: "scheduled",
    priority: "normal",
    category: "conference",
    openCount: 0,
  },
];

export function SentEmails() {
  const [emails, setEmails] = useState(mockSentEmails);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || email.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || email.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-chart-2" />;
      case "opened":
        return <Eye className="h-4 w-4 text-chart-1" />;
      case "replied":
        return <Reply className="h-4 w-4 text-primary" />;
      case "bounced":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-chart-4" />;
      default:
        return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-chart-2";
      case "opened":
        return "text-chart-1";
      case "replied":
        return "text-primary";
      case "bounced":
        return "text-destructive";
      case "scheduled":
        return "text-chart-4";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-destructive";
      case "medium":
        return "bg-chart-4";
      case "low":
        return "bg-chart-2";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Sent Emails ({filteredEmails.length})
        </CardTitle>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sent emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="film">Film</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No sent emails found matching your criteria.
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {email.to
                        .split("@")[0]
                        .split(".")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {email.to}
                        </p>
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            getPriorityColor(email.priority)
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(email.status)}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getStatusColor(email.status)
                          )}
                        >
                          {email.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-foreground truncate mb-1">
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {email.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Sent {email.sentTime}</span>
                        {email.openCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {email.openCount} opens
                          </span>
                        )}
                        {email.lastOpened && (
                          <span>Last opened {email.lastOpened}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Forward className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
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
