import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { deleteDestination, togglePublish } from "./actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function AdminDestinationsPage() {
  const [destinations, pendingCount] = await Promise.all([
    prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            attractions: true,
            restaurants: true,
            accommodations: true,
          },
        },
      },
    }),
    prisma.destination.count({ where: { status: "PENDING" } }),
  ]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />待审核
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">已拒绝</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">目的地管理</h1>
          {pendingCount > 0 && (
            <Link
              href="/admin/destinations/pending"
              className="text-sm text-warning-foreground hover:underline inline-flex items-center gap-1 mt-1"
            >
              <Clock className="w-3 h-3" />
              {pendingCount} 个目的地待审核
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/destinations/pending">
            <Button variant="outline" size="sm" className="gap-1">
              <Clock className="w-4 h-4" />
              待审核
            </Button>
          </Link>
          <Link href="/admin/destinations/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              添加目的地
            </Button>
          </Link>
        </div>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>暂无目的地</p>
        </div>
      ) : (
        <div className="space-y-4">
          {destinations.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{d.nameZh}</h3>
                    <Badge variant={d.isPublished ? "default" : "secondary"}>
                      {d.isPublished ? "已发布" : "草稿"}
                    </Badge>
                    {statusBadge(d.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {d.province || ""} · {d.country} · 景点{" "}
                    {d._count.attractions} · 美食 {d._count.restaurants} · 住宿{" "}
                    {d._count.accommodations}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={togglePublish.bind(null, d.id, d.isPublished)}>
                    <Button variant="ghost" size="sm" type="submit">
                      {d.isPublished ? "下架" : "发布"}
                    </Button>
                  </form>
                  <Link href={`/admin/destinations/${d.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除「{d.nameZh}」吗？该操作不可撤销，
                          所有关联的景点、美食、住宿数据也会一并删除。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <form action={deleteDestination.bind(null, d.id)}>
                          <AlertDialogAction type="submit">
                            确认删除
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
