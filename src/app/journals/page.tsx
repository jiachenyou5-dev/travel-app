import { pageNumber } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, MessageCircle } from "@/components/ui/clay-icons";
import { RegionFilter } from "@/components/journals/region-filter";
import { Suspense } from "react";

export const metadata = {
  title: "游记",
  description: "浏览旅行者的游记和旅行故事",
};

export default async function JournalsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; page?: string }>;
}) {
  const { region, page: rawPage } = await searchParams;

  const where = {
    isPublished: true,
    ...(region ? { region } : {}),
  };

  const total = await prisma.journal.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / 30));
  const page = Math.min(pageNumber(rawPage), pageCount);
  const journals = await prisma.journal.findMany({
    where,
    orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }, { id: "desc" }],
    include: {
      user: { select: { name: true } },
      photos: { take: 1, orderBy: { sortOrder: "asc" } },
      _count: { select: { comments: true } },
    },
    take: 30,
    skip: (page - 1) * 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">旅途中的故事</h1>
        <Link
          href="/profile/journals/new"
          className="text-primary hover:underline text-sm"
        >
          写游记
        </Link>
      </div>

      {/* 地区筛选 */}
      <div className="mb-6">
        <Suspense>
          <RegionFilter currentRegion={region} />
        </Suspense>
      </div>

      {journals.length === 0 ? (
        <div className="rounded-xl bg-secondary py-20 px-6 text-center text-muted-foreground">
          <BookOpen className="size-24 mx-auto mb-4" />
          <p>{region ? `暂无「${region}」地区的游记` : "还没有游记"}</p>
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
                  <div className="h-40 bg-[var(--clay-peach)] rounded-t-xl flex items-center justify-center img-zoom">
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
                    {j.region && (
                      <>
                        <span>·</span>
                        <span className="text-primary/80">{j.region}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {j.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {j._count.comments}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} pageCount={pageCount} pathname="/journals" filters={region ? { region } : {}} />
    </div>
  );
}
