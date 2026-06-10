import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmapView } from "@/components/ui/amap-view";
import { DestinationTabs } from "./tabs";
import { MapPin } from "lucide-react";

export default async function DestinationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ destinationId: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { destinationId } = await params;
  const { submitted } = await searchParams;

  const [destination, session] = await Promise.all([
    prisma.destination.findUnique({
      where: { id: destinationId },
      include: {
        attractions: { where: { isPublished: true, status: "APPROVED" }, take: 6 },
        restaurants: { where: { isPublished: true, status: "APPROVED" }, take: 6 },
        accommodations: { where: { isPublished: true }, take: 6 },
        displayPhotos: { orderBy: { sortOrder: "asc" } },
      },
    }),
    auth(),
  ]);

  const [attractionCount, restaurantCount, accommodationCount] =
    await Promise.all([
      prisma.attraction.count({
        where: { destinationId, isPublished: true, status: "APPROVED" },
      }),
      prisma.restaurant.count({
        where: { destinationId, isPublished: true, status: "APPROVED" },
      }),
      prisma.accommodation.count({
        where: { destinationId, isPublished: true },
      }),
    ]);

  if (!destination || !destination.isPublished || destination.status !== "APPROVED") notFound();

  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  let initialFavorited = false;
  if (currentUserId) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: currentUserId, destinationId },
    });
    initialFavorited = fav !== null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          { label: destination.nameZh },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {destination.nameZh}
          </h1>
          <FavoriteButton
            entityType="destination"
            entityId={destinationId}
            initialFavorited={initialFavorited}
          />
        </div>
        {destination.province && (
          <p className="text-muted-foreground">
            {destination.province} · {destination.country}
          </p>
        )}
        {submitted === "1" && (
          <div className="mt-4 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm text-success-foreground">
            景点已提交，等待管理员审核后公开展示。
          </div>
        )}
        {submitted === "food" && (
          <div className="mt-4 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm text-success-foreground">
            美食已提交，等待管理员审核后公开展示。
          </div>
        )}
        {submitted === "accommodation" && (
          <div className="mt-4 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm text-success-foreground">
            住宿已提交，等待管理员审核后公开展示。
          </div>
        )}
        {destination.description && (
          <p className="text-muted-foreground mt-4 max-w-3xl">
            {destination.description}
          </p>
        )}
      </div>

      {destination.latitude != null && destination.longitude != null && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">地图位置</CardTitle>
          </CardHeader>
          <CardContent>
            <AmapView
              center={{ lat: destination.latitude, lng: destination.longitude }}
              markers={[
                {
                  lat: destination.latitude,
                  lng: destination.longitude,
                  title: destination.nameZh,
                },
              ]}
              className="w-full h-72 rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      <DestinationTabs
        destination={destination}
        counts={{
          attractions: attractionCount,
          restaurants: restaurantCount,
          accommodations: accommodationCount,
        }}
        isLoggedIn={!!session?.user}
        isAdmin={isAdmin}
      />
    </div>
  );
}
