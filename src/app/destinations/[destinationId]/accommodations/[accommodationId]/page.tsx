import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Hotel, Wifi } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { AmapView } from "@/components/ui/amap-view";
import { EntityTabsSection } from "@/components/reviews/entity-tabs-section";

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ destinationId: string; accommodationId: string }>;
}) {
  const { destinationId, accommodationId } = await params;

  const [accommodation, session] = await Promise.all([
    prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: {
        destination: { select: { id: true, nameZh: true } },
        displayPhotos: { orderBy: { sortOrder: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
            photos: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!accommodation || !accommodation.isPublished) notFound();

  const currentUser = session?.user as
    | { id: string; name?: string; role?: string }
    | undefined;

  let initialFavorited = false;
  if (currentUser?.id) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: currentUser.id, accommodationId },
    });
    initialFavorited = fav !== null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          {
            label: accommodation.destination.nameZh,
            href: `/destinations/${destinationId}`,
          },
          { label: accommodation.nameZh },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Hotel className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                {accommodation.nameZh}
              </h1>
              <FavoriteButton
                entityType="accommodation"
                entityId={accommodationId}
                initialFavorited={initialFavorited}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {accommodation.accommodationType && (
                <Badge variant="secondary">
                  {accommodation.accommodationType}
                </Badge>
              )}
              {accommodation.priceRange && (
                <Badge variant="outline">{accommodation.priceRange}</Badge>
              )}
              {accommodation.starRating != null &&
                accommodation.starRating > 0 && (
                  <Badge variant="default">
                    {"★".repeat(accommodation.starRating)}
                    {"☆".repeat(5 - accommodation.starRating)}
                  </Badge>
                )}
            </div>
            {accommodation.description && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {accommodation.description}
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">详细信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accommodation.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span className="text-foreground/85">
                    {accommodation.address}
                  </span>
                </div>
              )}
              {accommodation.amenities && (
                <div className="flex items-start gap-2">
                  <Wifi className="w-5 h-5 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span className="text-foreground/85">
                    {accommodation.amenities}
                  </span>
                </div>
              )}
              {accommodation.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">
                    {accommodation.phone}
                  </span>
                </div>
              )}
              {accommodation.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <a
                    href={accommodation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {accommodation.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <EntityTabsSection
            entityType="accommodation"
            entityId={accommodationId}
            photos={accommodation.displayPhotos}
            reviews={accommodation.reviews.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
              visitDate: r.visitDate?.toISOString() ?? null,
            }))}
            currentUserId={currentUser?.id}
            isAdmin={currentUser?.role === "ADMIN"}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">评分概览</CardTitle>
            </CardHeader>
            <CardContent>
              {accommodation.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground/70">暂无评分</p>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-star">
                    {(
                      accommodation.reviews.reduce(
                        (sum, r) => sum + r.rating,
                        0
                      ) / accommodation.reviews.length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {accommodation.reviews.length} 条评论
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {accommodation.latitude != null && accommodation.longitude != null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">地图位置</CardTitle>
              </CardHeader>
              <CardContent>
                <AmapView
                  center={{ lat: accommodation.latitude, lng: accommodation.longitude }}
                  markers={[
                    {
                      lat: accommodation.latitude,
                      lng: accommodation.longitude,
                      title: accommodation.nameZh,
                    },
                  ]}
                  className="w-full h-48 rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
