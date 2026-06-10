import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, Clock, CheckCircle2, XCircle, Globe, UtensilsCrossed, Building2 } from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }
> = {
  PENDING: { label: "待审核", variant: "secondary", icon: <Clock className="w-4 h-4" /> },
  APPROVED: { label: "已通过", variant: "default", icon: <CheckCircle2 className="w-4 h-4" /> },
  REJECTED: { label: "已拒绝", variant: "destructive", icon: <XCircle className="w-4 h-4" /> },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  destination: { label: "目的地", icon: <Globe className="w-3 h-3" /> },
  attraction: { label: "景点", icon: <Building2 className="w-3 h-3" /> },
  restaurant: { label: "美食", icon: <UtensilsCrossed className="w-3 h-3" /> },
};

interface SubmissionItem {
  id: string;
  type: "destination" | "attraction" | "restaurant";
  name: string;
  status: string;
  reviewNotes: string | null;
  createdAt: Date;
  link: string;
  subtitle: string;
}

export default async function SubmissionsPage() {
  const user = await requireAuth();

  const [attractionSubs, destinationSubs, restaurantSubs] = await Promise.all([
    prisma.attraction.findMany({
      where: { submittedById: user.id },
      orderBy: { createdAt: "desc" },
      include: { destination: { select: { id: true, nameZh: true } } },
    }),
    prisma.destination.findMany({
      where: { submittedById: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.restaurant.findMany({
      where: { submittedById: user.id },
      orderBy: { createdAt: "desc" },
      include: { destination: { select: { id: true, nameZh: true } } },
    }),
  ]);

  const allSubmissions: SubmissionItem[] = [
    ...destinationSubs.map((d) => ({
      id: d.id,
      type: "destination" as const,
      name: d.nameZh,
      status: d.status,
      reviewNotes: d.reviewNotes,
      createdAt: d.createdAt,
      link: `/destinations/${d.id}`,
      subtitle: [d.province, d.country].filter(Boolean).join(" · ") || "",
    })),
    ...attractionSubs.map((a) => ({
      id: a.id,
      type: "attraction" as const,
      name: a.nameZh,
      status: a.status,
      reviewNotes: a.reviewNotes,
      createdAt: a.createdAt,
      link: `/destinations/${a.destination.id}/attractions/${a.id}`,
      subtitle: `${a.destination.nameZh}${a.address ? ` · ${a.address}` : ""}`,
    })),
    ...restaurantSubs.map((r) => ({
      id: r.id,
      type: "restaurant" as const,
      name: r.nameZh,
      status: r.status,
      reviewNotes: r.reviewNotes,
      createdAt: r.createdAt,
      link: `/destinations/${r.destination.id}/restaurants/${r.id}`,
      subtitle: `${r.destination.nameZh}${r.address ? ` · ${r.address}` : ""}`,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">我的提交</h2>

      {allSubmissions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p>还没有提交过内容</p>
          <p className="text-sm mt-2">
            前往
            <Link href="/destinations" className="text-primary hover:underline mx-1">
              目的地
            </Link>
            页面提交新内容
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allSubmissions.map((s) => {
            const cfg = statusConfig[s.status] ?? statusConfig.PENDING;
            const tcfg = typeConfig[s.type];
            return (
              <Card key={`${s.type}-${s.id}`}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1 text-xs shrink-0">
                        {tcfg.icon}
                        {tcfg.label}
                      </Badge>
                      <Link href={s.link} className="hover:underline">
                        <h3 className="font-medium text-foreground truncate">
                          {s.name}
                        </h3>
                      </Link>
                      <Badge variant={cfg.variant} className="gap-1 text-xs">
                        {cfg.icon}
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {s.subtitle || "—"}
                    </p>
                    {s.reviewNotes && (
                      <p className="text-sm text-destructive mt-1">
                        审核备注：{s.reviewNotes}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground/70 shrink-0 ml-4">
                    {s.createdAt.toLocaleDateString("zh-CN")}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
