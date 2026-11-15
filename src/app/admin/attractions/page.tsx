import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock } from "@/components/ui/clay-icons";
import { deleteAttraction } from "./actions";
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

export default async function AdminAttractionsPage() {
  const [attractions, pendingCount] = await Promise.all([
    prisma.attraction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        destination: { select: { id: true, nameZh: true } },
      },
    }),
    prisma.attraction.count({ where: { status: "PENDING" } }),
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
          <h1 className="text-3xl font-medium tracking-tight text-foreground">景点管理</h1>
          {pendingCount > 0 && (
            <Link
              href="/admin/attractions/pending"
              className="text-sm text-warning-foreground hover:underline inline-flex items-center gap-1 mt-1"
            >
              <Clock className="w-3 h-3" />
              {pendingCount} 个景点待审核
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/attractions/pending">
            <Button variant="outline" size="sm" className="gap-1">
              <Clock className="w-4 h-4" />
              待审核
            </Button>
          </Link>
          <Link href="/admin/attractions/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              添加景点
            </Button>
          </Link>
        </div>
      </div>

      {attractions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>暂无景点</p>
        </div>
      ) : (
        <div className="space-y-4">
          {attractions.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{a.nameZh}</h3>
                    <Badge variant={a.isPublished ? "default" : "secondary"}>
                      {a.isPublished ? "已发布" : "草稿"}
                    </Badge>
                    {statusBadge(a.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    所属目的地：
                    <Link
                      href={`/destinations/${a.destination.id}`}
                      className="text-primary hover:underline"
                    >
                      {a.destination.nameZh}
                    </Link>
                    {a.address && ` · ${a.address}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/destinations/${a.destination.id}/attractions/${a.id}`}
                  >
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </Link>
                  <Link href={`/admin/attractions/${a.id}/edit`}>
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
                          确定要删除「{a.nameZh}」吗？该操作不可撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <form action={deleteAttraction.bind(null, a.id)}>
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
