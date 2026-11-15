import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AttractionForm } from "@/components/destinations/attraction-form";
import { updateAttraction } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditAttractionPage({
  params,
}: {
  params: Promise<{ attractionId: string }>;
}) {
  const { attractionId } = await params;

  const attraction = await prisma.attraction.findUnique({
    where: { id: attractionId },
    include: { destination: { select: { nameZh: true } } },
  });

  if (!attraction) notFound();

  const boundAction = updateAttraction.bind(null, attractionId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">编辑景点</h1>
      <p className="text-muted-foreground mb-8">
        所属目的地：{attraction.destination.nameZh}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>景点信息</CardTitle>
        </CardHeader>
        <CardContent>
          <AttractionForm
            action={boundAction}
            defaultValues={{
              nameZh: attraction.nameZh,
              nameEn: attraction.nameEn || "",
              description: attraction.description || "",
              address: attraction.address || "",
              ticketPrice: attraction.ticketPrice ?? undefined,
              openingHours: attraction.openingHours || "",
              website: attraction.website || "",
              phone: attraction.phone || "",
              latitude: attraction.latitude ?? undefined,
              longitude: attraction.longitude ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
