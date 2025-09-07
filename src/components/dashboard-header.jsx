"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Bell,
  Plus,
  Filter,
  MoreVertical,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardHeader({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showAddButton = false,
  onAddClick,
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 lg:line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile search toggle */}
          {showSearch && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Add button - responsive sizing */}
          {showAddButton && (
            <Button onClick={onAddClick} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="lg:hidden bg-transparent"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          <div className="hidden lg:flex items-center gap-2"></div>
        </div>
      </div>

      {showSearch && (
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-200",
            showMobileSearch ? "flex" : "hidden lg:flex"
          )}
        >
          <div className="relative flex-1 max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent shrink-0"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      )}

      {showMobileMenu && (
        <Card className="lg:hidden absolute top-full right-4 mt-2 w-48 z-50 shadow-lg border">
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
