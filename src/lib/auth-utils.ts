import { auth } from "./auth";
import type { Session } from "next-auth";

/**
 * 安全版 auth()：在生产环境中捕获异常，返回 null 而非抛出错误。
 * 解决生产部署时 NEXTAUTH_URL/SECRET 配置不当导致 Server Component 渲染崩溃的问题。
 */
export async function safeAuth(): Promise<Session | null> {
  try {
    return await auth();
  } catch (err) {
    console.error("[auth] safeAuth catch:", err);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await safeAuth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const session = await safeAuth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function requireAuth() {
  let session;
  try {
    session = await safeAuth();
  } catch {
    throw new Error("请先登录");
  }
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user) {
    throw new Error("请先登录");
  }
  return user;
}

export async function requireAdmin() {
  const session = await safeAuth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user || user.role !== "ADMIN") {
    throw new Error("需要管理员权限");
  }
  return user;
}
