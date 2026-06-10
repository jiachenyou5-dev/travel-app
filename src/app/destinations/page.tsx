import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Button } from "@/components/ui/button";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;

  const [destinations, session] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
    auth(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav items={[{ label: "目的地" }]} />

      <h1 className="text-2xl font-bold text-foreground mb-4">旅游目的地</h1>

      {submitted === "1" && (
        <div className="mb-6 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm text-success-foreground">
          目的地已提交，等待管理员审核后公开展示。
        </div>
      )}

      {session?.user && (
        <div className="mb-6">
          <Link href="/destinations/submit">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              提交新目的地
            </Button>
          </Link>
        </div>
      )}

      {destinations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-lg">暂无目的地</p>
          <p className="text-sm mt-2">请管理员添加旅游目的地</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 card-stagger">
          {destinations.map((d) => (
            <Link key={d.id} href={`/destinations/${d.id}`}>
              <Card className="card-float h-full">
                <div className="h-40 bg-gradient-to-br from-primary/15 to-primary/5 rounded-t-lg flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary/40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{d.nameZh}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {d.province ? `${d.province} · ` : ""}{d.country}
                  </p>
                  {d.description && (
                    <p className="text-sm text-muted-foreground/70 mt-2 line-clamp-2">
                      {d.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
