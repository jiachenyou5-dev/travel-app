"use client";

import { useState } from "react";
import { ImageUpload, ImageGrid } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "@/components/ui/clay-icons";
import { uploadDestinationPhotos, deleteDestinationPhoto } from "@/app/admin/destinations/photo-actions";
import { Lightbox } from "@/components/ui/lightbox";
import { useRouter } from "next/navigation";

interface PhotoData {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
}

export function PhotoManager({
  entityId,
  photos,
}: {
  entityId: string;
  photos: PhotoData[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<{ url: string; id: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

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

  async function handleUploadAll() {
    if (photoFiles.length === 0) return;
    setPending(true);
    try {
      const formData = new FormData();
      photoFiles.forEach((f) => formData.append("photos", f));
      await uploadDestinationPhotos(entityId, formData);
      setPhotoFiles([]);
      setPhotoPreviews([]);
      toast.success("照片已上传");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(photoId: string) {
    try {
      await deleteDestinationPhoto(photoId);
      toast.success("照片已删除");
      router.refresh();
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">照片管理</h3>
        <ImageUpload
          onUpload={handleUpload}
          maxFiles={10}
          previews={photoPreviews}
          onRemove={handleRemovePreview}
        />
        {photoFiles.length > 0 && (
          <Button
            onClick={handleUploadAll}
            disabled={pending}
            className="mt-3"
            size="sm"
          >
            {pending ? "上传中..." : `上传 ${photoFiles.length} 张照片`}
          </Button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
          已有照片 ({photos.length})
        </h4>
        {photos.length > 0 ? (
          <>
            <ImageGrid
              images={photos.map((p) => ({
                id: p.id,
                url: p.thumbnailUrl || p.url,
              }))}
              onView={setLightboxIndex}
            />
            <Lightbox
              images={photos.map((p) => ({ url: p.url }))}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxIndex(-1)}
              onPrev={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + photos.length) % photos.length
                )
              }
              onNext={() =>
                setLightboxIndex((lightboxIndex + 1) % photos.length)
              }
            />
            <div className="mt-2 space-y-1">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm text-muted-foreground py-1 px-2 rounded hover:bg-muted"
                >
                  <span className="truncate flex-1">{p.url}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground/70">暂无照片</p>
        )}
      </div>
    </div>
  );
}
