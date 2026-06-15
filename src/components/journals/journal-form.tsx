"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { REGIONS } from "@/lib/validators";

interface JournalFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    content?: string;
    region?: string;
  };
  submitLabel?: string;
}

export function JournalForm({
  action,
  defaultValues,
  submitLabel = "发布游记",
}: JournalFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [region, setRegion] = useState(defaultValues?.region ?? "");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<
    { url: string; id: string }[]
  >([]);
  const [pending, setPending] = useState(false);

  function handleUpload(files: File[]) {
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [
      ...prev,
      ...files.map((f) => ({
        url: URL.createObjectURL(f),
        id: `${f.name}-${Date.now()}`,
      })),
    ]);
  }

  function handleRemovePreview(id: string) {
    const idx = photoPreviews.findIndex((p) => p.id === id);
    if (idx === -1) return;
    setPhotoPreviews((prev) => prev.filter((p) => p.id !== id));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("请输入游记标题");
      return;
    }
    if (!content.trim()) {
      toast.error("请输入游记内容");
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    if (region) formData.append("region", region);
    photoFiles.forEach((f) => formData.append("photos", f));

    try {
      await action(formData);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "操作失败，请稍后重试"
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">游记标题</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给你的游记起个标题..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="region">所在地区</Label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
        >
          <option value="">请选择地区（可选）</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="content">正文（支持 Markdown）</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="用 Markdown 写下游记正文...&#10;&#10;## 行程概览&#10;&#10;第一天我们去了...&#10;&#10;![图片描述](图片链接)&#10;&#10;> 旅行小贴士"
          className="mt-1 min-h-64"
        />
        <p className="text-xs text-muted-foreground/70 mt-1">
          支持 Markdown 语法：标题、列表、链接、图片、引用等
        </p>
      </div>

      <div>
        <Label>游记图片</Label>
        <ImageUpload
          onUpload={handleUpload}
          maxFiles={10}
          previews={photoPreviews}
          onRemove={handleRemovePreview}
        />
      </div>

      <Button type="submit" disabled={pending} className="gap-2">
        {pending ? "发布中..." : submitLabel}
      </Button>
    </form>
  );
}
