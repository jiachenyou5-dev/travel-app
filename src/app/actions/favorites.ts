"use server";

import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function setFavorite(
  entityType: "destination" | "attraction" | "restaurant" | "accommodation",
  entityId: string,
  favorited: boolean,
) {
  const user = await requireAuth();
  z.enum(["destination", "attraction", "restaurant", "accommodation"]).parse(entityType);
  z.string().min(1).max(100).parse(entityId);
  z.boolean().parse(favorited);
  const idField = entityType === "destination" ? "destinationId" : entityType === "attraction" ? "attractionId" : entityType === "restaurant" ? "restaurantId" : "accommodationId";
  if (!favorited) {
    await prisma.favorite.deleteMany({ where: { userId: user.id, [idField]: entityId } });
  } else {
    const existing = await prisma.favorite.findFirst({ where: { userId: user.id, [idField]: entityId } });
    if (!existing) {
      try { await prisma.favorite.create({ data: { userId: user.id, [idField]: entityId } }); }
      catch (error) { if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error; }
    }
  }
  revalidatePath("/profile/favorites");
  return { favorited };
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
