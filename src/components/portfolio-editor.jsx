"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress as ProgressUI } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";

export function PortfolioEditor({ item, onSave, onCancel, setError }) {
  const [formData, setFormData] = useState({
    id: null,
    originalId: null,
    originalCategory: "",
    category: "",
    type: "video",
    after: "",
    before: "",
    thumbnail: "",
    date: Date.now(),
  });

  const [afterFile, setAfterFile] = useState(null);
  const [beforeFile, setBeforeFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const UPLOAD_API_KEY =
    process.env.NEXT_PUBLIC_UPLOAD_API_KEY ||
    "blEd6yeJCk7WCSQpqPqO7qmKiUjCOabOP2TxJDxpyIomO6FegABNM2a7mHLVlyiky7mXJjR46xr9jUKNDkmYFPs7rCBw2n6CfJ0ba0yu785ghsUXDLwoQWv6toDk3ByU";

  const UPLOAD_BASE_URL =
    process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id ?? null,
        originalId: item.id ?? null, // Use item.id as originalId (which is the folder name)
        originalCategory: item.category ?? "",
        category: item.category ?? "",
        type: item.type ?? "video",
        after: item.after ?? "",
        before: item.before ?? "",
        thumbnail: item.thumbnail ?? "",
        date: item.date ?? Date.now(),
      });
      setAfterFile(null);
      setBeforeFile(null);
      setThumbnailFile(null);
      setProgress(0);
      setStatus("");
      setError && setError(null);
    } else {
      setFormData({
        id: null,
        originalId: null,
        originalCategory: "",
        category: "",
        type: "video",
        after: "",
        before: "",
        thumbnail: "",
        date: Date.now(),
      });
      setAfterFile(null);
      setBeforeFile(null);
      setThumbnailFile(null);
      setProgress(0);
      setStatus("");
      setError && setError(null);
    }
  }, [item, setError]);

  const handleChange = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const onFileChange = (setter) => (e) => {
    const f = e.target.files && e.target.files[0];
    setter(f || null);
  };

  // use base URL from env (works for preview + saved urls)
  const previewSrc = (file, url) => {
    if (file) return URL.createObjectURL(file);
    if (url) {
      return url.startsWith("http") ? url : `${UPLOAD_BASE_URL}${url}`;
    }
    return null;
  };

  const handleSave = async () => {
    setError && setError(null);

    if (!formData.category) {
      const errorMsg = "You must select a category before saving.";
      setError && setError(errorMsg);
      toast.error("Validation Error", {
        description: errorMsg,
        duration: 3000,
      });
      return;
    }

    const anyFileSelected = afterFile || beforeFile || thumbnailFile;

    // If no files selected and this is just a category change for existing item
    if (!anyFileSelected && item) {
      setIsSaving(true);
      try {
        const updated = {
          ...formData,
          id: formData.id ?? `${formData.category}_${Date.now()}`,
        };

        // Create FormData with just the category change
        const fd = new FormData();
        if (formData.category !== formData.originalCategory) {
          fd.append("newCategory", formData.category);
        }

        // Call onSave with the updated item and FormData
        onSave && onSave(updated, fd);
        setIsSaving(false);
      } catch (err) {
        setIsSaving(false);
        const errorMsg = err.message || "Error saving item";
        setError && setError(errorMsg);
        toast.error("Save Error", {
          description: errorMsg,
          duration: 5000,
        });
      }
      return;
    }

    // Handle file uploads
    setStatus("uploading");
    setIsSaving(true);
    setProgress(0);

    const fd = new FormData();
    if (afterFile) fd.append("after", afterFile);
    if (beforeFile) fd.append("before", beforeFile);
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

    const category = formData.category;
    const isEdit = !!formData.originalId;

    if (isEdit) {
      // For edits, we need to handle category changes
      const srcCategory = formData.originalCategory || category;
      const folderName = formData.originalId;
      fd.append("videoId", folderName);

      if (formData.category !== srcCategory) {
        fd.append("newCategory", formData.category);
      }
    }

    try {
      // Prepare the item for onSave callback
      const updatedItem = {
        ...formData,
        id: formData.id ?? `${formData.category}_${Date.now()}`,
        originalId: formData.originalId ?? formData.id,
        originalCategory: formData.originalCategory || formData.category,
      };

      setStatus("done");
      setProgress(100);

      // Call onSave with the item and FormData - let parent handle the actual upload
      onSave && onSave(updatedItem, fd);
      setIsSaving(false);
    } catch (err) {
      setStatus("error");
      const errorMsg = err.message || "Upload failed";
      setError && setError(errorMsg);
      toast.error("Upload Error", {
        description: errorMsg,
        duration: 5000,
      });
      setIsSaving(false);
    }
  };

  const clearFile = (setter) => () => {
    setter(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>
            {item ? "Edit Portfolio Item" : "Create New Portfolio Item"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : item ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => handleChange("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thumbnail">Thumbnail</SelectItem>
              <SelectItem value="video-editing">Video Editing</SelectItem>
              <SelectItem value="motion-graphics">Motion Graphics</SelectItem>
              <SelectItem value="shorts">Shorts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(v) => handleChange("type", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <Label>Thumbnail (اختياري)</Label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange(setThumbnailFile)}
            />
            {thumbnailFile && (
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                onClick={clearFile(setThumbnailFile)}
              >
                <X className="inline-block h-4 w-4" /> remove
              </button>
            )}
          </div>
          {(thumbnailFile || formData.thumbnail) && (
            <img
              src={previewSrc(thumbnailFile, formData.thumbnail)}
              alt="thumbnail preview"
              className="w-full h-40 object-cover rounded-lg border mt-2"
            />
          )}
        </div>

        {/* Before */}
        <div className="space-y-2">
          <Label>Before (مطلوب عند رفع ملفات)</Label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange(setBeforeFile)}
            />
            {beforeFile && (
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                onClick={clearFile(setBeforeFile)}
              >
                <X className="inline-block h-4 w-4" /> remove
              </button>
            )}
          </div>
          {beforeFile ? (
            beforeFile.type.startsWith("video/") ? (
              <video
                src={previewSrc(beforeFile)}
                controls
                className="w-full h-48 rounded-lg border mt-2"
              />
            ) : (
              <img
                src={previewSrc(beforeFile)}
                className="w-full h-40 object-cover rounded-lg border mt-2"
              />
            )
          ) : formData.before ? (
            formData.before.endsWith(".mp4") ? (
              <video
                src={
                  formData.before.startsWith("http")
                    ? formData.before
                    : `${UPLOAD_BASE_URL}${formData.before}`
                }
                controls
                className="w-full h-48 rounded-lg border mt-2"
              />
            ) : (
              <img
                src={
                  formData.before.startsWith("http")
                    ? formData.before
                    : `${UPLOAD_BASE_URL}${formData.before}`
                }
                className="w-full h-40 object-cover rounded-lg border mt-2"
              />
            )
          ) : null}
        </div>

        {/* After */}
        <div className="space-y-2">
          <Label>After (مطلوب عند رفع ملفات)</Label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange(setAfterFile)}
            />
            {afterFile && (
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                onClick={clearFile(setAfterFile)}
              >
                <X className="inline-block h-4 w-4" /> remove
              </button>
            )}
          </div>
          {afterFile ? (
            afterFile.type.startsWith("video/") ? (
              <video
                src={previewSrc(afterFile)}
                controls
                className="w-full h-48 rounded-lg border mt-2"
              />
            ) : (
              <img
                src={previewSrc(afterFile)}
                className="w-full h-40 object-cover rounded-lg border mt-2"
              />
            )
          ) : formData.after ? (
            formData.after.endsWith(".mp4") ? (
              <video
                src={
                  formData.after.startsWith("http")
                    ? formData.after
                    : `${UPLOAD_BASE_URL}${formData.after}`
                }
                controls
                className="w-full h-48 rounded-lg border mt-2"
              />
            ) : (
              <img
                src={
                  formData.after.startsWith("http")
                    ? formData.after
                    : `${UPLOAD_BASE_URL}${formData.after}`
                }
                className="w-full h-40 object-cover rounded-lg border mt-2"
              />
            )
          ) : null}
        </div>

        {status === "uploading" && (
          <div className="space-y-1">
            <div className="text-xs">Uploading... {progress}%</div>
            <ProgressUI value={progress} className="w-[60%]" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
