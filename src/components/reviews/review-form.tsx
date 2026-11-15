"use client";

import { useId, useState } from "react";
import { StarRatingInput } from "@/components/ui/star-rating";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ReviewFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    rating?: number;
    title?: string;
    content?: string;
    visitDate?: string;
  };
  submitLabel?: string;
  allowPhotos?: boolean;
}

export function ReviewForm({
  action,
  defaultValues,
  submitLabel = "发表评论",
  allowPhotos = true,
}: ReviewFormProps) {
  const formId = useId();
  const [rating, setRating] = useState(defaultValues?.rating || 0);
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [content, setContent] = useState(defaultValues?.content || "");
  const [visitDate, setVisitDate] = useState(defaultValues?.visitDate || "");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<
    { url: string; id: string }[]
  >([]);
  const [pending, setPending] = useState(false);

  function handleUpload(files: File[]) {
    const newPreviews = files.map((file, i) => ({
      url: URL.createObjectURL(file),
      id: `${Date.now()}-${i}`,
    }));
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  }

  function handleRemovePreview(id: string) {
    const idx = photoPreviews.findIndex((p) => p.id === id);
    if (idx >= 0) {
      setPhotoPreviews((prev) => prev.filter((p) => p.id !== id));
      setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("请评分");
      return;
    }
    if (!content.trim()) {
      toast.error("请输入评论内容");
      return;
    }

    setPending(true);
    try {
      const formData = new FormData();
      formData.set("rating", String(rating));
      formData.set("title", title.trim());
      formData.set("content", content.trim());
      if (visitDate) formData.set("visitDate", visitDate);
      photoFiles.forEach((file) => formData.append("photos", file));

      await action(formData);
      toast.success(submitLabel + "成功");
      setRating(0);
      setTitle("");
      setContent("");
      setVisitDate("");
      setPhotoFiles([]);
      setPhotoPreviews([]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "提交失败，请稍后再试"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="mb-1 block">评分</Label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <Label htmlFor={`${formId}-review-title`} className="mb-1 block">
          标题（可选）
        </Label>
        <Input
          id={`${formId}-review-title`}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="一句话概括你的体验"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor={`${formId}-review-content`} className="mb-1 block">
          评论内容
        </Label>
        <Textarea
          id={`${formId}-review-content`}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的旅行体验..."
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground/70 mt-1">
          {content.length}/2000
        </p>
      </div>

      <div>
        <Label htmlFor={`${formId}-review-date`} className="mb-1 block">
          到访日期（可选）
        </Label>
        <Input
          id={`${formId}-review-date`}
          name="visitDate"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />
      </div>

      {allowPhotos && <div>
        <Label className="mb-1 block">照片（可选）</Label>
        <ImageUpload
          onUpload={handleUpload}
          previews={photoPreviews}
          onRemove={handleRemovePreview}
          maxFiles={5}
        />
      </div>}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "提交中..." : submitLabel}
      </Button>
    </form>
  );
}
