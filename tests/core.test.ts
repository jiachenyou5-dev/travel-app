import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { reviewSchema, destinationSchema, accommodationSchema } from "../src/lib/validators";
import { tripDaysSchema } from "../src/lib/trip-schema";
import { savePhotos, removeMedia } from "../src/lib/media";

test("拒绝小数评分、空白评论、非法日期和越界坐标", () => {
  for (const data of [
    { rating: 2.5, content: "有效评论" },
    { rating: 5, content: "   " },
    { rating: 5, content: "有效评论", visitDate: "2026-02-30" },
  ]) assert.equal(reviewSchema.safeParse(data).success, false);
  assert.equal(destinationSchema.safeParse({ nameZh: "北京", latitude: 100 }).success, false);
  assert.equal(accommodationSchema.safeParse({ nameZh: "酒店", starRating: 6 }).success, false);
});

test("拒绝合法 JSON 中的畸形行程、非连续天数与无效时间", () => {
  const item = { time: "09:00", title: "游览", description: "参观景点", type: "景点" };
  assert.equal(tripDaysSchema.safeParse([{ dayNumber: 1, items: [item] }]).success, true);
  for (const value of [[{ dayNumber: 2, items: [item] }], [{ dayNumber: 1, items: [{ ...item, time: "25:99" }] }], [{ dayNumber: 1, items: null }]]) {
    assert.equal(tripDaysSchema.safeParse(value).success, false);
  }
});

test("媒体真实解码、缩略图生成、伪造图片拒绝及清理", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "travel-media-test-"));
  process.env.UPLOADS_DIR = directory;
  try {
    const bytes = await sharp({ create: { width: 1200, height: 800, channels: 3, background: "white" } }).png().toBuffer();
    const photos = await savePhotos([new File([bytes], "wrong.svg", { type: "image/png" })], "reviews");
    assert.match(photos[0].url, /\.webp$/);
    assert.notEqual(photos[0].url, photos[0].thumbnailUrl);
    const thumbnail = await sharp(await readFile(path.join(directory, photos[0].thumbnailUrl.slice(9)))).metadata();
    assert.ok(thumbnail.width! <= 480);
    await assert.rejects(savePhotos([new File(["<svg></svg>"], "fake.jpg", { type: "image/jpeg" })], "reviews"));
    await assert.rejects(savePhotos(Array(6).fill(new File([bytes], "image.png")), "reviews"));
    await removeMedia(photos);
    assert.deepEqual(await readdir(path.join(directory, "reviews")), []);
  } finally {
    delete process.env.UPLOADS_DIR;
    await rm(directory, { recursive: true, force: true });
  }
});
