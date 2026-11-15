import { prisma } from "@/lib/prisma";
import { AccommodationForm } from "@/components/destinations/accommodation-form";
import { createAccommodation } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewAccommodationPage({
  searchParams,
}: {
  searchParams: Promise<{ destinationId?: string }>;
}) {
  const { destinationId } = await searchParams;

  const destinations = await prisma.destination.findMany({
    orderBy: { nameZh: "asc" },
    select: { id: true, nameZh: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-8">添加住宿</h1>

      <Card>
        <CardHeader>
          <CardTitle>选择目的地</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {destinations.map((d) => (
                <a
                  key={d.id}
                  href={`/admin/accommodations/new?destinationId=${d.id}`}
                  className={`block p-3 rounded-lg border text-center transition-colors ${
                    destinationId === d.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-input"
                  }`}
                >
                  {d.nameZh}
                </a>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>

      {destinationId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>住宿信息</CardTitle>
          </CardHeader>
          <CardContent>
            <AccommodationForm
              action={createAccommodation.bind(null, destinationId)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
