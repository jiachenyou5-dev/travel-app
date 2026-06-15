import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "请输入用户名"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少 6 位"),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export const destinationSchema = z.object({
  nameZh: z.string().min(1, "请输入目的地名称"),
  nameEn: z.string().optional(),
  province: z.string().optional(),
  description: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const attractionSchema = z.object({
  nameZh: z.string().min(1, "请输入景点名称"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  ticketPrice: z.number().optional(),
  openingHours: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const restaurantSchema = z.object({
  nameZh: z.string().min(1, "请输入餐厅名称"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  cuisineType: z.string().optional(),
  priceRange: z.string().optional(),
  openingHours: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const accommodationSchema = z.object({
  nameZh: z.string().min(1, "请输入住宿名称"),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  accommodationType: z.string().optional(),
  priceRange: z.string().optional(),
  starRating: z.number().optional(),
  amenities: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(1, "请输入评论内容"),
  visitDate: z.string().optional(),
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
  title: z.string().min(1, "请输入游记标题"),
  content: z.string().min(1, "请输入游记内容"),
  region: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type AttractionInput = z.infer<typeof attractionSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type JournalInput = z.infer<typeof journalSchema>;
