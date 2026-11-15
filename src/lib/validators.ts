import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "请输入用户名").max(50),
  email: z.string().trim().toLowerCase().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少 6 位").refine(value => new TextEncoder().encode(value).length <= 72, "密码不能超过 72 字节"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("请输入有效的邮箱地址"),
  password: z.string().trim().min(1, "请输入密码"),
});

export const destinationSchema = z.object({
  nameZh: z.string().trim().min(1, "请输入目的地名称").max(100),
  nameEn: z.string().trim().max(500).optional(),
  province: z.string().trim().max(500).optional(),
  description: z.string().trim().max(20000).optional(),
  country: z.string().trim().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const attractionSchema = z.object({
  nameZh: z.string().trim().min(1, "请输入景点名称").max(100),
  nameEn: z.string().trim().max(500).optional(),
  description: z.string().trim().max(20000).optional(),
  address: z.string().trim().max(500).optional(),
  ticketPrice: z.number().nonnegative().optional(),
  openingHours: z.string().trim().max(500).optional(),
  website: z.union([z.literal(""), z.url().refine(value => /^https?:/.test(value), "仅支持 HTTP 或 HTTPS 地址")]).optional(),
  phone: z.string().trim().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const restaurantSchema = z.object({
  nameZh: z.string().trim().min(1, "请输入餐厅名称").max(100),
  nameEn: z.string().trim().max(500).optional(),
  description: z.string().trim().max(20000).optional(),
  address: z.string().trim().max(500).optional(),
  cuisineType: z.string().trim().max(500).optional(),
  priceRange: z.string().trim().max(500).optional(),
  openingHours: z.string().trim().max(500).optional(),
  website: z.union([z.literal(""), z.url().refine(value => /^https?:/.test(value), "仅支持 HTTP 或 HTTPS 地址")]).optional(),
  phone: z.string().trim().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const accommodationSchema = z.object({
  nameZh: z.string().trim().min(1, "请输入住宿名称").max(100),
  nameEn: z.string().trim().max(500).optional(),
  description: z.string().trim().max(20000).optional(),
  address: z.string().trim().max(500).optional(),
  accommodationType: z.string().trim().max(500).optional(),
  priceRange: z.string().trim().max(500).optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  amenities: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(500).optional(),
  website: z.union([z.literal(""), z.url().refine(value => /^https?:/.test(value), "仅支持 HTTP 或 HTTPS 地址")]).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  content: z.string().trim().min(1, "请输入评论内容").max(2000),
  visitDate: z.iso.date().optional(),
});

export const REGIONS = [
  "华北",
  "华东",
  "华南",
  "华中",
  "西南",
  "西北",
  "东北",
  "港澳台",
  "海外",
] as const;

export const journalSchema = z.object({
  title: z.string().trim().min(1, "请输入游记标题").max(100),
  content: z.string().trim().min(1, "请输入游记内容").max(50000),
  region: z.enum(REGIONS).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type AttractionInput = z.infer<typeof attractionSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type JournalInput = z.infer<typeof journalSchema>;
