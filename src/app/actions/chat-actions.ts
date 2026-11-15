"use server";

import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { queryTravelAI } from "@/lib/ai";

const messageSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(4000) });
interface ChatMessage { role: "user" | "assistant"; content: string }

export async function sendMessage(history: ChatMessage[], newMessage: string): Promise<{ reply: string } | { error: string }> {
  const user = await requireAuth();
  const input = z.object({ history: z.array(messageSchema).max(20), message: z.string().trim().min(1).max(2000) }).safeParse({ history, message: newMessage });
  if (!input.success) return { error: "消息过长或格式不正确" };
  const query = [...input.data.history.slice(-5), { role: "user", content: input.data.message }]
    .map(message => `${message.role === "user" ? "用户" : "助手"}: ${message.content}`).join("\n");
  try { return { reply: await queryTravelAI(user.id, query) }; }
  catch (error) { return { error: error instanceof Error ? error.message : "回复失败，请稍后重试" }; }
}
