import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "@/components/ui/clay-icons";
import { DestinationCard } from "@/components/destinations/destination-card";
import { StarRatingDisplay } from "@/components/ui/star-rating";

export default async function HomePage() {
  const [destinations, recentReviews, stats] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, status: "APPROVED" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        displayPhotos: {
          orderBy: { sortOrder: "asc" },
          take: 10,
          select: { id: true, url: true, thumbnailUrl: true },
        },
      },
    }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
      },
    }),
    Promise.all([
      prisma.destination.count({ where: { isPublished: true, status: "APPROVED" } }),
      prisma.attraction.count({ where: { isPublished: true, status: "APPROVED" } }),
      prisma.review.count(),
    ]),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:pt-16">
        <div className="grid items-center gap-4 lg:min-h-[480px] lg:grid-cols-[7fr_5fr]">
          <div className="relative z-10 pb-6 lg:self-start lg:pt-8">
            <h1 className="text-[38px] leading-[1.3] font-medium tracking-[-1.5px] sm:text-[52px] lg:text-[68px] lg:tracking-[-2.5px]">
              把向往的地方，<br />变成出发的方向。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">发现目的地，收藏心动，记录每一段旅程。</p>
            <div className="mt-9 flex flex-wrap items-center gap-7">
              <Button nativeButton={false} render={<Link href="/destinations" />} className="px-7 text-base">探索目的地</Button>
              <Link href="/trips/new" className="border-b border-foreground pb-1 text-sm font-medium">规划我的行程</Link>
            </div>
          </div>
          <div className="relative -mx-3 h-[300px] sm:h-[380px] lg:-ml-16 lg:h-[470px]">
            <Image src="/images/clay/hero.png" alt="手作黏土山峦、蜿蜒小径与旅行箱" fill priority sizes="(max-width: 1024px) 90vw, 640px" className="object-contain" />
          </div>
        </div>
        <form action="/search" className="mt-6 flex items-center gap-3 rounded-lg border border-foreground/50 bg-background p-1.5 sm:p-2">
          <Search className="ml-2 size-7 sm:ml-4" />
          <Input name="q" aria-label="搜索目的地、景点、美食、住宿" placeholder="搜索目的地、景点、美食、住宿" maxLength={100} className="h-12 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 md:text-base" />
          <Button type="submit" className="h-12 shrink-0 px-6 text-base">搜索</Button>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
          <span><strong className="mr-1 text-lg font-semibold text-foreground">{stats[0]}</strong> 个目的地</span>
          <span><strong className="mr-1 text-lg font-semibold text-foreground">{stats[1]}</strong> 处景点</span>
          {stats[2] > 0 && <span><strong className="mr-1 text-lg font-semibold text-foreground">{stats[2]}</strong> 条旅行体验</span>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-5">
          <h2 className="text-[24px] leading-tight font-medium tracking-tight sm:text-[40px]">下一站，想去哪里？</h2>
          <Link href="/destinations" className="flex shrink-0 items-center gap-2 border-b border-foreground pb-1 text-sm">查看全部<ArrowRight className="size-5" /></Link>
        </div>
        {destinations.length === 0 ? <p className="rounded-xl bg-secondary px-8 py-16 text-center text-muted-foreground">暂无目的地，请先通过管理后台添加</p> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, index) => <DestinationCard key={destination.id} destination={destination} index={index} />)}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-2 lg:pb-24">
        <div className="relative overflow-hidden rounded-xl bg-[var(--clay-teal)] p-8 text-white sm:p-10">
          <div className="relative z-10 max-w-[75%] sm:max-w-[68%]">
            <h2 className="text-[32px] leading-[1.3] font-medium tracking-tight sm:text-[38px]">让灵感，<br />成为行程。</h2>
            <p className="mt-5 text-sm leading-7 text-white/80">把想去的地方、感兴趣的体验整理成专属行程，轻松规划每一次出发。</p>
            <Button nativeButton={false} render={<Link href="/trips/new" />} className="mt-7 bg-background text-[#0a0a0a] hover:bg-background/90">开始规划</Button>
          </div>
          <div aria-hidden="true" className="absolute right-3 bottom-5 size-28 bg-no-repeat sm:right-5 sm:size-44" style={{ backgroundImage: "url('/images/clay/features.png')", backgroundSize: "200% 100%", backgroundPosition: "left center" }} />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-secondary p-8 sm:p-10">
          <div className="relative z-10 max-w-[75%] sm:max-w-[68%]">
            <h2 className="text-[32px] leading-[1.3] font-medium tracking-tight sm:text-[38px]">写下你的<br />旅行故事。</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">分享旅途中的风景、体验与感受，让更多人发现旅行的美好。</p>
            <Link href="/journals" className="mt-7 inline-flex items-center gap-3 border-b border-foreground pb-1 text-sm font-medium">浏览游记<ArrowRight className="size-5" /></Link>
          </div>
          <div aria-hidden="true" className="absolute right-3 bottom-5 size-28 bg-no-repeat sm:right-5 sm:size-44" style={{ backgroundImage: "url('/images/clay/features.png')", backgroundSize: "200% 100%", backgroundPosition: "right center" }} />
        </div>
      </section>

      {recentReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <h2 className="mb-8 text-3xl font-medium tracking-tight">旅途中的真实声音</h2>
          <div className="grid gap-5 md:grid-cols-3">{recentReviews.slice(0, 3).map(review => (
            <article key={review.id} className="rounded-lg bg-secondary p-7">
              <StarRatingDisplay rating={review.rating} />
              <p className="mt-5 line-clamp-4 text-sm leading-7">{review.content}</p>
              <p className="mt-6 text-sm text-muted-foreground">{review.user.name || "旅行者"}</p>
            </article>
          ))}</div>
        </section>
      )}
    </div>
  );
}
