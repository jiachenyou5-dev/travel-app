import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { prisma } from "../src/lib/prisma";
import { poiSearch } from "../src/lib/amap";

interface Mismatch { id: string; category: "accommodation" | "restaurant"; name: string; expected: string; actual: string; previousIsPublished: boolean }

async function main() {
  if (!process.env.AMAP_API_KEY) throw new Error("需要配置 AMAP_API_KEY 才能复核来源分类");
  const apply = process.argv.includes("--apply");
  const rows = [
    ...(await prisma.accommodation.findMany({ where: { isPublished: true }, include: { destination: true } })).map(row => ({ ...row, category: "accommodation" as const, expected: "住宿服务" })),
    ...(await prisma.restaurant.findMany({ where: { isPublished: true }, include: { destination: true } })).map(row => ({ ...row, category: "restaurant" as const, expected: "餐饮服务" })),
  ];
  const mismatches: Mismatch[] = [];
  let skipped = 0;
  for (const row of rows) {
    await new Promise(resolve => setTimeout(resolve, 1100));
    const matches = await poiSearch(row.nameZh, row.destination.nameZh);
    const exact = matches.filter(poi => poi.name === row.nameZh);
    if (exact.length !== 1 || !exact[0].type) { skipped += 1; continue; }
    if (exact[0].type.includes(row.expected)) continue;
    mismatches.push({ id: row.id, category: row.category, name: row.nameZh, expected: row.expected, actual: exact[0].type, previousIsPublished: row.isPublished });
  }
  const reportFile = process.env.POI_AUDIT_OUTPUT || "poi-audit.json";
  await writeFile(reportFile, JSON.stringify({ checkedAt: new Date().toISOString(), mismatches }, null, 2));
  if (apply) {
    await prisma.$transaction(async tx => {
      for (const row of mismatches) {
        if (row.category === "accommodation") await tx.accommodation.update({ where: { id: row.id }, data: { isPublished: false } });
        else await tx.restaurant.update({ where: { id: row.id }, data: { isPublished: false } });
      }
    });
  }
  console.log(JSON.stringify({ checked: rows.length, skipped, mismatches: mismatches.length, applied: apply, reportFile }));
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
