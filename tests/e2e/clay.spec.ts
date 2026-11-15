import { test, expect } from "@playwright/test";

test("Clay 视觉基础、位图素材与顾问交互正常", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("把向往的地方");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 250, 240)");
  const hero = page.getByAltText("手作黏土山峦、蜿蜒小径与旅行箱");
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.querySelectorAll("svg").length)).toBe(0);
  await page.getByRole("button", { name: "打开旅游顾问", exact: true }).click();
  await expect(page.getByText("聊聊你的下一站", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "关闭顾问窗口", exact: true }).click();
  await expect(page.getByText("聊聊你的下一站", { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("移动导航及主要公共页面没有横向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开导航", exact: true }).click();
  await page.getByRole("link", { name: "目的地", exact: true }).first().click();
  await expect(page).toHaveURL(/\/destinations$/);
  for (const route of ["/", "/destinations", "/journals", "/search", "/login", "/register", "/trips/new"]) {
    await page.goto(route);
    await expect(page.locator("#main-content")).not.toBeEmpty();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), route).toBe(false);
  }
  await page.goto("/destinations/test-d0");
  const firstTab = await page.getByRole("tab", { name: "照片", exact: true }).boundingBox();
  const tabList = await page.getByRole("tablist").boundingBox();
  expect(firstTab!.x).toBeGreaterThanOrEqual(tabList!.x);
  await page.getByRole("tab", { name: /景点/ }).click();
  await expect(page.getByRole("link", { name: "测试景点", exact: true })).toBeVisible();
});
