"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { journalSchema } from "@/lib/validators";
import { savePhotos, removeMedia } from "@/lib/media";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJournal(formData: FormData) {
  const user = await requireAuth();

  const data = journalSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
    region: formData.get("region") || undefined,
  });

  const photoFiles = formData.getAll("photos").filter(
    (f): f is File => f instanceof File
  );
  const uploadedPhotos = photoFiles.length > 0
    ? await savePhotos(photoFiles, "journals")
    : [];

  const coverImage = uploadedPhotos.length > 0 ? uploadedPhotos[0].url : null;

  try {
  await prisma.journal.create({
    data: {
      userId: user.id,
      title: data.title,
      content: data.content,
      region: data.region || null,
      coverImage,
      photos: {
        create: uploadedPhotos.map((p, i) => ({
          url: p.url,
          thumbnailUrl: p.thumbnailUrl,
          sortOrder: i,
        })),
      },
    },
  });

  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }
  revalidatePath("/journals");
  revalidatePath("/profile/journals");
  redirect("/profile/journals");
}

export async function updateJournal(journalId: string, formData: FormData) {
  const user = await requireAuth();

  const journal = await prisma.journal.findUnique({
    where: { id: journalId },
    include: { photos: true },
  });
  if (!journal || journal.userId !== user.id) {
    throw new Error("无权编辑此游记");
  }

  const data = journalSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
    region: formData.get("region") || undefined,
  });

  const photoFiles = formData.getAll("photos").filter(
    (f): f is File => f instanceof File
  );
  const uploadedPhotos = photoFiles.length > 0
    ? await savePhotos(photoFiles, "journals")
    : [];

  try {
    await prisma.journal.update({
      where: { id: journalId },
      data: {
        title: data.title, content: data.content, region: data.region || null,
        coverImage: journal.coverImage ?? uploadedPhotos[0]?.url ?? null,
        photos: { create: uploadedPhotos.map((photo, index) => ({ ...photo, sortOrder: journal.photos.length + index })) },
      },
    });
  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }
  revalidatePath(`/journals/${journalId}`);
  revalidatePath("/journals");
  revalidatePath("/profile/journals");
  redirect("/profile/journals");
}

export async function deleteJournal(id: string) {
  const user = await requireAuth();

  const journal = await prisma.journal.findUnique({ where: { id }, include: { photos: true } });
  if (!journal || journal.userId !== user.id) {
    throw new Error("无权删除此游记");
  }

  await prisma.journal.delete({ where: { id } });
  await removeMedia(journal.photos);

  revalidatePath("/journals");
  revalidatePath("/profile/journals");
}
