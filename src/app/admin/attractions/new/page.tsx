import { prisma } from "@/lib/prisma";
import { AttractionForm } from "@/components/destinations/attraction-form";
import { createAttraction } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewAttractionPage({
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
      <h1 className="text-2xl font-bold text-foreground mb-8">添加景点</h1>

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
                  href={`/admin/attractions/new?destinationId=${d.id}`}
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
            <CardTitle>景点信息</CardTitle>
          </CardHeader>
          <CardContent>
            <AttractionForm
              action={createAttraction.bind(null, destinationId)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
