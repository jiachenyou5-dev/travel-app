"use server";

import { prisma } from "@/lib/prisma";
import { attractionSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAttraction(
  destinationId: string,
  formData: FormData
) {
  await requireAdmin();

  const data = attractionSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    ticketPrice: formData.get("ticketPrice")
      ? Number(formData.get("ticketPrice"))
      : undefined,
    openingHours: formData.get("openingHours") || undefined,
    website: formData.get("website") || undefined,
    phone: formData.get("phone") || undefined,
    latitude: formData.get("latitude")
      ? Number(formData.get("latitude"))
      : undefined,
    longitude: formData.get("longitude")
      ? Number(formData.get("longitude"))
      : undefined,
  });

  await prisma.attraction.create({
    data: { ...data, destinationId },
  });

  revalidatePath(`/destinations/${destinationId}`);
  revalidatePath("/admin/attractions");
  redirect("/admin/attractions");
}

export async function updateAttraction(id: string, formData: FormData) {
  await requireAdmin();

  const data = attractionSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    ticketPrice: formData.get("ticketPrice")
      ? Number(formData.get("ticketPrice"))
      : undefined,
    openingHours: formData.get("openingHours") || undefined,
    website: formData.get("website") || undefined,
    phone: formData.get("phone") || undefined,
  });

  const updated = await prisma.attraction.update({
    where: { id },
    data,
  });

  revalidatePath(`/destinations/${updated.destinationId}`);
  revalidatePath(`/destinations/${updated.destinationId}/attractions/${id}`);
  revalidatePath("/admin/attractions");
  redirect("/admin/attractions");
}

export async function deleteAttraction(id: string) {
  await requireAdmin();

  const attraction = await prisma.attraction.findUnique({ where: { id } });
  if (!attraction) throw new Error("景点不存在");

  await prisma.attraction.delete({ where: { id } });

  revalidatePath(`/destinations/${attraction.destinationId}`);
  revalidatePath("/admin/attractions");
}

export async function approveAttraction(id: string) {
  await requireAdmin();

  const attraction = await prisma.attraction.findUnique({ where: { id } });
  if (!attraction) throw new Error("景点不存在");

  await prisma.attraction.update({
    where: { id },
    data: { status: "APPROVED", reviewNotes: null },
  });

  revalidatePath(`/destinations/${attraction.destinationId}`);
  revalidatePath("/admin/attractions/pending");
}

export async function rejectAttraction(id: string, notes: string) {
  await requireAdmin();

  const attraction = await prisma.attraction.findUnique({ where: { id } });
  if (!attraction) throw new Error("景点不存在");

  await prisma.attraction.update({
    where: { id },
    data: { status: "REJECTED", reviewNotes: notes },
  });

  revalidatePath("/admin/attractions/pending");
}
