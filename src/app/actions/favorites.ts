"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(
  entityType: "destination" | "attraction" | "restaurant" | "accommodation",
  entityId: string
) {
  const user = await requireAuth();

  const idField =
    entityType === "destination"
      ? "destinationId"
      : entityType === "attraction"
        ? "attractionId"
        : entityType === "restaurant"
          ? "restaurantId"
          : "accommodationId";

  const existing = await prisma.favorite.findFirst({
    where: { userId: user.id, [idField]: entityId },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({
    data: { userId: user.id, [idField]: entityId },
  });
  return { favorited: true };
}

export async function getFavoriteStatus(
  entityType: "destination" | "attraction" | "restaurant" | "accommodation",
  entityId: string
) {
  const { safeAuth } = await import("@/lib/auth-utils");
  const session = await safeAuth();
  if (!session?.user) return false;

  const userId = (session.user as { id: string }).id;
  const idField =
    entityType === "destination"
      ? "destinationId"
      : entityType === "attraction"
        ? "attractionId"
        : entityType === "restaurant"
          ? "restaurantId"
          : "accommodationId";

  const fav = await prisma.favorite.findFirst({
    where: { userId, [idField]: entityId },
  });
  return fav !== null;
}
