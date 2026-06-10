"use server";

import { prisma } from "@/lib/prisma";
import { accommodationSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitAccommodation(
  destinationId: string,
  formData: FormData
) {
  const user = await requireAuth();

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
    data: {
      ...data,
      destinationId,
      isPublished: false,
    },
  });

  revalidatePath(`/destinations/${destinationId}`);
  redirect(`/destinations/${destinationId}?submitted=accommodation`);
}
