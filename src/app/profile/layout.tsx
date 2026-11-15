import { requireAuth } from "@/lib/auth-utils";
import { ProfileNav } from "@/components/layout/profile-nav";

export const dynamic = "force-dynamic";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight">个人中心</h1>
      <p className="mt-3 mb-10 text-muted-foreground">收藏心动的地方，留下属于你的旅行记忆。</p>
      <div className="grid gap-8 md:grid-cols-[230px_1fr]">
        <aside><ProfileNav /></aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
