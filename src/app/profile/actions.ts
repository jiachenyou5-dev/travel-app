"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await requireAuth();

  const name = formData.get("name") as string;
  if (!name || name.length < 1) {
    return { error: "昵称不能为空" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const user = await requireAuth();

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "请填写所有密码字段" };
  }

  if (newPassword.length < 6) {
    return { error: "新密码至少 6 个字符" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "两次输入的新密码不一致" };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.passwordHash) {
    return { error: "该账号未设置密码" };
  }

  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) {
    return { error: "当前密码错误" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true };
}
