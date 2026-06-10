"use server";

import { prisma } from "@/lib/prisma";
import { attractionSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitAttraction(
  destinationId: string,
  formData: FormData
) {
  const user = await requireAuth();

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
    data: {
      ...data,
      destinationId,
      status: "PENDING",
      submittedById: user.id,
    },
  });

  revalidatePath(`/destinations/${destinationId}`);
  redirect(`/destinations/${destinationId}?submitted=1`);
}
