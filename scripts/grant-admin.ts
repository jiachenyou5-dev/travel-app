import "dotenv/config";
import { z } from "zod";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = z.email().parse(process.argv[2]?.trim().toLowerCase());
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("请先在网站注册该邮箱，再授予管理员权限");
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log("管理员权限已更新，请重新登录网站");
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
