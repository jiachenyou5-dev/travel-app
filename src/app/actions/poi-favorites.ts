"use server";

import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";

export async function togglePoiFavorite(poi: {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}) {
  const session = await safeAuth();
  if (!session?.user) {
    throw new Error("请先登录");
  }
  const userId = (session.user as { id: string }).id;

  const existing = await prisma.poiFavorite.findUnique({
    where: { userId_poiId: { userId, poiId: poi.id } },
  });

  if (existing) {
    await prisma.poiFavorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.poiFavorite.create({
    data: {
      userId,
      poiId: poi.id,
      name: poi.name,
      address: poi.address,
      lat: poi.lat,
      lng: poi.lng,
      type: poi.type,
    },
  });
  return { favorited: true };
}

export async function checkPoiFavorited(poiId: string) {
  const session = await safeAuth();
  if (!session?.user) return false;
  const userId = (session.user as { id: string }).id;

  const fav = await prisma.poiFavorite.findUnique({
    where: { userId_poiId: { userId, poiId } },
  });
  return fav !== null;
}
