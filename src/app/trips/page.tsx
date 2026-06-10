import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { deleteTrip } from "@/app/actions/trips";

export default async function TripsPage() {
  const user = await requireAuth();

  const trips = await prisma.tripPlan.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">我的行程</h1>
        <Link href="/trips/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            生成新行程
          </Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p>还没有行程计划</p>
          <p className="text-sm mt-1 mb-4">用 AI 生成你的第一个旅行行程</p>
          <Link href="/trips/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              生成行程
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <Card key={trip.id} className="card-float">
              <CardContent className="py-4 flex items-center justify-between">
                <Link
                  href={`/trips/${trip.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="font-medium text-foreground">{trip.title}</div>
                  {trip.destination && (
                    <div className="text-sm text-muted-foreground">
                      {trip.destination}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(trip.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </Link>
                <form action={deleteTrip.bind(null, trip.id)}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="submit"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
