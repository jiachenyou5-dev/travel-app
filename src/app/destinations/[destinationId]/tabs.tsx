"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, UtensilsCrossed, Hotel, Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityPhotosSection } from "@/components/reviews/entity-photos-section";

interface Destination {
  id: string;
  attractions: any[];
  restaurants: any[];
  accommodations: any[];
  displayPhotos?: { id: string; url: string; altText?: string | null }[];
}

export function DestinationTabs({
  destination,
  counts,
  isLoggedIn,
  isAdmin = false,
}: {
  destination: Destination;
  counts: { attractions: number; restaurants: number; accommodations: number };
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const [tab, setTab] = useState("photos");

  const photosCount = destination.displayPhotos?.length ?? 0;

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="photos" className="gap-2">
          <Image className="w-4 h-4" />
          照片
          {photosCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {photosCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="attractions" className="gap-2">
          <Building2 className="w-4 h-4" />
          景点
          <Badge variant="secondary" className="ml-1">
            {counts.attractions}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="restaurants" className="gap-2">
          <UtensilsCrossed className="w-4 h-4" />
          美食
          <Badge variant="secondary" className="ml-1">
            {counts.restaurants}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="accommodations" className="gap-2">
          <Hotel className="w-4 h-4" />
          住宿
          <Badge variant="secondary" className="ml-1">
            {counts.accommodations}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {/* 照片Tab：flex-none 覆盖 TabsContent 默认 flex-1，避免 flex-basis:0% 导致容器高度塌陷无法滚动 */}
      <TabsContent value="photos" className="mt-6 flex-none overflow-y-auto max-h-[75vh]">
        <EntityPhotosSection
          photos={destination.displayPhotos ?? []}
          isAdmin={isAdmin}
          destinationId={destination.id}
        />
        {isLoggedIn && (
          <div className="text-center mt-4">
            <Link href={`/destinations/${destination.id}/photos/submit`}>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                上传新照片
              </Button>
            </Link>
          </div>
        )}
      </TabsContent>

      <TabsContent value="attractions" className="mt-6">
        {destination.attractions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">暂无景点信息</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-stagger">
            {destination.attractions.map((a) => (
              <Link
                key={a.id}
                href={`/destinations/${destination.id}/attractions/${a.id}`}
              >
                <Card className="card-float">
                  <CardHeader>
                    <CardTitle className="text-base">{a.nameZh}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {a.address && (
                      <p className="text-sm text-muted-foreground">{a.address}</p>
                    )}
                    {a.ticketPrice && (
                      <p className="text-sm text-primary mt-1">
                        ¥{a.ticketPrice}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {isLoggedIn && (
          <div className="text-center mt-4">
            <Link href={`/destinations/${destination.id}/attractions/submit`}>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                提交新景点
              </Button>
            </Link>
          </div>
        )}
        {counts.attractions > 6 && (
          <div className="text-center mt-4">
            <Link
              href={`/destinations/${destination.id}/attractions`}
              className="text-primary hover:underline text-sm"
            >
              查看全部 {counts.attractions} 个景点
            </Link>
          </div>
        )}
      </TabsContent>

      <TabsContent value="restaurants" className="mt-6">
        {destination.restaurants.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">暂无美食信息</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-stagger">
            {destination.restaurants.map((r) => (
              <Link
                key={r.id}
                href={`/destinations/${destination.id}/restaurants/${r.id}`}
              >
                <Card className="card-float">
                  <CardHeader>
                    <CardTitle className="text-base">{r.nameZh}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {r.cuisineType && (
                      <Badge variant="outline" className="text-xs">
                        {r.cuisineType}
                      </Badge>
                    )}
                    {r.priceRange && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {r.priceRange}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {isLoggedIn && (
          <div className="text-center mt-4">
            <Link href={`/destinations/${destination.id}/restaurants/submit`}>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                提交新美食
              </Button>
            </Link>
          </div>
        )}
        {counts.restaurants > 6 && (
          <div className="text-center mt-4">
            <Link
              href={`/destinations/${destination.id}/restaurants`}
              className="text-primary hover:underline text-sm"
            >
              查看全部 {counts.restaurants} 个美食
            </Link>
          </div>
        )}
      </TabsContent>

      <TabsContent value="accommodations" className="mt-6">
        {destination.accommodations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">暂无住宿信息</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-stagger">
            {destination.accommodations.map((a) => (
              <Link
                key={a.id}
                href={`/destinations/${destination.id}/accommodations/${a.id}`}
              >
                <Card className="card-float">
                  <CardHeader>
                    <CardTitle className="text-base">{a.nameZh}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {a.accommodationType && (
                      <Badge variant="outline" className="text-xs">
                        {a.accommodationType}
                      </Badge>
                    )}
                    {a.priceRange && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {a.priceRange}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {isLoggedIn && (
          <div className="text-center mt-4">
            <Link
              href={`/destinations/${destination.id}/accommodations/submit`}
            >
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                提交新住宿
              </Button>
            </Link>
          </div>
        )}
        {counts.accommodations > 6 && (
          <div className="text-center mt-4">
            <Link
              href={`/destinations/${destination.id}/accommodations`}
              className="text-primary hover:underline text-sm"
            >
              查看全部 {counts.accommodations} 个住宿
            </Link>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
