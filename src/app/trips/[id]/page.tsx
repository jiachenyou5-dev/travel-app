import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { TripPlanCard } from "@/components/trips/trip-plan-card";
import { Button } from "@/components/ui/button";
import { deleteTrip } from "@/app/actions/trips";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Trash2 } from "@/components/ui/clay-icons";
import Link from "next/link";
import { tripDaysSchema } from "@/lib/trip-schema";
import type { TripDay } from "@/lib/trip-schema";


export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const trip = await prisma.tripPlan.findUnique({ where: { id } });

  if (!trip || trip.userId !== user.id) notFound();

  let days: TripDay[] = [];
  try {
    days = tripDaysSchema.parse(JSON.parse(trip.daysJson));
  } catch {
    days = [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "我的行程", href: "/trips" },
          { label: trip.title },
        ]}
      />

      <div className="flex items-start justify-between mt-6 mb-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">{trip.title}</h1>
          {trip.destination && (
            <p className="text-muted-foreground mt-1">{trip.destination}</p>
          )}
          <p className="text-xs text-muted-foreground/70 mt-1">
            创建于{" "}
            {new Date(trip.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/trips/new">
            <Button variant="outline" size="sm">
              生成新行程
            </Button>
          </Link>
          <form action={deleteTrip.bind(null, trip.id)}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除
            </Button>
          </form>
        </div>
      </div>

      <TripPlanCard days={days} />
    </div>
  );
}
