import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AccommodationForm } from "@/components/destinations/accommodation-form";
import { updateAccommodation } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditAccommodationPage({
  params,
}: {
  params: Promise<{ accommodationId: string }>;
}) {
  const { accommodationId } = await params;

  const accommodation = await prisma.accommodation.findUnique({
    where: { id: accommodationId },
    include: { destination: { select: { nameZh: true } } },
  });

  if (!accommodation) notFound();

  const boundAction = updateAccommodation.bind(null, accommodationId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">编辑住宿</h1>
      <p className="text-muted-foreground mb-8">
        所属目的地：{accommodation.destination.nameZh}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>住宿信息</CardTitle>
        </CardHeader>
        <CardContent>
          <AccommodationForm
            action={boundAction}
            defaultValues={{
              nameZh: accommodation.nameZh,
              nameEn: accommodation.nameEn || "",
              description: accommodation.description || "",
              address: accommodation.address || "",
              accommodationType: accommodation.accommodationType || "",
              priceRange: accommodation.priceRange || "",
              starRating: accommodation.starRating ?? undefined,
              amenities: accommodation.amenities || "",
              phone: accommodation.phone || "",
              website: accommodation.website || "",
              latitude: accommodation.latitude ?? undefined,
              longitude: accommodation.longitude ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
