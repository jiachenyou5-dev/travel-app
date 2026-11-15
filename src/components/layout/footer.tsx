import Link from "next/link";
import { Compass } from "@/components/ui/clay-icons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-10 sm:flex-row sm:items-center sm:px-8 sm:py-12">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold"><Compass className="size-9" />旅游管理</Link>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-7 text-sm">
          <Link href="/destinations">目的地</Link><Link href="/journals">游记</Link><Link href="/trips/new">旅行计划</Link>
        </nav>
        <p className="text-xs text-muted-foreground">旅游管理 © {new Date().getFullYear()} · 记录每一次出发</p>
      </div>
    </footer>
  );
}
