import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Ticket, Clock, Phone, Globe } from "@/components/ui/clay-icons";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { AmapView } from "@/components/ui/amap-view";
import { EntityTabsSection } from "@/components/reviews/entity-tabs-section";

export default async function AttractionDetailPage({
  params,
}: {
  params: Promise<{ destinationId: string; attractionId: string }>;
}) {
  const { destinationId, attractionId } = await params;

  const [attraction, session] = await Promise.all([
    prisma.attraction.findFirst({
      where: { id: attractionId, destinationId, destination: { isPublished: true, status: "APPROVED" } },
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

  if (!attraction || !attraction.isPublished || attraction.status !== "APPROVED") notFound();

  const currentUser = session?.user as
    | { id: string; name?: string; role?: string }
    | undefined;

  let initialFavorited = false;
  if (currentUser?.id) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: currentUser.id, attractionId },
    });
    initialFavorited = fav !== null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          {
            label: attraction.destination.nameZh,
            href: `/destinations/${destinationId}`,
          },
          { label: attraction.nameZh },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {attraction.nameZh}
              <span className="inline-block ml-3 align-middle">
                <FavoriteButton
                  entityType="attraction"
                  entityId={attractionId}
                  initialFavorited={initialFavorited}
                />
              </span>
            </h1>
            {attraction.description && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {attraction.description}
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">详细信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {attraction.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground/70 mt-0.5 shrink-0" />
                  <span className="text-foreground/85">{attraction.address}</span>
                </div>
              )}
              {attraction.ticketPrice != null && (
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">
                    {attraction.ticketPrice === 0
                      ? "免费"
                      : `¥${attraction.ticketPrice}`}
                  </span>
                </div>
              )}
              {attraction.openingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">
                    {attraction.openingHours}
                  </span>
                </div>
              )}
              {attraction.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/85">{attraction.phone}</span>
                </div>
              )}
              {attraction.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                  <a
                    href={attraction.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {attraction.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <EntityTabsSection
            entityType="attraction"
            entityId={attractionId}
            photos={attraction.displayPhotos}
            reviews={attraction.reviews.map((r) => ({
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
              {attraction.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground/70">暂无评分</p>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-star">
                    {(
                      attraction.reviews.reduce(
                        (sum, r) => sum + r.rating,
                        0
                      ) / attraction.reviews.length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {attraction.reviews.length} 条评论
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {attraction.latitude != null && attraction.longitude != null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">地图位置</CardTitle>
              </CardHeader>
              <CardContent>
                <AmapView
                  center={{ lat: attraction.latitude, lng: attraction.longitude }}
                  markers={[
                    {
                      lat: attraction.latitude,
                      lng: attraction.longitude,
                      title: attraction.nameZh,
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
