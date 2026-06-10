import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("开始填充种子数据...");

  const passwordHash = await bcrypt.hash("123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@travel.com" },
    update: {},
    create: {
      name: "管理员",
      email: "admin@travel.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("已创建管理员:", admin.email, "(密码: 123456)");

  const user = await prisma.user.upsert({
    where: { email: "user@travel.com" },
    update: {},
    create: {
      name: "旅行者",
      email: "user@travel.com",
      passwordHash,
      role: "USER",
    },
  });
  console.log("已创建用户:", user.email, "(密码: 123456)");

  const destinations = [
    {
      nameZh: "三亚",
      nameEn: "Sanya",
      province: "海南省",
      description: "三亚位于海南岛最南端，是中国著名的热带海滨旅游城市，以阳光、沙滩、海水闻名于世。拥有亚龙湾、天涯海角、南山寺等著名景点。",
      country: "中国",
      latitude: 18.2528,
      longitude: 109.512,
    },
    {
      nameZh: "丽江",
      nameEn: "Lijiang",
      province: "云南省",
      description: "丽江古城是世界文化遗产，拥有独特的纳西族文化和美丽的自然风光。玉龙雪山、泸沽湖等景点令人流连忘返。",
      country: "中国",
      latitude: 26.8721,
      longitude: 100.2299,
    },
    {
      nameZh: "成都",
      nameEn: "Chengdu",
      province: "四川省",
      description: "成都是四川省省会，以美食、大熊猫和悠闲的生活方式闻名。宽窄巷子、锦里古街、都江堰是必游之地。",
      country: "中国",
      latitude: 30.5728,
      longitude: 104.0668,
    },
  ];

  for (const dest of destinations) {
    const existing = await prisma.destination.findFirst({
      where: { nameZh: dest.nameZh },
    });
    if (!existing) {
      const d = await prisma.destination.create({ data: dest });
      console.log("已创建目的地:", d.nameZh);

      if (d.nameZh === "三亚") {
        await prisma.attraction.createMany({
          data: [
            {
              destinationId: d.id,
              nameZh: "亚龙湾",
              description: "被誉为天下第一湾，拥有7公里长的银白色沙滩。",
              address: "三亚市亚龙湾国家旅游度假区",
              ticketPrice: 0,
            },
            {
              destinationId: d.id,
              nameZh: "天涯海角",
              description: "著名的海滨风景区，以天涯海角石刻闻名。",
              address: "三亚市天涯区",
              ticketPrice: 81,
            },
          ],
        });
        await prisma.restaurant.createMany({
          data: [
            {
              destinationId: d.id,
              nameZh: "第一市场海鲜",
              cuisineType: "海鲜",
              priceRange: "人均 100-200 元",
              address: "三亚市天涯区第一市场",
            },
          ],
        });
        console.log("  - 已添加景点和美食数据");
      }

      if (d.nameZh === "成都") {
        await prisma.attraction.createMany({
          data: [
            {
              destinationId: d.id,
              nameZh: "宽窄巷子",
              description: "由宽巷子、窄巷子和井巷子三条平行的清朝古街道组成。",
              address: "成都市青羊区",
              ticketPrice: 0,
            },
          ],
        });
        await prisma.restaurant.createMany({
          data: [
            {
              destinationId: d.id,
              nameZh: "龙抄手",
              cuisineType: "四川小吃",
              priceRange: "人均 30-60 元",
              address: "成都市锦江区春熙路",
            },
          ],
        });
        console.log("  - 已添加景点和美食数据");
      }
    }
  }

  console.log("\n种子数据填充完成！");
  console.log("登录信息：");
  console.log("  管理员 - admin@travel.com / 123456");
  console.log("  普通用户 - user@travel.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
