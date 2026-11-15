import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DestinationForm } from "@/components/destinations/destination-form";
import { PhotoManager } from "@/components/destinations/photo-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateDestination } from "../../actions";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  const { destinationId } = await params;

  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
    include: { displayPhotos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!destination) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-8">编辑目的地</h1>

      <div className="space-y-8">
        <DestinationForm
          action={updateDestination.bind(null, destination.id)}
          defaultValues={{
            nameZh: destination.nameZh,
            nameEn: destination.nameEn || "",
            province: destination.province || "",
            description: destination.description || "",
            country: destination.country,
            latitude: destination.latitude || undefined,
            longitude: destination.longitude || undefined,
          }}
          submitLabel="更新目的地"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">目的地照片</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoManager
              entityId={destination.id}
              photos={destination.displayPhotos}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
