import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Star,
  Plus,
  Building2,
  UtensilsCrossed,
  Hotel,
  Clock,
} from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export default async function AdminDashboard() {
  const [
    destCount,
    userCount,
    reviewCount,
    attractionCount,
    restaurantCount,
    accommodationCount,
    pendingAttractionCount,
    pendingDestinationCount,
    pendingRestaurantCount,
    recentReviews,
    recentUsers,
    ratingDist,
    // 按目的地分组的评分
    destinationsWithReviews,
    // 每个目的地的景点/美食/住宿数量
    destAttrCounts,
    destRestCounts,
    destAccCounts,
  ] = await Promise.all([
    prisma.destination.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.attraction.count(),
    prisma.restaurant.count(),
    prisma.accommodation.count(),
    prisma.attraction.count({ where: { status: "PENDING" } }),
    prisma.destination.count({ where: { status: "PENDING" } }),
    prisma.restaurant.count({ where: { status: "PENDING" } }),
    prisma.review.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        attraction: {
          select: {
            nameZh: true,
            destination: { select: { nameZh: true } },
          },
        },
        restaurant: {
          select: {
            nameZh: true,
            destination: { select: { nameZh: true } },
          },
        },
        accommodation: {
          select: {
            nameZh: true,
            destination: { select: { nameZh: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { name: true, email: true, createdAt: true, role: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      _count: true,
    }),
    // 查询每个目的地的评论评分
    prisma.destination.findMany({
      where: { isPublished: true },
      select: {
        nameZh: true,
        attractions: {
          select: {
            reviews: { select: { rating: true } },
          },
        },
        restaurants: {
          select: {
            reviews: { select: { rating: true } },
          },
        },
        accommodations: {
          select: {
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
    prisma.attraction.groupBy({
      by: ["destinationId"],
      _count: true,
    }),
    prisma.restaurant.groupBy({
      by: ["destinationId"],
      _count: true,
    }),
    prisma.accommodation.groupBy({
      by: ["destinationId"],
      _count: true,
    }),
  ]);

  // 计算每个目的地的平均评分
  const destAttrMap = new Map(destAttrCounts.map((d) => [d.destinationId, d._count]));
  const destRestMap = new Map(destRestCounts.map((d) => [d.destinationId, d._count]));
  const destAccMap = new Map(destAccCounts.map((d) => [d.destinationId, d._count]));

  const destinationRatings = destinationsWithReviews
    .map((dest) => {
      const allRatings: number[] = [];
      for (const a of dest.attractions) allRatings.push(...a.reviews.map((r) => r.rating));
      for (const r of dest.restaurants) allRatings.push(...r.reviews.map((r) => r.rating));
      for (const a of dest.accommodations) allRatings.push(...a.reviews.map((r) => r.rating));

      if (allRatings.length === 0) return null;

      const avg = allRatings.reduce((s, r) => s + r, 0) / allRatings.length;
      return {
        name: dest.nameZh,
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: allRatings.length,
      };
    })
    .filter(Boolean) as { name: string; avgRating: number; reviewCount: number }[];

  // 星级分布
  const totalRating = ratingDist.reduce((s, r) => s + r._count, 0);
  const avgRating =
    totalRating > 0
      ? (
          ratingDist.reduce((s, r) => s + r.rating * r._count, 0) / totalRating
        ).toFixed(1)
      : "-";

  const ratingBuckets = [5, 4, 3, 2, 1].map((rating) => {
    const found = ratingDist.find((r) => r.rating === rating);
    return { rating, count: found?._count || 0 };
  });

  // 内容类型统计
  const contentCounts = [
    { type: "景点", count: attractionCount, color: "#22c55e" },
    { type: "美食", count: restaurantCount, color: "#f59e0b" },
    { type: "住宿", count: accommodationCount, color: "#3b82f6" },
  ];

  function entityLabel(review: (typeof recentReviews)[number]) {
    if (review.attraction)
      return { type: "景点", name: review.attraction.nameZh, dest: review.attraction.destination.nameZh };
    if (review.restaurant)
      return { type: "美食", name: review.restaurant.nameZh, dest: review.restaurant.destination.nameZh };
    if (review.accommodation)
      return { type: "住宿", name: review.accommodation.nameZh, dest: review.accommodation.destination.nameZh };
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">管理后台</h1>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">目的地</CardTitle>
            <MapPin className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">景点</CardTitle>
            <Building2 className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attractionCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">美食</CardTitle>
            <UtensilsCrossed className="w-4 h-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">住宿</CardTitle>
            <Hotel className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">用户</CardTitle>
            <Users className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">评论</CardTitle>
            <Star className="w-4 h-4 text-star" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 待审核提醒 */}
      {pendingAttractionCount > 0 && (
        <div className="mb-4 rounded-lg border border-warning/25 bg-warning/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning-foreground" />
            <div>
              <p className="font-medium text-warning-foreground">{pendingAttractionCount} 个景点待审核</p>
              <p className="text-sm text-warning-foreground">有用户提交了新的景点信息，需要管理员审核</p>
            </div>
          </div>
          <Link href="/admin/attractions/pending">
            <Button size="sm" variant="outline" className="border-warning/35 text-warning-foreground hover:bg-warning/15">去审核</Button>
          </Link>
        </div>
      )}

      {pendingDestinationCount > 0 && (
        <div className="mb-4 rounded-lg border border-warning/25 bg-warning/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning-foreground" />
            <div>
              <p className="font-medium text-warning-foreground">{pendingDestinationCount} 个目的地待审核</p>
              <p className="text-sm text-warning-foreground">有用户提交了新的目的地，需要管理员审核</p>
            </div>
          </div>
          <Link href="/admin/destinations/pending">
            <Button size="sm" variant="outline" className="border-warning/35 text-warning-foreground hover:bg-warning/15">去审核</Button>
          </Link>
        </div>
      )}

      {pendingRestaurantCount > 0 && (
        <div className="mb-8 rounded-lg border border-warning/25 bg-warning/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning-foreground" />
            <div>
              <p className="font-medium text-warning-foreground">{pendingRestaurantCount} 个美食待审核</p>
              <p className="text-sm text-warning-foreground">有用户提交了新的美食信息，需要管理员审核</p>
            </div>
          </div>
          <Link href="/admin/restaurants/pending">
            <Button size="sm" variant="outline" className="border-warning/35 text-warning-foreground hover:bg-warning/15">去审核</Button>
          </Link>
        </div>
      )}

      {/* 可视化图表区域 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">数据概览</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCharts
            destinationRatings={destinationRatings}
            ratingDistribution={ratingBuckets}
            contentCounts={contentCounts}
            totalReviews={totalRating}
            totalAvgRating={avgRating}
          />
        </CardContent>
      </Card>

      {/* 最新评论 + 最新用户 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最新评论</CardTitle>
            </CardHeader>
            <CardContent>
              {recentReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground/70 py-4 text-center">暂无评论</p>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((review) => {
                    const entity = entityLabel(review);
                    return (
                      <div
                        key={review.id}
                        className="flex items-start justify-between gap-4 py-2 border-b border-border/60 last:border-0"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {review.user.name || review.user.email}
                            </span>
                            <span className="text-star text-xs">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </span>
                          </div>
                          {entity && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              {entity.dest} · {entity.type}：{entity.name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {review.content}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground/70 shrink-0">
                          {review.createdAt.toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">最新用户</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground/70">暂无用户</p>
            ) : (
              <div className="space-y-2">
                {recentUsers.map((u) => (
                  <div key={u.email} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name || u.email}</p>
                      <p className="text-xs text-muted-foreground/70">{u.email}</p>
                    </div>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
                      {u.role === "ADMIN" ? "管理员" : "用户"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/admin/destinations">
          <Button variant="outline">管理目的地</Button>
        </Link>
        <Link href="/admin/attractions">
          <Button variant="outline">管理景点</Button>
        </Link>
        <Link href="/admin/restaurants">
          <Button variant="outline">管理美食</Button>
        </Link>
        <Link href="/admin/accommodations">
          <Button variant="outline">管理住宿</Button>
        </Link>
        <Link href="/admin/destinations/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            添加目的地
          </Button>
        </Link>
      </div>
    </div>
  );
}
