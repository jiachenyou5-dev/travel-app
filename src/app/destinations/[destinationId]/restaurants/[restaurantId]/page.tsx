import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Globe, UtensilsCrossed } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { AmapView } from "@/components/ui/amap-view";
import { EntityTabsSection } from "@/components/reviews/entity-tabs-section";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ destinationId: string; restaurantId: string }>;
}) {
  const { destinationId, restaurantId } = await params;

  const [restaurant, session] = await Promise.all([
    prisma.restaurant.findUnique({
      where: { id: restaurantId },
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
    safeAuth(),
  ]);

  if (!restaurant || !restaurant.isPublished || restaurant.status !== "APPROVED") notFound();

  const currentUser = session?.user as
    | { id: string; name?: string; role?: string }
    | undefined;

  let initialFavorited = false;
  if (currentUser?.id) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: currentUser.id, restaurantId },
    });
    initialFavorited = fav !== null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          {
            label: restaurant.destination.nameZh,
            href: `/destinations/${destinationId}`,
          },
          { label: restaurant.nameZh },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-7 h-7 text-accent-foreground" />
              <h1 className="text-3xl font-bold text-foreground">
                {restaurant.nameZh}
              </h1>
              <FavoriteButton
                entityType="restaurant"
                entityId={restaurantId}
                initialFavorited={initialFavorited}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisineType && (
                <Badge variant="secondary">{restaurant.cuisineType}</Badge>
              )}
              {restaurant.priceRange && (
                <Badge variant="outline">{restaurant.priceRange}</Badge>
              )}
            </div>
            {restaurant.description && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {restaurant.description}
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">详细信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {restaurant.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span className="text-foreground/85">{restaurant.address}</span>
                </div>
              )}
              {restaurant.openingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">
                    {restaurant.openingHours}
                  </span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">{restaurant.phone}</span>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {restaurant.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <EntityTabsSection
            entityType="restaurant"
            entityId={restaurantId}
            photos={restaurant.displayPhotos}
            reviews={restaurant.reviews.map((r) => ({
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
              {restaurant.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground/70">暂无评分</p>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-star">
                    {(
                      restaurant.reviews.reduce(
                        (sum, r) => sum + r.rating,
                        0
                      ) / restaurant.reviews.length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {restaurant.reviews.length} 条评论
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {restaurant.latitude != null && restaurant.longitude != null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">地图位置</CardTitle>
              </CardHeader>
              <CardContent>
                <AmapView
                  center={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                  markers={[
                    {
                      lat: restaurant.latitude,
                      lng: restaurant.longitude,
                      title: restaurant.nameZh,
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
