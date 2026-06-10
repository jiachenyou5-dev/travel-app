import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function requireAuth() {
  const session = await auth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user) {
    throw new Error("请先登录");
  }
  return user;
}

export async function requireAdmin() {
  const session = await auth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user || user.role !== "ADMIN") {
    throw new Error("需要管理员权限");
  }
  return user;
}
