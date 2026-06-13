import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

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
