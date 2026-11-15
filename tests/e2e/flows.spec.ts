import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
import { tmpdir } from "node:os";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", error => { throw error; });
});

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("邮箱", { exact: true }).fill(email);
  await page.getByLabel("密码", { exact: true }).fill("Testpass123!");
  await page.getByRole("button", { name: "登录", exact: true }).last().click();
  await expect(page).toHaveURL("http://localhost:3016/");
}

test("目的地分页和筛选实际生效", async ({ page }) => {
  await page.goto("/destinations");
  await expect(page.getByText("第 1 / 2 页")).toBeVisible();
  await page.getByRole("link", { name: "下一页" }).click();
  await expect(page.getByText("第 2 / 2 页")).toBeVisible();
  await page.getByLabel("省份筛选").fill("江苏");
  await page.getByRole("button", { name: "筛选", exact: true }).click();
  await expect(page.getByRole("link", { name: /测试城市0 江苏省/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "下一页" })).toHaveCount(0);
});

test("拒绝错误父级及下架父级的详情访问", async ({ page }) => {
  for (const route of ["/destinations/invalid-parent/attractions/test-attraction", "/destinations/test-hidden/attractions/test-hidden-child"]) {
    await page.goto(route);
    await expect(page.getByText("页面不存在", { exact: false })).toBeVisible();
  }
});

test("作者可编辑评论并持久保存", async ({ page }) => {
  await login(page, "user@example.test");
  await page.goto("/destinations/test-d0/attractions/test-attraction");
  await page.getByRole("tab", { name: "评论", exact: true }).click();
  await page.getByRole("button", { name: "编辑评论", exact: true }).click();
  await page.getByRole("dialog").getByLabel("评论内容").fill("编辑后的旅行体验");
  await page.getByRole("button", { name: "保存修改", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("编辑后的旅行体验", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "评论", exact: true }).click();
  await expect(page.getByText("编辑后的旅行体验", { exact: true })).toBeVisible();
  await page.screenshot({ path: path.join(tmpdir(), "travel-review-edited.png") });
});

test("普通用户不能进入后台，收藏可保存及取消", async ({ page }) => {
  await login(page, "user@example.test");
  await page.goto("/admin/accommodations/pending");
  await expect(page).toHaveURL("http://localhost:3016/");
  await page.goto("/destinations/test-d0");
  const favorite = page.getByRole("button", { name: "收藏", exact: true });
  await favorite.click();
  await expect(page.getByRole("button", { name: "取消收藏", exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "取消收藏", exact: true }).click();
  await expect(favorite).toBeVisible();
});

test("修改密码后旧会话失效", async ({ page }) => {
  await login(page, "user@example.test");
  await page.goto("/profile");
  await page.getByLabel("当前密码", { exact: true }).fill("Testpass123!");
  await page.getByLabel("新密码", { exact: true }).fill("Changedpass456!");
  await page.getByLabel("确认新密码", { exact: true }).fill("Changedpass456!");
  await page.getByRole("button", { name: "修改密码", exact: true }).click();
  await expect(page.getByText("密码已修改", { exact: true })).toBeVisible();
  await page.goto("/profile");
  await expect(page).toHaveURL("http://localhost:3016/login");
});

test("管理员能审核住宿并删除他人评论", async ({ page }) => {
  await login(page, "admin@example.test");
  await page.goto("/admin/accommodations/pending");
  await expect(page.getByText("测试待审酒店", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "通过", exact: true }).click();
  await expect(page.getByText("测试待审酒店", { exact: true })).toHaveCount(0);
  await page.goto("/destinations/test-d0/accommodations/test-pending");
  await expect(page.getByText("测试待审酒店", { exact: true }).first()).toBeVisible();
  await page.goto("/destinations/test-d0/attractions/test-attraction");
  await page.getByRole("tab", { name: "评论", exact: true }).click();
  await expect(page.getByRole("button", { name: "编辑评论", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "删除评论", exact: true }).click();
  await expect(page.getByText("暂无评论，来写第一条吧")).toBeVisible();
});

test("两个页面同时点赞不会重复计数", async ({ page }) => {
  await login(page, "admin@example.test");
  const second = await page.context().newPage();
  await Promise.all([page.goto("/journals/test-journal"), second.goto("/journals/test-journal")]);
  await Promise.all([page.getByTitle("点赞", { exact: true }).click(), second.getByTitle("点赞", { exact: true }).click()]);
  await expect(page.getByTitle("取消点赞", { exact: true })).toHaveText("1");
  await expect(second.getByTitle("取消点赞", { exact: true })).toHaveText("1");
  await page.reload();
  await expect(page.getByTitle("取消点赞", { exact: true })).toHaveText("1");
  await second.close();
});
