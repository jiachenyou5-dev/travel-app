import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveAttraction } from "../actions";
import { RejectDialog } from "./reject-dialog";

export default async function PendingAttractionsPage() {
  const pending = await prisma.attraction.findMany({
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
          <h1 className="text-2xl font-bold text-foreground">待审核景点</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length === 0
              ? "暂无待审核景点"
              : `${pending.length} 个景点等待审核`}
          </p>
        </div>
        <Link href="/admin/attractions">
          <Button variant="outline">返回景点管理</Button>
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>没有待审核的景点</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((a) => (
            <Card key={a.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{a.nameZh}</h3>
                      <Badge variant="secondary">待审核</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      所属目的地：
                      <Link
                        href={`/destinations/${a.destination.id}`}
                        className="text-primary hover:underline"
                      >
                        {a.destination.nameZh}
                      </Link>
                      {a.address && ` · ${a.address}`}
                    </p>

                    {a.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {a.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground/70">
                      {a.ticketPrice != null && <span>票价：¥{a.ticketPrice}</span>}
                      {a.openingHours && <span>营业：{a.openingHours}</span>}
                      {a.submittedBy && (
                        <span>
                          提交人：{a.submittedBy.name || a.submittedBy.email}
                        </span>
                      )}
                      <span>
                        提交时间：{a.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <form action={approveAttraction.bind(null, a.id)}>
                      <Button size="sm" type="submit" className="gap-1">
                        通过
                      </Button>
                    </form>
                    <RejectDialog attractionId={a.id} attractionName={a.nameZh} />
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
