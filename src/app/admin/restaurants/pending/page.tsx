import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveRestaurant } from "../actions";
import { RejectDialog } from "./reject-dialog";

export default async function PendingRestaurantsPage() {
  const pending = await prisma.restaurant.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { id: true, nameZh: true } },
      submittedBy: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">待审核美食</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length === 0
              ? "暂无待审核美食"
              : `${pending.length} 个美食等待审核`}
          </p>
        </div>
        <Link href="/admin/restaurants">
          <Button variant="outline">返回美食管理</Button>
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>没有待审核的美食</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((r) => (
            <Card key={r.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{r.nameZh}</h3>
                      <Badge variant="secondary">待审核</Badge>
                      {r.cuisineType && (
                        <Badge variant="outline">{r.cuisineType}</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      所属目的地：
                      <Link
                        href={`/destinations/${r.destination.id}`}
                        className="text-primary hover:underline"
                      >
                        {r.destination.nameZh}
                      </Link>
                      {r.address && ` · ${r.address}`}
                    </p>

                    {r.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {r.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground/70">
                      {r.priceRange && <span>人均：{r.priceRange}</span>}
                      {r.openingHours && <span>营业：{r.openingHours}</span>}
                      {r.submittedBy && (
                        <span>
                          提交人：{r.submittedBy.name || r.submittedBy.email}
                        </span>
                      )}
                      <span>
                        提交时间：{r.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <form action={approveRestaurant.bind(null, r.id)}>
                      <Button size="sm" className="gap-1">
                        通过
                      </Button>
                    </form>
                    <RejectDialog
                      restaurantId={r.id}
                      restaurantName={r.nameZh}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
