"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

type EntityType = "attraction" | "restaurant" | "accommodation";

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${crypto.randomUUID()}${ext}`;
}

/**
 * 通用实体照片上传：支持景点、美食、住宿
 */
export async function uploadEntityPhotos(
  entityType: EntityType,
  entityId: string,
  formData: FormData
) {
  await requireAdmin();

  const files: File[] = [];
  const entries = formData.getAll("photos");
  for (const entry of entries) {
    if (entry instanceof File) files.push(entry);
  }
  if (files.length === 0) throw new Error("未选择文件");

  const uploadsDir = path.join(process.cwd(), "public", "uploads", `${entityType}s`);
  await mkdir(uploadsDir, { recursive: true });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  // 获取当前最大 sortOrder
  const maxSort = await prisma.photo.aggregate({
    where: { [entityType === "attraction" ? "attractionId" : entityType === "restaurant" ? "restaurantId" : "accommodationId"]: entityId },
    _max: { sortOrder: true },
  });
  let nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const idField =
    entityType === "attraction"
      ? "attractionId"
      : entityType === "restaurant"
        ? "restaurantId"
        : "accommodationId";

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;

    const filename = generateFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/${entityType}s/${filename}`;
    await prisma.photo.create({
      data: {
        url,
        thumbnailUrl: url,
        sortOrder: nextSort,
        [idField]: entityId,
      },
    });
    nextSort++;
  }

  // 找到对应的 destinationId 用于 revalidate
  if (entityType === "attraction") {
    const attr = await prisma.attraction.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (attr) revalidatePath(`/destinations/${attr.destinationId}/attractions/${entityId}`);
  } else if (entityType === "restaurant") {
    const rest = await prisma.restaurant.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (rest) revalidatePath(`/destinations/${rest.destinationId}/restaurants/${entityId}`);
  } else {
    const acc = await prisma.accommodation.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (acc) revalidatePath(`/destinations/${acc.destinationId}/accommodations/${entityId}`);
  }
}
