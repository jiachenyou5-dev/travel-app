"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { savePhotos, removeMedia } from "@/lib/media";

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

  const maxSort = await prisma.photo.aggregate({
    where: { destinationId },
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const uploadedPhotos = await savePhotos(files, "destinations");
  try {
    await prisma.photo.createMany({ data: uploadedPhotos.map((photo, index) => ({
      ...photo, sortOrder: nextSort + index, destinationId,
    })) });
  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }

  revalidatePath(`/admin/destinations/${destinationId}/edit`);
}

export async function deleteDestinationPhoto(photoId: string) {
  await requireAdmin();

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) throw new Error("照片不存在");

  await prisma.photo.delete({ where: { id: photoId } });

  await removeMedia([photo]);
  revalidatePath(`/destinations/${photo.destinationId}`);
  revalidatePath(`/admin/destinations/${photo.destinationId}/edit`);
}
