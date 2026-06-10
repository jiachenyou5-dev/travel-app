"use server";

import { exec } from "child_process";
import path from "path";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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
      { timeout: 30000, env: { ...process.env } },
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

        const message =
          err?.message ?? stderr ?? "Unknown CLI error";
        reject(new Error(message));
      }
    );
  });
}

export async function sendMessage(
  history: ChatMessage[],
  newMessage: string
): Promise<{ reply: string } | { error: string }> {
  const context = [...history, { role: "user" as const, content: newMessage }];
  const recentHistory = context.slice(-6);

  const query = recentHistory
    .map((m) => `${m.role === "user" ? "用户" : "助手"}: ${m.content}`)
    .join("\n");

  try {
    const reply = await execFlyAI(query);
    return { reply };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("FlyAI error:", message);
    return { error: "回复失败，请稍后重试。" };
  }
}
