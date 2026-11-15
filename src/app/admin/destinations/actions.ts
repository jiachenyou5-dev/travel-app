"use server";

import { prisma } from "@/lib/prisma";
import { destinationSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDestination(formData: FormData) {
  await requireAdmin();

  const data = destinationSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    province: formData.get("province") || undefined,
    description: formData.get("description") || undefined,
    country: formData.get("country") || "中国",
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : undefined,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : undefined,
  });

  await prisma.destination.create({ data });

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function updateDestination(id: string, formData: FormData) {
  await requireAdmin();

  const data = destinationSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    province: formData.get("province") || undefined,
    description: formData.get("description") || undefined,
    country: formData.get("country") || "中国",
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : undefined,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : undefined,
  });

  await prisma.destination.update({ where: { id }, data });

  revalidatePath("/destinations");
  revalidatePath(`/destinations/${id}`);
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function deleteDestination(id: string) {
  await requireAdmin();

  const destination = await prisma.destination.findUnique({ where: { id }, include: { _count: { select: { attractions: true, restaurants: true, accommodations: true, displayPhotos: true, favorites: true } } } });
  if (!destination) throw new Error("目的地不存在");
  if (Object.values(destination._count).some(count => count > 0)) {
    throw new Error("该目的地有关联内容，不能直接删除，请先下架以保留数据");
  }
  await prisma.destination.delete({ where: { id } });

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
}

export async function togglePublish(id: string, current: boolean) {
  await requireAdmin();

  await prisma.destination.update({
    where: { id },
    data: { isPublished: !current },
  });

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
}

export async function approveDestination(id: string) {
  await requireAdmin();

  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) throw new Error("目的地不存在");

  await prisma.destination.update({
    where: { id },
    data: { status: "APPROVED", reviewNotes: null },
  });

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations/pending");
}

export async function rejectDestination(id: string, notes: string) {
  await requireAdmin();

  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) throw new Error("目的地不存在");

  await prisma.destination.update({
    where: { id },
    data: { status: "REJECTED", reviewNotes: notes },
  });

  revalidatePath("/admin/destinations/pending");
}
