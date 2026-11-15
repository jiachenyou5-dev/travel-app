import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { MessageSquare, Star, ImageIcon } from "@/components/ui/clay-icons";

export default async function ProfilePage() {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      _count: { select: { reviews: true, photos: true } },
    },
  });

  if (!user) {
    return <p className="text-muted-foreground">用户不存在</p>;
  }

  const totalFavorites = await prisma.favorite.count({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/15 text-primary text-xl">
                {(user.name || user.email)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {user.name || "未设置昵称"}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {user.role === "ADMIN" ? "管理员" : "普通用户"} ·{" "}
                {user.createdAt.toLocaleDateString("zh-CN")} 加入
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{user._count.reviews}</div>
              <div className="text-xs text-muted-foreground">评论</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <ImageIcon className="w-5 h-5 text-success mx-auto mb-1" />
              <div className="text-lg font-bold">{user._count.photos}</div>
              <div className="text-xs text-muted-foreground">照片</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Star className="w-5 h-5 text-star mx-auto mb-1" />
              <div className="text-lg font-bold">{totalFavorites}</div>
              <div className="text-xs text-muted-foreground">收藏</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">编辑资料</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm currentName={user.name ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">修改密码</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
