import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star } from "lucide-react";

export default async function MyReviewsPage() {
  const sessionUser = await requireAuth();

  const reviews = await prisma.review.findMany({
    where: { userId: sessionUser.id },
    include: {
      attraction: {
        select: {
          id: true,
          nameZh: true,
          destination: { select: { id: true, nameZh: true } },
        },
      },
      restaurant: {
        select: {
          id: true,
          nameZh: true,
          destination: { select: { id: true, nameZh: true } },
        },
      },
      accommodation: {
        select: {
          id: true,
          nameZh: true,
          destination: { select: { id: true, nameZh: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-muted-foreground">还没有发表评论</p>
        <Link
          href="/destinations"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          去探索目的地
        </Link>
      </div>
    );
  }

  const entityLabel = (r: (typeof reviews)[number]) => {
    if (r.attraction)
      return {
        label: "景点",
        name: r.attraction.nameZh,
        destName: r.attraction.destination.nameZh,
        href: `/destinations/${r.attraction.destination.id}/attractions/${r.attraction.id}`,
      };
    if (r.restaurant)
      return {
        label: "美食",
        name: r.restaurant.nameZh,
        destName: r.restaurant.destination.nameZh,
        href: `/destinations/${r.restaurant.destination.id}/restaurants/${r.restaurant.id}`,
      };
    if (r.accommodation)
      return {
        label: "住宿",
        name: r.accommodation.nameZh,
        destName: r.accommodation.destination.nameZh,
        href: `/destinations/${r.accommodation.destination.id}/accommodations/${r.accommodation.id}`,
      };
    return {
      label: "未知",
      name: "未知",
      destName: "",
      href: "#",
    };
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const info = entityLabel(review);
        return (
          <Link key={review.id} href={info.href} className="block">
            <Card className="card-float">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {info.label}
                      </Badge>
                      <span className="font-medium text-foreground text-sm">
                        {info.name}
                      </span>
                    </div>
                    {info.destName && (
                      <p className="text-xs text-muted-foreground/70 mb-2">
                        {info.destName}
                      </p>
                    )}
                    {review.title && (
                      <p className="text-sm font-medium text-foreground/90">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {review.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-star shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  {review.createdAt.toLocaleDateString("zh-CN")}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
