"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { queryTravelAI } from "@/lib/ai";
import { tripDaysSchema, tripRequestSchema, type TripDay } from "@/lib/trip-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function generateTrip(destination: string, days: number): Promise<{ days: TripDay[] } | { error: string }> {
  const user = await requireAuth();
  const input = tripRequestSchema.safeParse({ destination, days });
  if (!input.success) return { error: "请输入有效目的地及 1 至 14 天的整数天数" };
  const prompt = `为「${input.data.destination}」生成 ${input.data.days} 天旅行计划，每天 3-4 个活动。仅返回 JSON：{"days":[{"dayNumber":1,"items":[{"time":"09:00","title":"活动名称","description":"活动说明","type":"景点"}]}]}。time 必须为 HH:mm；type 仅允许景点、美食、住宿、购物、休闲。天数从 1 连续排列。`;
  try {
    const raw = await queryTravelAI(user.id, prompt);
    const cleaned = raw.replace(/```(?:json)?/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const result = z.object({ days: tripDaysSchema }).parse(JSON.parse(cleaned.slice(start, end + 1)));
    if (result.days.length !== input.data.days) return { error: "生成的行程天数不完整，请重试" };
    return result;
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return { error: "AI 返回的行程格式异常，请重试" };
    return { error: error instanceof Error ? error.message : "生成失败，请稍后重试" };
  }
}

export async function saveTrip(formData: FormData) {
  const user = await requireAuth();

  const title = formData.get("title") as string;
  const destination = formData.get("destination") as string;
  const daysJson = formData.get("daysJson") as string;

  const input = z.object({ title: z.string().trim().min(1).max(100), destination: z.string().trim().max(100) }).parse({ title, destination });
  if (typeof daysJson !== "string" || daysJson.length > 200000) throw new Error("行程数据无效");
  const validatedDays = tripDaysSchema.parse(JSON.parse(daysJson));

  await prisma.tripPlan.create({
    data: {
      userId: user.id,
      title: input.title,
      destination: input.destination || null,
      daysJson: JSON.stringify(validatedDays),
    },
  });

  revalidatePath("/trips");
  redirect("/trips");
}

export async function deleteTrip(id: string) {
  const user = await requireAuth();

  const trip = await prisma.tripPlan.findUnique({ where: { id } });
  if (!trip || trip.userId !== user.id) {
    throw new Error("无权删除此行程");
  }

  await prisma.tripPlan.delete({ where: { id } });
  revalidatePath("/trips");
}
