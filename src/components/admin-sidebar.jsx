"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  ImageIcon,
  BarChart3,
  Settings,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  activeSection,
  onSectionChange,
  messagesCount,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    {
      id: "messages",
      name: "Messages",
      icon: MessageSquare,
      badge: messagesCount,
    },
    { id: "email", name: "Email", icon: Mail },
    { id: "portfolio", name: "Portfolio", icon: ImageIcon },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // Always expanded on mobile when open
        setIsMobileOpen(false); // Closed by default on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleSectionChange = (section) => {
    onSectionChange(section);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm border shadow-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Card
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-sidebar-border transition-all duration-300 lg:relative lg:z-auto shadow-xl lg:shadow-none",
          isMobile
            ? isMobileOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full w-72"
            : isCollapsed
            ? "w-16"
            : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    VE
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">
                  Video Editor
                </h2>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
            >
              {isMobile ? (
                <X className="h-4 w-4" />
              ) : isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && !isMobile && "justify-center px-2",
                    "h-12 text-sm font-medium"
                  )}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className={cn(
                            "ml-auto text-xs",
                            isActive &&
                              "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground border-sidebar-primary-foreground/30"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {isCollapsed && !isMobile && item.badge && (
                    <div className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
                  )}
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20">
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-200",
                isCollapsed && !isMobile && "justify-center"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center shrink-0 ring-2 ring-sidebar-primary/20">
                <span className="text-sm font-medium text-sidebar-primary-foreground">
                  VE
                </span>
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    Video Editor
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    admin@videoeditor.com
                  </p>
                </div>
              )}
            </div>

            {isMobile && (
              <div className="mt-3 pt-3 border-t border-sidebar-border/50">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                  >
                    Help
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
