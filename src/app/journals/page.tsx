import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "游记",
  description: "浏览旅行者的游记和旅行故事",
};

export default async function JournalsPage() {
  const journals = await prisma.journal.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      photos: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    take: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">游记</h1>
        <Link
          href="/profile/journals/new"
          className="text-primary hover:underline text-sm"
        >
          写游记
        </Link>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p>还没有游记</p>
          <p className="text-sm mt-1">成为第一个分享旅行故事的人</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 card-stagger">
          {journals.map((j) => (
            <Link key={j.id} href={`/journals/${j.id}`}>
              <Card className="card-float h-full">
                {j.coverImage ? (
                  <div className="img-zoom rounded-t-xl">
                    <img
                      src={j.coverImage}
                      alt={j.title}
                      className="h-40 w-full object-cover rounded-t-xl"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-t-xl flex items-center justify-center img-zoom">
                    <BookOpen className="w-10 h-10 text-primary/40" />
                  </div>
                )}
                <CardContent className="py-4">
                  <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                    {j.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{j.user.name ?? "匿名用户"}</span>
                    <span>·</span>
                    <span>
                      {new Date(j.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
