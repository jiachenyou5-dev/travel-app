import sharp from "sharp";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface SavedPhoto {
  url: string;
  thumbnailUrl: string;
}

export function uploadsRoot() {
  return path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads"));
}

export async function removeMedia(photos: { url: string; thumbnailUrl?: string | null }[]) {
  const root = uploadsRoot();
  const urls = new Set(photos.flatMap(photo => [photo.url, photo.thumbnailUrl]).filter((url): url is string => !!url));
  for (const url of urls) {
    if (!url.startsWith("/uploads/")) continue;
    const target = path.resolve(/* turbopackIgnore: true */ root, url.slice("/uploads/".length));
    if (!target.startsWith(root + path.sep)) continue;
    try { await unlink(target); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("[media] cleanup failed", { url });
    }
  }
}

export async function savePhotos(files: File[], subdir: string): Promise<SavedPhoto[]> {
  if (!/^[a-z]+$/.test(subdir)) throw new Error("无效的图片目录");
  if (files.length > 5) throw new Error("每次最多上传 5 张照片");
  if (files.some(file => !(file instanceof File) || file.size === 0 || file.size > 10 * 1024 * 1024)) {
    throw new Error("图片不能为空且每张不能超过 10MB");
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > 20 * 1024 * 1024) throw new Error("图片总大小不能超过 20MB");
  const prepared = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer, { limitInputPixels: 25000000 }).metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format) || (metadata.pages ?? 1) > 1) {
      throw new Error("仅支持有效的静态 JPEG、PNG、WebP 图片");
    }
    const original = await sharp(buffer, { limitInputPixels: 25000000 }).rotate().resize(2400, 2400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    const thumbnail = await sharp(original).resize(480, 480, { fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
    prepared.push({ id: randomUUID(), original, thumbnail });
  }
  const directory = path.join(uploadsRoot(), subdir);
  await mkdir(directory, { recursive: true });
  const results: SavedPhoto[] = [];
  try {
    for (const image of prepared) {
      const photo = { url: `/uploads/${subdir}/${image.id}.webp`, thumbnailUrl: `/uploads/${subdir}/${image.id}-thumb.webp` };
      results.push(photo);
      await writeFile(path.join(directory, `${image.id}.webp`), image.original);
      await writeFile(path.join(directory, `${image.id}-thumb.webp`), image.thumbnail);
    }
    return results;
  } catch (error) {
    await removeMedia(results);
    throw error;
  }
}
