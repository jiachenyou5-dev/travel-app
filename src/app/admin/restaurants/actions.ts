"use server";

import { prisma } from "@/lib/prisma";
import { restaurantSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRestaurant(
  destinationId: string,
  formData: FormData
) {
  await requireAdmin();

  const data = restaurantSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    cuisineType: formData.get("cuisineType") || undefined,
    priceRange: formData.get("priceRange") || undefined,
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

  await prisma.restaurant.create({
    data: { ...data, destinationId },
  });

  revalidatePath(`/destinations/${destinationId}`);
  revalidatePath("/admin/restaurants");
  redirect("/admin/restaurants");
}

export async function updateRestaurant(id: string, formData: FormData) {
  await requireAdmin();

  const data = restaurantSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    description: formData.get("description") || undefined,
    address: formData.get("address") || undefined,
    cuisineType: formData.get("cuisineType") || undefined,
    priceRange: formData.get("priceRange") || undefined,
    openingHours: formData.get("openingHours") || undefined,
    website: formData.get("website") || undefined,
    phone: formData.get("phone") || undefined,
  });

  const updated = await prisma.restaurant.update({
    where: { id },
    data,
  });

  revalidatePath(`/destinations/${updated.destinationId}`);
  revalidatePath(
    `/destinations/${updated.destinationId}/restaurants/${id}`
  );
  revalidatePath("/admin/restaurants");
  redirect("/admin/restaurants");
}

export async function deleteRestaurant(id: string) {
  await requireAdmin();

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new Error("餐厅不存在");

  await prisma.restaurant.delete({ where: { id } });

  revalidatePath(`/destinations/${restaurant.destinationId}`);
  revalidatePath("/admin/restaurants");
}

export async function approveRestaurant(id: string) {
  await requireAdmin();

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new Error("餐厅不存在");

  await prisma.restaurant.update({
    where: { id },
    data: { status: "APPROVED", reviewNotes: null },
  });

  revalidatePath(`/destinations/${restaurant.destinationId}`);
  revalidatePath("/admin/restaurants/pending");
}

export async function rejectRestaurant(id: string, notes: string) {
  await requireAdmin();

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new Error("餐厅不存在");

  await prisma.restaurant.update({
    where: { id },
    data: { status: "REJECTED", reviewNotes: notes },
  });

  revalidatePath("/admin/restaurants/pending");
}
