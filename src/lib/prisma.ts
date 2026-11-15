import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("生产环境必须配置 DATABASE_URL");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./dev.db",
    }),
  });

// 始终缓存 PrismaClient 实例，避免生产环境每次请求都创建新连接
globalForPrisma.prisma = prisma;
