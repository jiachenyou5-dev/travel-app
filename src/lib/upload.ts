"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${crypto.randomUUID()}${ext}`;
}

export async function uploadPhoto(formData: FormData): Promise<{
  url: string;
  thumbnailUrl: string;
}> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("未选择文件");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("仅支持 JPEG、PNG、WebP 格式");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("文件大小不能超过 10MB");
  }

  const filename = generateFilename(file.name);
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "photos");

  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadsDir, filename);
  await writeFile(filePath, buffer);

  const url = `/uploads/photos/${filename}`;

  return { url, thumbnailUrl: url };
}

export async function uploadReviewPhotos(
  files: File[]
): Promise<{ url: string; thumbnailUrl: string }[]> {
  const results: { url: string; thumbnailUrl: string }[] = [];

  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;

    const filename = generateFilename(file.name);
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "reviews");

    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/reviews/${filename}`;
    results.push({ url, thumbnailUrl: url });
  }

  return results;
}
