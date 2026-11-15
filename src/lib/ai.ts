import { execFile } from "node:child_process";
import path from "node:path";

let activeRequests = 0;
const requests = new Map<string, { count: number; resetAt: number }>();

export async function queryTravelAI(userId: string, query: string): Promise<string> {
  const now = Date.now();
  for (const [key, value] of requests) {
    if (value.resetAt <= now) requests.delete(key);
  }
  const usage = requests.get(userId) ?? { count: 0, resetAt: now + 86400000 };
  if (usage.count >= 30) throw new Error("今日 AI 使用次数已达上限，请明天再试");
  if (activeRequests >= 3) throw new Error("旅游顾问繁忙，请稍后再试");
  if (!process.env.FLYAI_API_KEY) throw new Error("旅游顾问暂未配置，请联系管理员");
  usage.count += 1;
  requests.set(userId, usage);
  activeRequests += 1;
  const startedAt = Date.now();
  try {
    return await new Promise<string>((resolve, reject) => {
      const cliPath = path.join(process.cwd(), "node_modules", "@fly-ai", "flyai-cli", "dist", "flyai-bundle.cjs");
      execFile(process.execPath, [cliPath, "ai-search", "--query", query], {
        timeout: 60000,
        maxBuffer: 1024 * 1024,
        windowsHide: true,
        env: { ...process.env },
      }, (error, stdout) => {
        if (error) {
          console.error("[ai] request failed", { code: error.code, durationMs: Date.now() - startedAt });
          reject(new Error("旅游顾问暂时无法回复，请稍后重试"));
          return;
        }
        try {
          const result: unknown = JSON.parse(stdout.trim());
          if (typeof result === "object" && result !== null && "data" in result && typeof result.data === "string") {
            resolve(result.data);
            return;
          }
        } catch {}
        reject(new Error("旅游顾问返回格式异常，请重试"));
      });
    });
  } finally {
    activeRequests -= 1;
  }
}
