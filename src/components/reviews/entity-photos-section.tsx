"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbox } from "@/components/ui/lightbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteDestinationPhoto } from "@/app/admin/destinations/photo-actions";
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

interface EntityPhotosSectionProps {
  photos: Photo[];
  // 管理员标识：仅管理员可见删除按钮
  isAdmin?: boolean;
  // 删除接口预留：传入 destinationId 用于构造删除请求
  destinationId?: string;
}

export function EntityPhotosSection({
  photos,
  isAdmin = false,
  destinationId,
}: EntityPhotosSectionProps) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  // 正在删除中的照片 ID，用于 loading 态
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // 控制确认弹窗开关
  const [confirmId, setConfirmId] = useState<string | null>(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">照片 ({photos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground/70">
            <p className="text-sm">暂无照片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {photos.map((img, i) => (
              <div key={img.id} className="relative group">
                {/* 照片缩略图 */}
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

                {/* 删除按钮：仅管理员可见，hover 时显示 */}
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
                            <svg
                              className="animate-spin size-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
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
