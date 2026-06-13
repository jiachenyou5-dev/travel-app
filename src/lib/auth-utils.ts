import { auth } from "./auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

/**
 * 安全版 auth()：捕获异常返回 null，避免 Server Component 渲染崩溃。
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

/**
 * 要求用户已登录。未登录时重定向到登录页。
 * 使用 redirect() 而非 throw，这样 Next.js 在构建预渲染时
 * 能正确识别为动态路由并跳过预渲染。
 */
export async function requireAuth() {
  const session = await safeAuth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * 要求管理员权限。未登录或非管理员时重定向。
 */
export async function requireAdmin() {
  const session = await safeAuth();
  const user = session?.user as { id: string; role?: string } | undefined;
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}
