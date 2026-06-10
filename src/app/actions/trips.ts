"use server";

import { exec } from "child_process";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function execFlyAI(query: string): Promise<string> {
  const cliPath = path.join(
    process.cwd(),
    "node_modules",
    "@fly-ai",
    "flyai-cli",
    "dist",
    "flyai-bundle.cjs"
  );

  return new Promise((resolve, reject) => {
    exec(
      `node "${cliPath}" ai-search --query ${JSON.stringify(query)}`,
      { timeout: 60000, env: { ...process.env } },
      (err, stdout, stderr) => {
        if (stdout) {
          try {
            const result = JSON.parse(stdout.trim());
            if (result?.data) {
              resolve(result.data);
              return;
            }
          } catch {
            // JSON parse failed, fall through to error handling
          }
        }

        const message = err?.message ?? stderr ?? "FlyAI CLI error";
        reject(new Error(message));
      }
    );
  });
}

interface TripDay {
  dayNumber: number;
  items: {
    time: string;
    title: string;
    description: string;
    type: string;
  }[];
}

function extractJson(text: string): string | null {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const daysIdx = cleaned.indexOf('"days"');
  if (daysIdx === -1) return null;

  let startIdx = daysIdx;
  while (startIdx > 0 && cleaned[startIdx] !== "{") {
    startIdx--;
  }
  if (cleaned[startIdx] !== "{") return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return cleaned.slice(startIdx, i + 1);
      }
    }
  }

  return null;
}

function repairJson(json: string): string {
  return json
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");
}

function tryParseLenient(json: string): TripDay[] | null {
  try {
    const days: TripDay[] = [];

    const dayBlocks = json.split(/"dayNumber"\s*:\s*/);
    for (let i = 1; i < dayBlocks.length; i++) {
      const block = dayBlocks[i];
      const dayNumMatch = block.match(/^(\d+)/);
      if (!dayNumMatch) continue;
      const dayNum = parseInt(dayNumMatch[1]);

      const items: TripDay["items"] = [];
      const itemMatches = block.matchAll(
        /\{\s*"time"\s*:\s*"([^"]*)"\s*,\s*"title"\s*:\s*"([^"]*)"\s*,\s*"description"\s*:\s*"([^"]*)"\s*,\s*"type"\s*:\s*"([^"]*)"\s*\}/g
      );

      for (const m of itemMatches) {
        items.push({
          time: m[1],
          title: m[2],
          description: m[3],
          type: m[4],
        });
      }

      if (items.length > 0) {
        days.push({ dayNumber: dayNum, items });
      }
    }

    return days.length > 0 ? days : null;
  } catch {
    return null;
  }
}

function logJsonError(json: string, err: unknown) {
  const msg = err instanceof SyntaxError ? err.message : String(err);
  const posMatch = msg.match(/position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    const start = Math.max(0, pos - 120);
    const end = Math.min(json.length, pos + 120);
    console.error(
      "Trip generation JSON error at pos",
      pos,
      "context:",
      json.slice(start, end)
    );
  }
  console.error("Trip generation full JSON:", json.slice(0, 2000));
}

export async function generateTrip(
  destination: string,
  days: number
): Promise<{ days: TripDay[] } | { error: string }> {
  const prompt = `为「${destination}」生成一个${days}天的详细旅行行程计划。

每天包含3-4个活动，覆盖上午、下午、晚上三个时段。
每个活动需包含：时段标签（如"09:00"）、活动标题、简短描述（1-2句话）、类型（景点/美食/住宿/购物/休闲）。

请严格返回JSON格式，不要包含其他文字：
{
  "days": [
    {
      "dayNumber": 1,
      "items": [
        { "time": "09:00", "title": "故宫", "description": "参观明清皇家宫殿，建议游览3小时", "type": "景点" }
      ]
    }
  ]
}`;

  try {
    const raw = await execFlyAI(prompt);

    const json = extractJson(raw);
    if (!json) {
      console.error("Trip generation: no JSON match in", raw.slice(0, 300));
      return { error: "AI 返回格式异常，请重试" };
    }

    let parsed: { days: TripDay[] };
    try {
      parsed = JSON.parse(json);
    } catch (parseErr) {
      logJsonError(json, parseErr);

      const repaired = repairJson(json);
      try {
        parsed = JSON.parse(repaired);
      } catch (repairErr) {
        logJsonError(repaired, repairErr);

        const fallback = tryParseLenient(json);
        if (fallback) {
          return { days: fallback };
        }

        console.error("Trip generation: all parse attempts failed");
        return { error: "AI 返回数据解析失败，请重试" };
      }
    }

    if (!parsed.days || !Array.isArray(parsed.days)) {
      return { error: "AI 返回数据不完整，请重试" };
    }

    return { days: parsed.days as TripDay[] };
  } catch (err) {
    console.error("Trip generation error:", err);
    return { error: "生成失败，请稍后重试" };
  }
}

export async function saveTrip(formData: FormData) {
  const user = await requireAuth();

  const title = formData.get("title") as string;
  const destination = formData.get("destination") as string;
  const daysJson = formData.get("daysJson") as string;

  if (!title || !daysJson) throw new Error("缺少必要参数");

  await prisma.tripPlan.create({
    data: {
      userId: user.id,
      title,
      destination: destination || null,
      daysJson,
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
