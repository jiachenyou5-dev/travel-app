import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { User, Heart, MessageSquare, Send, MapPin, Calendar, BookOpen } from "lucide-react";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-foreground">个人中心</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              个人信息
            </Link>
            <Link
              href="/profile/favorites"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Heart className="w-4 h-4" />
              我的收藏
            </Link>
            <Link
              href="/profile/reviews"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              我的评论
            </Link>
            <Link
              href="/profile/submissions"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Send className="w-4 h-4" />
              我的提交
            </Link>
            <Link
              href="/profile/footprint"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <MapPin className="w-4 h-4" />
              旅行足迹
            </Link>
            <Link
              href="/trips"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Calendar className="w-4 h-4" />
              我的行程
            </Link>
            <Link
              href="/profile/journals"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              我的游记
            </Link>
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
