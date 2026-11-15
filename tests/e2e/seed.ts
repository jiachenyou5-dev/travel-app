import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

async function main() {
  if (!process.env.DATABASE_URL?.includes("travel-e2e")) throw new Error("仅允许初始化隔离测试库");
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: process.env.DATABASE_URL }) });
  try {
    const passwordHash = await bcrypt.hash("Testpass123!", 12);
    await prisma.user.upsert({ where: { id: "test-user" }, create: { id: "test-user", name: "测试用户", email: "user@example.test", passwordHash }, update: { passwordHash } });
    await prisma.user.upsert({ where: { id: "test-admin" }, create: { id: "test-admin", name: "测试管理员", email: "admin@example.test", passwordHash, role: "ADMIN" }, update: { passwordHash } });
    for (let i = 0; i < 13; i++) await prisma.destination.upsert({ where: { id: `test-d${i}` }, create: { id: `test-d${i}`, nameZh: `测试城市${i}`, province: i === 0 ? "江苏省" : "浙江省" }, update: {} });
    await prisma.destination.upsert({ where: { id: "test-hidden" }, create: { id: "test-hidden", nameZh: "下架目的地", isPublished: false }, update: {} });
    await prisma.attraction.upsert({ where: { id: "test-attraction" }, create: { id: "test-attraction", destinationId: "test-d0", nameZh: "测试景点" }, update: {} });
    await prisma.attraction.upsert({ where: { id: "test-hidden-child" }, create: { id: "test-hidden-child", destinationId: "test-hidden", nameZh: "不应展示的景点" }, update: {} });
    await prisma.review.upsert({ where: { id: "test-review" }, create: { id: "test-review", userId: "test-user", attractionId: "test-attraction", rating: 4, content: "原始评论" }, update: { content: "原始评论" } });
    await prisma.accommodation.upsert({ where: { id: "test-pending" }, create: { id: "test-pending", destinationId: "test-d0", nameZh: "测试待审酒店", submittedById: "test-user", status: "PENDING", isPublished: false }, update: { status: "PENDING", isPublished: false } });
    await prisma.journal.upsert({ where: { id: "test-journal" }, create: { id: "test-journal", userId: "test-admin", title: "并发互动测试游记", content: "隔离环境测试", likeCount: 0 }, update: { likeCount: 0 } });
    await prisma.journalLike.deleteMany({ where: { journalId: "test-journal" } });
  } finally { await prisma.$disconnect(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
