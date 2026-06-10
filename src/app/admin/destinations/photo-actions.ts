"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${crypto.randomUUID()}${ext}`;
}

export async function uploadDestinationPhotos(
  destinationId: string,
  formData: FormData
) {
  await requireAdmin();

  const files: File[] = [];
  const entries = formData.getAll("photos");
  for (const entry of entries) {
    if (entry instanceof File) files.push(entry);
  }

  if (files.length === 0) throw new Error("未选择文件");

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "destinations");
  await mkdir(uploadsDir, { recursive: true });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const maxSort = await prisma.photo.aggregate({
    where: { destinationId },
    _max: { sortOrder: true },
  });
  let nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;

    const filename = generateFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/destinations/${filename}`;
    await prisma.photo.create({
      data: {
        url,
        thumbnailUrl: url,
        sortOrder: nextSort,
        destinationId,
      },
    });
    nextSort++;
  }

  revalidatePath(`/admin/destinations/${destinationId}/edit`);
}

export async function deleteDestinationPhoto(photoId: string) {
  await requireAdmin();

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) throw new Error("照片不存在");

  const filePath = path.join(process.cwd(), "public", photo.url);
  try {
    await unlink(filePath);
  } catch {
    // file might already be gone, ignore
  }

  await prisma.photo.delete({ where: { id: photoId } });

  revalidatePath(`/admin/destinations/${photo.destinationId}/edit`);
}
