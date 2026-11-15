"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lightbox } from "@/components/ui/lightbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Upload, Loader2 } from "@/components/ui/clay-icons";
import { deleteDestinationPhoto } from "@/app/admin/destinations/photo-actions";
import { uploadEntityPhotos } from "@/app/actions/entity-photos";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Photo {
  id: string;
  url: string;
  altText?: string | null;
}

type EntityType = "attraction" | "restaurant" | "accommodation";

interface EntityPhotosSectionProps {
  photos: Photo[];
  isAdmin?: boolean;
  destinationId?: string;
  entityType?: EntityType;
  entityId?: string;
}

export function EntityPhotosSection({
  photos,
  isAdmin = false,
  entityType,
  entityId,
}: EntityPhotosSectionProps) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDelete(photoId: string) {
    setConfirmId(null);
    setDeletingId(photoId);
    try {
      await deleteDestinationPhoto(photoId);
      toast.success("照片已删除");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败，请稍后重试");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !entityType || !entityId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("photos", f));
      await uploadEntityPhotos(entityType, entityId, formData);
      toast.success("照片上传成功");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">照片 ({photos.length})</CardTitle>
        {isAdmin && entityType && entityId && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "上传中..." : "上传照片"}
            </button>
          </>
        )}
      </CardHeader>
      <CardContent>
        {photos.length === 0 && !uploading ? (
          <div className="text-center py-8 text-muted-foreground/70">
            <p className="text-sm">暂无照片</p>
            {isAdmin && (
              <p className="text-xs mt-1">点击右上角「上传照片」添加</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {photos.map((img, i) => (
              <div key={img.id} className="relative group">
                <button
                  type="button"
                  className="block w-full aspect-square overflow-hidden rounded-lg border hover:opacity-90 transition-opacity"
                  onClick={() => setLightboxIndex(i)}
                >
                  <img
                    src={img.url}
                    alt={img.altText || ""}
                    className="w-full h-full object-cover"
                  />
                </button>

                {isAdmin && (
                  <AlertDialog
                    open={confirmId === img.id}
                    onOpenChange={(open) => {
                      if (!open) setConfirmId(null);
                    }}
                  >
                    <AlertDialogTrigger
                      render={
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmId(img.id);
                          }}
                          disabled={deletingId === img.id}
                          className="absolute top-1.5 right-1.5 size-7 flex items-center justify-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 disabled:opacity-50"
                          title="删除照片"
                        >
                          {deletingId === img.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      }
                    />

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除这张照片吗？删除后无法恢复。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => handleDelete(img.id)}
                        >
                          确认删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        )}

        <Lightbox
          images={photos.map((p) => ({
            url: p.url,
            altText: p.altText || undefined,
          }))}
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
      </CardContent>
    </Card>
  );
}
