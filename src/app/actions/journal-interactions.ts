"use server";

import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

// ==================== 点赞 ====================

export async function toggleJournalLike(journalId: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const existing = await prisma.journalLike.findUnique({
    where: { userId_journalId: { userId: user.id, journalId } },
  });

  if (existing) {
    await prisma.journalLike.delete({ where: { id: existing.id } });
    await prisma.journal.update({
      where: { id: journalId },
      data: { likeCount: { decrement: 1 } },
    });
    revalidatePath("/journals");
    revalidatePath(`/journals/${journalId}`);
    return { liked: false };
  }

  await prisma.journalLike.create({
    data: { userId: user.id, journalId },
  });
  await prisma.journal.update({
    where: { id: journalId },
    data: { likeCount: { increment: 1 } },
  });
  revalidatePath("/journals");
  revalidatePath(`/journals/${journalId}`);
  return { liked: true };
}

export async function getJournalLikeStatus(journalId: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) return false;

  const like = await prisma.journalLike.findUnique({
    where: { userId_journalId: { userId: user.id, journalId } },
  });
  return like !== null;
}

// ==================== 收藏 ====================

export async function toggleJournalFavorite(journalId: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const existing = await prisma.journalFavorite.findUnique({
    where: { userId_journalId: { userId: user.id, journalId } },
  });

  if (existing) {
    await prisma.journalFavorite.delete({ where: { id: existing.id } });
    revalidatePath(`/journals/${journalId}`);
    return { favorited: false };
  }

  await prisma.journalFavorite.create({
    data: { userId: user.id, journalId },
  });
  revalidatePath(`/journals/${journalId}`);
  return { favorited: true };
}

export async function getJournalFavoriteStatus(journalId: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) return false;

  const fav = await prisma.journalFavorite.findUnique({
    where: { userId_journalId: { userId: user.id, journalId } },
  });
  return fav !== null;
}

// ==================== 评论 ====================

export async function addJournalComment(journalId: string, content: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (!content.trim()) {
    throw new Error("评论内容不能为空");
  }

  const comment = await prisma.journalComment.create({
    data: {
      userId: user.id,
      journalId,
      content: content.trim(),
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  revalidatePath(`/journals/${journalId}`);
  return comment;
}

export async function deleteJournalComment(commentId: string) {
  const session = await safeAuth();
  const user = session?.user as { id: string } | undefined;
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const comment = await prisma.journalComment.findUnique({
    where: { id: commentId },
  });
  if (!comment || comment.userId !== user.id) {
    throw new Error("无权删除此评论");
  }

  await prisma.journalComment.delete({ where: { id: commentId } });
  revalidatePath(`/journals/${comment.journalId}`);
}

export async function getJournalComments(journalId: string) {
  const comments = await prisma.journalComment.findMany({
    where: { journalId },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return comments;
}
