"use server";

import { prisma } from "@/lib/prisma";
import { destinationSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitDestination(formData: FormData) {
  const user = await requireAuth();

  const data = destinationSchema.parse({
    nameZh: formData.get("nameZh"),
    nameEn: formData.get("nameEn") || undefined,
    province: formData.get("province") || undefined,
    description: formData.get("description") || undefined,
    country: formData.get("country") || "中国",
    latitude: formData.get("latitude")
      ? Number(formData.get("latitude"))
      : undefined,
    longitude: formData.get("longitude")
      ? Number(formData.get("longitude"))
      : undefined,
  });

  await prisma.destination.create({
    data: {
      ...data,
      status: "PENDING",
      submittedById: user.id,
    },
  });

  revalidatePath("/destinations");
  redirect("/destinations?submitted=1");
}
