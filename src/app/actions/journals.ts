"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { journalSchema } from "@/lib/validators";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import crypto from "crypto";

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${crypto.randomUUID()}${ext}`;
}

async function savePhotos(
  files: File[],
  subdir: string
): Promise<{ url: string; thumbnailUrl: string }[]> {
  const results: { url: string; thumbnailUrl: string }[] = [];
  const uploadsDir = path.join(process.cwd(), "public", "uploads", subdir);

  await mkdir(uploadsDir, { recursive: true });

  for (const file of files) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;

    const filename = generateFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/${subdir}/${filename}`;
    results.push({ url, thumbnailUrl: url });
  }
  return results;
}

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

  if (uploadedPhotos.length > 0) {
    await prisma.journalPhoto.createMany({
      data: uploadedPhotos.map((p, i) => ({
        journalId,
        url: p.url,
        thumbnailUrl: p.thumbnailUrl,
        sortOrder: (journal.photos?.length ?? 0) + i,
      })),
    });
  }

  await prisma.journal.update({
    where: { id: journalId },
    data: {
      title: data.title,
      content: data.content,
      region: data.region || null,
    },
  });

  revalidatePath("/journals");
  revalidatePath("/profile/journals");
  redirect("/profile/journals");
}

export async function deleteJournal(id: string) {
  const user = await requireAuth();

  const journal = await prisma.journal.findUnique({ where: { id } });
  if (!journal || journal.userId !== user.id) {
    throw new Error("无权删除此游记");
  }

  await prisma.journal.delete({ where: { id } });

  revalidatePath("/journals");
  revalidatePath("/profile/journals");
}
