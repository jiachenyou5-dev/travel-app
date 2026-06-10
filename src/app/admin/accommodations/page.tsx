import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteAccommodation } from "./actions";
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

export default async function AdminAccommodationsPage() {
  const accommodations = await prisma.accommodation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { id: true, nameZh: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">住宿管理</h1>
        <Link href="/admin/accommodations/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            添加住宿
          </Button>
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>暂无住宿</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accommodations.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{a.nameZh}</h3>
                    <Badge variant={a.isPublished ? "default" : "secondary"}>
                      {a.isPublished ? "已发布" : "草稿"}
                    </Badge>
                    {a.accommodationType && (
                      <Badge variant="outline">{a.accommodationType}</Badge>
                    )}
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
                    href={`/destinations/${a.destination.id}/accommodations/${a.id}`}
                  >
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </Link>
                  <Link href={`/admin/accommodations/${a.id}/edit`}>
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
                        <form action={deleteAccommodation.bind(null, a.id)}>
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
