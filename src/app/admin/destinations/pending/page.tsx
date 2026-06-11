import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApproveButton } from "./approve-button";
import { RejectDialog } from "./reject-dialog";

export default async function PendingDestinationsPage() {
  const pending = await prisma.destination.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      submittedBy: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">待审核目的地</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length === 0
              ? "暂无待审核目的地"
              : `${pending.length} 个目的地等待审核`}
          </p>
        </div>
        <Link href="/admin/destinations">
          <Button variant="outline">返回目的地管理</Button>
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>没有待审核的目的地</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((d) => (
            <Card key={d.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{d.nameZh}</h3>
                      <Badge variant="secondary">待审核</Badge>
                    </div>

                    {d.province && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {d.province} · {d.country}
                      </p>
                    )}

                    {d.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {d.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground/70">
                      {d.submittedBy && (
                        <span>
                          提交人：{d.submittedBy.name || d.submittedBy.email}
                        </span>
                      )}
                      <span>
                        提交时间：{d.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ApproveButton destinationId={d.id} destinationName={d.nameZh} />
                    <RejectDialog
                      destinationId={d.id}
                      destinationName={d.nameZh}
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
