import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, UtensilsCrossed, Hotel } from "@/components/ui/clay-icons";
import { poiSearch } from "@/lib/amap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "搜索",
  description: "搜索目的地、景点、美食、住宿",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim().slice(0, 100);

  if (!query) {
    return (
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:min-h-[68vh] lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="text-[40px] font-medium tracking-tight">下一站，你想去哪里？</h1>
          <p className="mt-4 mb-8 text-muted-foreground">搜索目的地、景点、美食、住宿，找到属于你的旅行灵感。</p>
          <form action="/search" className="flex gap-3 rounded-lg bg-secondary p-4">
            <Input name="q" aria-label="搜索关键词" placeholder="输入关键词..." maxLength={100} className="h-12" />
            <Button type="submit" className="h-12 gap-2"><Search className="size-5" />搜索</Button>
          </form>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-[var(--clay-lavender)] p-10"><Search className="size-48" /></div>
      </div>
    );
  }

  const [destinations, attractions, restaurants, accommodations, amapResults] =
    await Promise.all([
      prisma.destination.findMany({
        where: {
          isPublished: true,
          status: "APPROVED",
          OR: [
            { nameZh: { contains: query } },
            { nameEn: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 5,
      }),
      prisma.attraction.findMany({
        where: {
          isPublished: true,
          destination: { isPublished: true, status: "APPROVED" },
          status: "APPROVED",
          OR: [
            { nameZh: { contains: query } },
            { nameEn: { contains: query } },
            { description: { contains: query } },
            { address: { contains: query } },
          ],
        },
        include: {
          destination: { select: { id: true, nameZh: true } },
        },
        take: 5,
      }),
      prisma.restaurant.findMany({
        where: {
          isPublished: true,
          destination: { isPublished: true, status: "APPROVED" },
          status: "APPROVED",
          OR: [
            { nameZh: { contains: query } },
            { nameEn: { contains: query } },
            { description: { contains: query } },
            { cuisineType: { contains: query } },
            { address: { contains: query } },
          ],
        },
        include: {
          destination: { select: { id: true, nameZh: true } },
        },
        take: 5,
      }),
      prisma.accommodation.findMany({
        where: {
          isPublished: true,
          status: "APPROVED",
          destination: { isPublished: true, status: "APPROVED" },
          OR: [
            { nameZh: { contains: query } },
            { nameEn: { contains: query } },
            { description: { contains: query } },
            { address: { contains: query } },
          ],
        },
        include: {
          destination: { select: { id: true, nameZh: true } },
        },
        take: 5,
      }),
      poiSearch(query),
    ]);

  const totalResults =
    destinations.length +
    attractions.length +
    restaurants.length +
    accommodations.length +
    amapResults.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form action="/search" className="mb-8">
        <div className="flex gap-2">
          <Input
            name="q"
            defaultValue={query}
            placeholder="搜索目的地、景点、美食、住宿..."
            className="h-11"
          />
          <Button type="submit" className="gap-2">
            <Search className="w-4 h-4" />
            搜索
          </Button>
        </div>
      </form>

      {totalResults === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p>未找到与「{query}」相关的结果</p>
          <p className="text-sm mt-1">请尝试其他关键词</p>
        </div>
      ) : (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground">
            展示 {totalResults} 条与「{query}」相关的结果（本地每类最多 5 条，地图最多 10 条）
          </p>

          {destinations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                目的地
              </h2>
              <div className="space-y-2">
                {destinations.map((d) => (
                  <Link key={d.id} href={`/destinations/${d.id}`}>
                    <Card className="card-float">
                      <CardContent className="py-3">
                        <div className="font-medium">{d.nameZh}</div>
                        <div className="text-sm text-muted-foreground">
                          {d.province || d.country}
                          {d.description &&
                            ` · ${d.description.slice(0, 60)}`}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {attractions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-success" />
                景点
              </h2>
              <div className="space-y-2">
                {attractions.map((a) => (
                  <Link
                    key={a.id}
                    href={`/destinations/${a.destination.id}/attractions/${a.id}`}
                  >
                    <Card className="card-float">
                      <CardContent className="py-3">
                        <div className="font-medium">{a.nameZh}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.destination.nameZh}
                          {a.address && ` · ${a.address}`}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {restaurants.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-accent-foreground" />
                美食
              </h2>
              <div className="space-y-2">
                {restaurants.map((r) => (
                  <Link
                    key={r.id}
                    href={`/destinations/${r.destination.id}/restaurants/${r.id}`}
                  >
                    <Card className="card-float">
                      <CardContent className="py-3">
                        <div className="font-medium">{r.nameZh}</div>
                        <div className="text-sm text-muted-foreground">
                          {r.destination.nameZh}
                          {r.cuisineType && ` · ${r.cuisineType}`}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {accommodations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary" />
                住宿
              </h2>
              <div className="space-y-2">
                {accommodations.map((a) => (
                  <Link
                    key={a.id}
                    href={`/destinations/${a.destination.id}/accommodations/${a.id}`}
                  >
                    <Card className="card-float">
                      <CardContent className="py-3">
                        <div className="font-medium">{a.nameZh}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.destination.nameZh}
                          {a.accommodationType && ` · ${a.accommodationType}`}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {amapResults.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-destructive" />
                高德地图搜索结果
              </h2>
              <div className="space-y-2">
                {amapResults.map((poi) => (
                  <Link key={poi.id} href={`/search/place/${poi.id}`}>
                    <Card className="card-float">
                      <CardContent className="py-3">
                        <div className="font-medium">{poi.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {poi.address}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {poi.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
