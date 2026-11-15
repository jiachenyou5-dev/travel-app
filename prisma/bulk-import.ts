import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { geocode, poiSearch } from "../src/lib/amap";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const CITIES: { nameZh: string; province: string; searchCity: string }[] = [
  { nameZh: "北京", province: "北京市", searchCity: "北京" },
  { nameZh: "上海", province: "上海市", searchCity: "上海" },
  { nameZh: "西安", province: "陕西省", searchCity: "西安" },
  { nameZh: "杭州", province: "浙江省", searchCity: "杭州" },
  { nameZh: "桂林", province: "广西壮族自治区", searchCity: "桂林" },
  { nameZh: "张家界", province: "湖南省", searchCity: "张家界" },
  { nameZh: "厦门", province: "福建省", searchCity: "厦门" },
  { nameZh: "重庆", province: "重庆市", searchCity: "重庆" },
  { nameZh: "昆明", province: "云南省", searchCity: "昆明" },
  { nameZh: "苏州", province: "江苏省", searchCity: "苏州" },
];

const TYPES = {
  attraction: "110000",
  restaurant: "050000",
  accommodation: "100000",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("=== 批量导入目的地数据 ===\n");
  console.log(`共 ${CITIES.length} 个城市待处理\n`);

  for (let i = 0; i < CITIES.length; i++) {
    const city = CITIES[i];
    console.log(`[${i + 1}/${CITIES.length}] 正在处理: ${city.nameZh}`);

    const existing = await prisma.destination.findFirst({
      where: { nameZh: city.nameZh },
    });
    if (existing) {
      console.log(`  ⏭ ${city.nameZh} 已存在，跳过`);
      continue;
    }

    const geo = await geocode(city.nameZh);
    if (!geo) {
      console.log(`  ✗ 地理编码失败，跳过`);
      continue;
    }

    console.log(
      `  坐标: ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)} | ${geo.province}`
    );

    const destination = await prisma.destination.create({
      data: {
        nameZh: city.nameZh,
        province: city.province,
        country: "中国",
        latitude: geo.lat,
        longitude: geo.lng,
        description: `${city.nameZh}${city.province ? `位于${city.province}` : ""}，是中国著名旅游目的地。拥有丰富的自然风光和人文景观，每年吸引大量游客前来观光旅游。`,
      },
    });
    console.log(`  ✓ 目的地已创建: ${destination.nameZh}`);

    await sleep(300);

    const [attractions, restaurants, accommodations] = await Promise.all([
      poiSearch("", city.searchCity, TYPES.attraction),
      poiSearch("", city.searchCity, TYPES.restaurant),
      poiSearch("", city.searchCity, TYPES.accommodation),
    ]);

    console.log(
      `  POI — 景点:${attractions.length} 美食:${restaurants.length} 住宿:${accommodations.length}`
    );

    const topAttractions = attractions.slice(0, 4);
    const topRestaurants = restaurants.slice(0, 4);
    const topAccommodations = accommodations.slice(0, 3);

    function safeStr(v: unknown): string | undefined {
      if (typeof v === "string" && v.length > 0) return v;
      if (Array.isArray(v)) {
        const s = v.filter((x) => typeof x === "string").join("");
        return s.length > 0 ? s : undefined;
      }
      return undefined;
    }

    for (const a of topAttractions) {
      await prisma.attraction.create({
        data: {
          destinationId: destination.id,
          nameZh: a.name,
          address: safeStr(a.address),
          latitude: a.lat,
          longitude: a.lng,
        },
      });
    }
    if (topAttractions.length > 0) {
      console.log(`  ✓ 已添加 ${topAttractions.length} 个景点`);
    }

    for (const r of topRestaurants) {
      await prisma.restaurant.create({
        data: {
          destinationId: destination.id,
          nameZh: r.name,
          address: safeStr(r.address),
          latitude: r.lat,
          longitude: r.lng,
        },
      });
    }
    if (topRestaurants.length > 0) {
      console.log(`  ✓ 已添加 ${topRestaurants.length} 个美食`);
    }

    for (const a of topAccommodations) {
      await prisma.accommodation.create({
        data: {
          destinationId: destination.id,
          nameZh: a.name,
          address: safeStr(a.address),
          latitude: a.lat,
          longitude: a.lng,
        },
      });
    }
    if (topAccommodations.length > 0) {
      console.log(`  ✓ 已添加 ${topAccommodations.length} 个住宿`);
    }

    console.log("");
    await sleep(500);
  }

  const total = await prisma.destination.count();
  const totalAtt = await prisma.attraction.count();
  const totalRes = await prisma.restaurant.count();
  const totalAcc = await prisma.accommodation.count();

  console.log("=== 导入完成 ===");
  console.log(`目的地: ${total} | 景点: ${totalAtt} | 美食: ${totalRes} | 住宿: ${totalAcc}`);
}

main()
  .catch((e) => {
    console.error("导入失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
