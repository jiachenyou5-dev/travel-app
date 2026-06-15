import { notFound } from "next/navigation";
import Link from "next/link";
import { getPoiDetail, nearbyPoiSearch } from "@/lib/amap";
import { AmapView } from "@/components/ui/amap-view";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  UtensilsCrossed,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { PoiFavoriteButton } from "./favorite-btn";

export const dynamic = "force-dynamic";

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const poi = await getPoiDetail(id);
  if (!poi) notFound();

  const nearbyTypes = "050000|050100|050101|050102|050103|050104|050105|050106|050107|050108|050109|050110|050111|050112|050113|050114|050115|050116|050117|050118|050119|050120|050300|050400|050500|050600|050700|050800|050900|051000|051100|051200|051300|051400|051500|051600";

  const nearbyFoods = await nearbyPoiSearch(
    poi.lat,
    poi.lng,
    nearbyTypes,
    1500,
    8
  );

  const amapLink = `https://uri.amap.com/marker?position=${poi.lng},${poi.lat}&name=${encodeURIComponent(poi.name)}&callnative=1`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "搜索", href: "/search" },
          { label: poi.name },
        ]}
      />

      {/* POI 基本信息 */}
      <div className="mt-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {poi.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {poi.type &&
                poi.type.split(";").slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
            </div>
            {poi.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm">{poi.address}</span>
              </div>
            )}
          </div>
          <PoiFavoriteButton poi={poi} />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <a
            href={amapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            导航到这里
          </a>
          <a
            href={`https://uri.amap.com/marker?position=${poi.lng},${poi.lat}&name=${encodeURIComponent(poi.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            高德地图
          </a>
        </div>
      </div>

      {/* 地图 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            地图位置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AmapView
            center={{ lat: poi.lat, lng: poi.lng }}
            markers={[
              {
                lat: poi.lat,
                lng: poi.lng,
                title: poi.name,
              },
              ...nearbyFoods.slice(0, 5).map((f) => ({
                lat: f.lat,
                lng: f.lng,
                title: f.name,
              })),
            ]}
            zoom={15}
            className="w-full h-80 rounded-lg"
          />
        </CardContent>
      </Card>

      {/* 附近美食 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-accent-foreground" />
            附近美食
            <span className="text-sm font-normal text-muted-foreground ml-1">
              （{poi.name} 周边 1.5km）
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nearbyFoods.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 py-4 text-center">
              暂未找到附近美食信息
            </p>
          ) : (
            <div className="space-y-3">
              {nearbyFoods.map((food) => (
                <Link
                  key={food.id}
                  href={`/search/place/${food.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {food.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {food.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      {food.type && (
                        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                          {food.type.split(";")[0]}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(
                          getDistance(poi.lat, poi.lng, food.lat, food.lng)
                        )}
                        m
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Haversine 公式计算两点间距离（米） */
function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
