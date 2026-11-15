import { z } from "zod";

export const tripDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(14),
  items: z.array(z.object({
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "时间格式应为 HH:mm"),
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(2000),
    type: z.enum(["景点", "美食", "住宿", "购物", "休闲"]),
  })).min(1).max(12),
});

export const tripDaysSchema = z.array(tripDaySchema).min(1).max(14).refine(
  days => days.every((day, index) => day.dayNumber === index + 1),
  "行程天数应从第一天开始连续排列",
);

export const tripRequestSchema = z.object({
  destination: z.string().trim().min(1).max(100),
  days: z.number().int().min(1).max(14),
});

export type TripDay = z.infer<typeof tripDaySchema>;
