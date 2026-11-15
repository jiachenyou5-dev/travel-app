import Link from "next/link";
import { signOut } from "@/lib/auth";
import { safeAuth } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileNav } from "./mobile-nav";
import { Compass, Search } from "@/components/ui/clay-icons";
import { NavLink } from "./active-nav";

export async function Header() {
  const session = await safeAuth();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-foreground font-semibold text-lg tracking-tight">
            <Compass className="size-10" />
            旅游管理
          </Link>

          <nav aria-label="主导航" className="hidden md:flex items-center gap-9">
            <NavLink href="/destinations">目的地</NavLink>
            <NavLink href="/journals">游记</NavLink>
            <NavLink href={user ? "/trips" : "/trips/new"}>旅行计划</NavLink>
            {user?.role === "ADMIN" && <NavLink href="/admin">管理后台</NavLink>}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/search" className="hidden sm:flex items-center gap-1.5 mr-3 text-sm"><Search className="size-5" />搜索</Link>
            <MobileNav isAdmin={user?.role === "ADMIN"} isLoggedIn={!!user} />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/15 text-primary text-sm">
                          {(user.name || user.email || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                    {user.name || user.email}
                  </div>
                  <DropdownMenuItem render={<Link href="/profile">个人中心</Link>} />
                  <DropdownMenuItem
                    render={
                      <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        <button type="submit" className="w-full text-left text-destructive">
                          退出登录
                        </button>
                      </form>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-2 text-sm font-medium">登录</Link>
                <Button nativeButton={false} render={<Link href="/register" />}>注册</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
