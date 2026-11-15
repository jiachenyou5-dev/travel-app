"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, MessageSquare, Send, MapPin, Calendar, BookOpen } from "@/components/ui/clay-icons";

const items = [
  { href: "/profile", label: "个人信息", Icon: User },
  { href: "/profile/favorites", label: "我的收藏", Icon: Heart },
  { href: "/profile/reviews", label: "我的评论", Icon: MessageSquare },
  { href: "/profile/submissions", label: "我的提交", Icon: Send },
  { href: "/profile/footprint", label: "旅行足迹", Icon: MapPin },
  { href: "/trips", label: "我的行程", Icon: Calendar },
  { href: "/profile/journals", label: "我的游记", Icon: BookOpen },
];

export function ProfileNav() {
  const pathname = usePathname();
  return <nav aria-label="个人中心导航" className="flex gap-1 overflow-x-auto md:flex-col">
    {items.map(({ href, label, Icon }) => <Link key={href} href={href} aria-current={(href === "/profile" ? pathname === href : pathname.startsWith(href)) ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-md px-4 text-sm transition-colors ${((href === "/profile" ? pathname === href : pathname.startsWith(href))) ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}><Icon className="size-6" />{label}</Link>)}
  </nav>;
}
