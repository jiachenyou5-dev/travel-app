import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Star, ChevronRight } from "lucide-react";

export default async function HomePage() {
  const [destinations, recentReviews, stats] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, status: "APPROVED" },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
      },
    }),
    Promise.all([
      prisma.destination.count({ where: { isPublished: true, status: "APPROVED" } }),
      prisma.attraction.count({ where: { isPublished: true, status: "APPROVED" } }),
      prisma.review.count(),
    ]),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-primary/5 to-background py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            探索世界，记录旅程
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            发现热门旅游目的地，分享你的旅行体验
          </p>

          <form action="/search" className="max-w-xl mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                name="q"
                placeholder="搜索目的地、景点、美食、住宿..."
                className="h-11 text-base"
              />
              <Button type="submit" size="lg" className="gap-2 shrink-0">
                <Search className="w-5 h-5" />
                搜索
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats[0]}
              </div>
              <div className="text-sm text-muted-foreground">目的地</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {stats[1]}
              </div>
              <div className="text-sm text-muted-foreground">景点</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-star">
                {stats[2]}
              </div>
              <div className="text-sm text-muted-foreground">评论</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">热门目的地</h2>
          <Link
            href="/destinations"
            className="text-primary hover:underline text-sm flex items-center gap-1"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p>暂无目的地，请先通过管理后台添加</p>
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
                      {d.province || "探索精彩旅程"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {recentReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-8">最新评论</h2>
          <div className="space-y-4">
            {recentReviews.map((r) => (
              <Card key={r.id} className="card-float">
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{r.user.name}</span>
                    <span className="text-star flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? "fill-star" : "text-muted-foreground/20"}`}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {r.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
