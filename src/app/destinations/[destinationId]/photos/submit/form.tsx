"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitDestinationPhotos } from "@/app/actions/destination-photos";

export function PhotoUploadForm({
  destinationId,
}: {
  destinationId: string;
}) {
  const router = useRouter();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (photoFiles.length === 0) {
      toast.error("请选择照片");
      return;
    }
    setPending(true);
    try {
      const formData = new FormData();
      photoFiles.forEach((f) => formData.append("photos", f));
      await submitDestinationPhotos(destinationId, formData);
      toast.success("照片已上传");
      setPhotoFiles([]);
      setPhotoPreviews([]);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUpload
        onUpload={handleUpload}
        maxFiles={10}
        previews={photoPreviews}
        onRemove={handleRemovePreview}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "上传中..." : "上传照片"}
      </Button>
    </form>
  );
}
