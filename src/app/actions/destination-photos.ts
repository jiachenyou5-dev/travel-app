"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { savePhotos, removeMedia } from "@/lib/media";

export async function submitDestinationPhotos(
  destinationId: string,
  formData: FormData
) {
  const user = await requireAuth();

  const destination = await prisma.destination.findFirst({ where: { id: destinationId, isPublished: true, status: "APPROVED" } });
  if (!destination) throw new Error("目的地不存在或尚未发布");

  const files: File[] = [];
  const entries = formData.getAll("photos");
  for (const entry of entries) {
    if (entry instanceof File) files.push(entry);
  }

  if (files.length === 0) throw new Error("未选择文件");

  const maxSort = await prisma.photo.aggregate({
    where: { destinationId },
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const uploadedPhotos = await savePhotos(files, "destinations");
  try {
    await prisma.photo.createMany({ data: uploadedPhotos.map((photo, index) => ({
      ...photo, sortOrder: nextSort + index, destinationId, uploadedById: user.id,
    })) });
  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }

  revalidatePath(`/destinations/${destinationId}`);
}
