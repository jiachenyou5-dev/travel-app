import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, UtensilsCrossed, Hotel, Heart } from "@/components/ui/clay-icons";

export default async function FavoritesPage() {
  const sessionUser = await requireAuth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: sessionUser.id },
    include: {
      destination: { select: { id: true, nameZh: true, province: true } },
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
          cuisineType: true,
          destination: { select: { id: true, nameZh: true } },
        },
      },
      accommodation: {
        select: {
          id: true,
          nameZh: true,
          accommodationType: true,
          starRating: true,
          destination: { select: { id: true, nameZh: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-muted-foreground">还没有收藏任何内容</p>
        <Link
          href="/destinations"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          去探索目的地
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((fav) => {
        if (fav.destination) {
          return (
            <Link
              key={fav.id}
              href={`/destinations/${fav.destination.id}`}
              className="block"
            >
              <Card className="card-float">
                <CardContent className="flex items-center gap-3 py-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {fav.destination.nameZh}
                    </p>
                    {fav.destination.province && (
                      <p className="text-sm text-muted-foreground">
                        目的地 · {fav.destination.province}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        }
        if (fav.attraction) {
          return (
            <Link
              key={fav.id}
              href={`/destinations/${fav.attraction.destination.id}/attractions/${fav.attraction.id}`}
              className="block"
            >
              <Card className="card-float">
                <CardContent className="flex items-center gap-3 py-4">
                  <Building2 className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {fav.attraction.nameZh}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      景点 · {fav.attraction.destination.nameZh}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        }
        if (fav.restaurant) {
          return (
            <Link
              key={fav.id}
              href={`/destinations/${fav.restaurant.destination.id}/restaurants/${fav.restaurant.id}`}
              className="block"
            >
              <Card className="card-float">
                <CardContent className="flex items-center gap-3 py-4">
                  <UtensilsCrossed className="w-5 h-5 text-accent-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {fav.restaurant.nameZh}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        美食 · {fav.restaurant.destination.nameZh}
                      </span>
                      {fav.restaurant.cuisineType && (
                        <Badge variant="secondary" className="text-xs">
                          {fav.restaurant.cuisineType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        }
        if (fav.accommodation) {
          return (
            <Link
              key={fav.id}
              href={`/destinations/${fav.accommodation.destination.id}/accommodations/${fav.accommodation.id}`}
              className="block"
            >
              <Card className="card-float">
                <CardContent className="flex items-center gap-3 py-4">
                  <Hotel className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {fav.accommodation.nameZh}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        住宿 · {fav.accommodation.destination.nameZh}
                      </span>
                      {fav.accommodation.starRating != null &&
                        fav.accommodation.starRating > 0 && (
                          <span className="text-xs text-star">
                            {"★".repeat(fav.accommodation.starRating)}
                          </span>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        }
        return null;
      })}
    </div>
  );
}
