import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteJournal } from "@/app/actions/journals";
import { Plus, Pencil, Trash2, BookOpen } from "@/components/ui/clay-icons";

export default async function ProfileJournalsPage() {
  const user = await requireAuth();

  const journals = await prisma.journal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      photos: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">我的游记</h2>
        <Link href="/profile/journals/new">
          <Button size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            写游记
          </Button>
        </Link>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
          <p>还没有游记</p>
          <p className="text-sm mt-1">
            分享你的旅行故事和心得
          </p>
        </div>
      ) : (
        <div className="space-y-3 card-stagger">
          {journals.map((j) => (
            <Card key={j.id} className="card-float">
              <CardContent className="py-4 flex items-center justify-between">
                <Link href={`/journals/${j.id}`} className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{j.title}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(j.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/profile/journals/${j.id}/edit`}>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteJournal.bind(null, j.id)}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      type="submit"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
