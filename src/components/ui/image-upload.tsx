"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  previews?: { url: string; id: string }[];
  onRemove?: (id: string) => void;
}

export function ImageUpload({
  onUpload,
  maxFiles = 5,
  previews = [],
  onRemove,
}: ImageUploadProps) {
  const [compressing, setCompressing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (previews.length + acceptedFiles.length > maxFiles) {
        toast.error(`最多上传 ${maxFiles} 张照片`);
        return;
      }

      setCompressing(true);
      try {
        const compressed = await Promise.all(
          acceptedFiles.map((file) =>
            imageCompression(file, {
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            })
          )
        );
        onUpload(compressed);
      } catch {
        toast.error("图片压缩失败");
      } finally {
        setCompressing(false);
      }
    },
    [maxFiles, previews.length, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles,
    disabled: compressing,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-input hover:border-border"
        } ${compressing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-muted-foreground/70 mx-auto mb-2" />
        {compressing ? (
          <p className="text-sm text-muted-foreground">压缩中...</p>
        ) : isDragActive ? (
          <p className="text-sm text-primary">释放以上传照片</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              拖拽照片到此处，或点击选择
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              支持 JPEG、PNG、WebP，最多 {maxFiles} 张
            </p>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {previews.map((preview) => (
            <div key={preview.id} className="relative group">
              <img
                src={preview.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg border"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(preview.id)}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageGrid({
  images,
  onView,
}: {
  images: { url: string; altText?: string; id: string }[];
  onView?: (index: number) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground/70">
        <ImageIcon className="w-10 h-10 mx-auto mb-2" />
        <p className="text-sm">暂无照片</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {images.map((img, i) => (
        <button
          key={img.id}
          type="button"
          className="block w-full aspect-square overflow-hidden rounded-lg border hover:opacity-90 transition-opacity"
          onClick={() => onView?.(i)}
        >
          <img
            src={img.url}
            alt={img.altText || ""}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
