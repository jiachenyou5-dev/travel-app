import { pageNumber } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { DestinationCard } from "@/components/destinations/destination-card";
import { MapPin, Plus } from "@/components/ui/clay-icons";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Button } from "@/components/ui/button";


export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; page?: string; q?: string; province?: string }>;
}) {
  const { submitted, page: rawPage, q: rawQuery, province: rawProvince } = await searchParams;
  const q = rawQuery?.trim().slice(0, 100) ?? "";
  const province = rawProvince?.trim().slice(0, 50) ?? "";
  const where = { isPublished: true, status: "APPROVED" as const, ...(q ? { nameZh: { contains: q } } : {}), ...(province ? { province: { contains: province } } : {}) };
  const total = await prisma.destination.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / 12));
  const page = Math.min(pageNumber(rawPage), pageCount);

  const [destinations, session] = await Promise.all([
    prisma.destination.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 12,
      skip: (page - 1) * 12,
      include: {
        displayPhotos: {
          orderBy: { sortOrder: "asc" },
          take: 10,
          select: { id: true, url: true, thumbnailUrl: true },
        },
      },
    }),
    safeAuth(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <BreadcrumbNav items={[{ label: "目的地" }]} />

      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-4">旅游目的地</h1>
      <p className="mb-9 mt-3 text-muted-foreground">从一座城市开始，发现值得出发的理由。</p>

      <form action="/destinations" className="flex flex-wrap gap-3 mb-8 rounded-lg bg-secondary p-4 sm:p-5">
        <Input name="q" aria-label="目的地关键词" placeholder="搜索目的地" defaultValue={q} maxLength={100} className="w-48" />
        <Input name="province" aria-label="省份筛选" placeholder="省份" defaultValue={province} maxLength={50} className="w-40" />
        <Button type="submit">筛选</Button>
      </form>
      {submitted === "1" && (
        <div className="mb-6 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-sm text-success-foreground">
          目的地已提交，等待管理员审核后公开展示。
        </div>
      )}

      {session?.user && (
        <div className="mb-6">
          <Link href="/destinations/submit">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              提交新目的地
            </Button>
          </Link>
        </div>
      )}

      {destinations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-lg">暂无目的地</p>
          <p className="text-sm mt-2">请管理员添加旅游目的地</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 card-stagger">
          {destinations.map((destination, index) => <DestinationCard key={destination.id} destination={destination} index={index} />)}
        </div>
      )}
      <Pagination page={page} pageCount={pageCount} pathname="/destinations" filters={{ q, province }} />
    </div>
  );
}
