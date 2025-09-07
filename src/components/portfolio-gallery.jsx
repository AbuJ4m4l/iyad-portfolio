// components/PortfolioGallery.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
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
  ImageIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PortfolioGallery({
  onItemSelect,
  selectedItemId,
  refreshTrigger, // This will trigger refreshes
}) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter items based on search and filter criteria
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Fetch items from API
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const categories = [
      "video-editing",
      "motion-graphics",
      "shorts",
      "thumbnail",
    ];
    let allItems = [];

    try {
      for (const cat of categories) {
        try {
          const res = await fetch(`http://localhost:5000/api/uploads/${cat}`);
          if (!res.ok) {
            console.warn(`Failed to fetch category ${cat}: ${res.status}`);
            continue;
          }

          const data = await res.json();

          if (!data.folders || !Array.isArray(data.folders)) {
            console.warn(`Invalid data structure for category ${cat}:`, data);
            continue;
          }

          data.folders.forEach((folder) => {
            const files = folder.files || [];
            if (files.length === 0) return;

            // Find files by name patterns, fallback to position
            const afterFile =
              files.find((f) => /after/i.test(f.filename)) || files[0];
            const beforeFile =
              files.find((f) => /before/i.test(f.filename)) || files[1] || null;
            const thumbnailFile =
              files.find((f) => /thumb|thumbnail/i.test(f.filename)) ||
              files[2] ||
              files.find((f) => /\.(jpe?g|png|webp|gif)$/i.test(f.filename)) ||
              null;

            const isVideo = /\.(mp4|mov|mkv|webm|avi)$/i.test(
              afterFile.filename
            );

            // Try to parse timestamp from folder name (e.g., 1234567890_xyz)
            let date = new Date();
            const tsMatch = /^(\d{10,13})_/.exec(folder.folder);
            if (tsMatch) {
              let ts = Number(tsMatch[1]);
              if (tsMatch[1].length === 10) ts = ts * 1000; // Convert to milliseconds
              const parsed = new Date(ts);
              if (!isNaN(parsed.getTime())) date = parsed;
            }

            allItems.push({
              id: folder.folder, // Use folder name as ID
              category: cat,
              type: isVideo ? "video" : "image",
              files: files, // Keep raw files if needed
              after: afterFile.url,
              before: beforeFile ? beforeFile.url : null,
              thumbnail: thumbnailFile ? thumbnailFile.url : afterFile.url, // Fallback to after file
              date: date.toISOString(),
              folderName: folder.folder, // Keep folder name for reference
            });
          });
        } catch (error) {
          console.error(`Error fetching ${cat}:`, error);
          toast.error(`Failed to load ${cat} items`, {
            description: `Error: ${error.message}`,
            duration: 3000,
          });
        }
      }

      // Sort by date (newest first)
      allItems.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setItems(allItems);

      if (allItems.length > 0) {
        toast.success(`Loaded ${allItems.length} portfolio items`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error in fetchItems:", error);
      toast.error("Failed to load portfolio", {
        description: "Please check your connection and try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch items on mount and when refreshTrigger changes
  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshTrigger]);

  // Handle item deletion
  const handleDeleteItem = async (itemId, itemCategory) => {
    if (
      !confirm(
        "Are you sure you want to delete this portfolio item? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/uploads/${itemCategory}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key":
              "blEd6yeJCk7WCSQpqPqO7qmKiUjCOabOP2TxJDxpyIomO6FegABNM2a7mHLVlyiky7mXJjR46xr9jUKNDkmYFPs7rCBw2n6CfJ0ba0yu785ghsUXDLwoQWv6toDk3ByU",
          },
        }
      );

      if (response.ok) {
        // Remove item from local state immediately for better UX
        setItems((prev) => prev.filter((item) => item.id !== itemId));

        // Clear selection if deleted item was selected
        if (selectedItemId === itemId) {
          onItemSelect(null);
        }

        toast.success("Portfolio item deleted successfully", {
          duration: 3000,
        });
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete portfolio item", {
        description: error.message,
        duration: 5000,
      });
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchItems();
  };

  // Handle creating new item
  const handleCreateNew = () => {
    onItemSelect(null); // Clear selection to show create form
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Portfolio Gallery ({filteredItems.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search portfolio items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="motion-graphics">Motion Graphics</SelectItem>
                <SelectItem value="video-editing">Video Editing</SelectItem>
                <SelectItem value="shorts">Shorts</SelectItem>
                <SelectItem value="thumbnail">Thumbnail</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-12">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 opacity-50 animate-spin" />
              <p>Loading portfolio items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No portfolio items found matching your criteria.</p>
              {items.length === 0 && (
                <Button
                  variant="outline"
                  onClick={handleCreateNew}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create your first portfolio item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg group",
                    selectedItemId === item.id && "ring-2 ring-primary"
                  )}
                  onClick={() => onItemSelect(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5000${
                        item.thumbnail || item.after
                      }`}
                      alt="Portfolio thumbnail"
                      className="w-full h-48 object-cover rounded-t-lg transition-transform group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to after image if thumbnail fails
                        if (
                          e.target.src.includes(item.thumbnail) &&
                          item.after !== item.thumbnail
                        ) {
                          e.target.src = `http://localhost:5000${item.after}`;
                        }
                      }}
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/70 rounded-full p-3">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemSelect(item);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id, item.category);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category === "video-editing"
                            ? "Video Editing"
                            : item.category === "thumbnail"
                            ? "Thumbnail"
                            : item.category === "motion-graphics"
                            ? "Motion Graphics"
                            : item.category === "shorts"
                            ? "Shorts"
                            : "Portfolio"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          ID: {item.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
