"use server";

import { prisma } from "@/lib/prisma";
import { accommodationSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAccommodation(
  destinationId: string,
  formData: FormData
) {
  await requireAdmin();

  const data = accommodationSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    accommodationType: formData.get("accommodationType") || undefined,
    priceRange: formData.get("priceRange") || undefined,
    starRating: formData.get("starRating")
      ? Number(formData.get("starRating"))
      : undefined,
    amenities: formData.get("amenities") || undefined,
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
    latitude: formData.get("latitude")
      ? Number(formData.get("latitude"))
      : undefined,
    longitude: formData.get("longitude")
      ? Number(formData.get("longitude"))
      : undefined,
  });

  await prisma.accommodation.create({
    data: { ...data, destinationId },
  });

  revalidatePath(`/destinations/${destinationId}`);
  revalidatePath("/admin/accommodations");
  redirect("/admin/accommodations");
}

export async function updateAccommodation(id: string, formData: FormData) {
  await requireAdmin();

  const data = accommodationSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    accommodationType: formData.get("accommodationType") || undefined,
    priceRange: formData.get("priceRange") || undefined,
    starRating: formData.get("starRating")
      ? Number(formData.get("starRating"))
      : undefined,
    amenities: formData.get("amenities") || undefined,
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
  });

  const updated = await prisma.accommodation.update({
    where: { id },
    data,
  });

  revalidatePath(`/destinations/${updated.destinationId}`);
  revalidatePath(
    `/destinations/${updated.destinationId}/accommodations/${id}`
  );
  revalidatePath("/admin/accommodations");
  redirect("/admin/accommodations");
}

export async function deleteAccommodation(id: string) {
  await requireAdmin();

  const accommodation = await prisma.accommodation.findUnique({
    where: { id },
  });
  if (!accommodation) throw new Error("住宿不存在");

  await prisma.accommodation.delete({ where: { id } });

  revalidatePath(`/destinations/${accommodation.destinationId}`);
  revalidatePath("/admin/accommodations");
}

export async function approveAccommodation(id: string) {
  await requireAdmin();
  await prisma.accommodation.update({ where: { id }, data: { status: "APPROVED", isPublished: true, reviewNotes: null } });
  revalidatePath("/destinations", "layout");
  revalidatePath("/admin/accommodations", "layout");
  revalidatePath("/profile/submissions");
}

export async function rejectAccommodation(id: string, notes: string) {
  await requireAdmin();
  if (!notes.trim() || notes.length > 1000) throw new Error("拒绝原因应为 1 至 1000 字");
  await prisma.accommodation.update({ where: { id }, data: { status: "REJECTED", isPublished: false, reviewNotes: notes.trim() } });
  revalidatePath("/admin/accommodations", "layout");
  revalidatePath("/profile/submissions");
}
