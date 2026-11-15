import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { AmapView } from "@/components/ui/amap-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "@/components/ui/clay-icons";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

export default async function FootprintPage() {
  const user = await requireAuth();

  const [reviews, favorites] = await Promise.all([
    prisma.review.findMany({
      where: { userId: user.id },
      select: {
        attraction: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
        restaurant: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
        accommodation: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
      },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      select: {
        destination: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
        attraction: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
        restaurant: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
        accommodation: {
          select: { id: true, nameZh: true, latitude: true, longitude: true },
        },
      },
    }),
  ]);

  const seen = new Map<string, MarkerData>();

  for (const r of reviews) {
    for (const entity of [r.attraction, r.restaurant, r.accommodation]) {
      if (entity?.latitude != null && entity.longitude != null) {
        const key = `${entity.latitude},${entity.longitude}`;
        if (!seen.has(key)) {
          seen.set(key, { lat: entity.latitude, lng: entity.longitude, title: entity.nameZh });
        }
      }
    }
  }

  for (const f of favorites) {
    for (const entity of [f.destination, f.attraction, f.restaurant, f.accommodation]) {
      if (entity?.latitude != null && entity.longitude != null) {
        const key = `${entity.latitude},${entity.longitude}`;
        if (!seen.has(key)) {
          seen.set(key, { lat: entity.latitude, lng: entity.longitude, title: entity.nameZh });
        }
      }
    }
  }

  const markers = Array.from(seen.values());
  const center = markers.length > 0
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : undefined;

  const visitedCount = markers.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">{visitedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">已探索地点</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-star">{reviews.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">已发表评论</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">旅行足迹地图</CardTitle>
        </CardHeader>
        <CardContent>
          {markers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p>还没有旅行足迹</p>
              <p className="text-sm mt-1">
                去收藏目的地或发表评论，足迹就会出现在地图上
              </p>
            </div>
          ) : (
            <AmapView
              center={center}
              markers={markers}
              zoom={5}
              className="w-full h-96 rounded-lg"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
