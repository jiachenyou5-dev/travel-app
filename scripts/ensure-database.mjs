import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("请先配置 DATABASE_URL");
if (url.startsWith("file:")) {
  const filename = path.resolve(url.slice(5));
  await mkdir(path.dirname(filename), { recursive: true });
  try { await writeFile(filename, new Uint8Array(), { flag: "ax" }); }
  catch (error) { if (error.code !== "EEXIST") throw error; }
}
