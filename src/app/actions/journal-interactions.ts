"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAuth, safeAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

// ==================== 点赞 ====================

export async function setJournalLike(journalId: string, liked: boolean) {
  const user = await requireAuth();
  z.string().min(1).max(100).parse(journalId);
  z.boolean().parse(liked);
  const likeCount = await prisma.$transaction(async tx => {
    const journal = await tx.journal.findFirst({ where: { id: journalId, isPublished: true } });
    if (!journal) throw new Error("游记不存在");
    if (liked) await tx.journalLike.upsert({ where: { userId_journalId: { userId: user.id, journalId } }, create: { userId: user.id, journalId }, update: {} });
    else await tx.journalLike.deleteMany({ where: { userId: user.id, journalId } });
    const count = await tx.journalLike.count({ where: { journalId } });
    await tx.journal.update({ where: { id: journalId }, data: { likeCount: count } });
    return count;
  });
  revalidatePath("/journals");
  revalidatePath(`/journals/${journalId}`);
  return { liked, likeCount };
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

export async function setJournalFavorite(journalId: string, favorited: boolean) {
  const user = await requireAuth();
  z.string().min(1).max(100).parse(journalId);
  z.boolean().parse(favorited);
  if (favorited) await prisma.journalFavorite.upsert({ where: { userId_journalId: { userId: user.id, journalId } }, create: { userId: user.id, journalId }, update: {} });
  else await prisma.journalFavorite.deleteMany({ where: { userId: user.id, journalId } });
  revalidatePath(`/journals/${journalId}`);
  return { favorited };
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

  content = z.string().trim().min(1, "评论内容不能为空").max(2000).parse(content);

  const comment = await prisma.journalComment.create({
    data: {
      userId: user.id,
      journalId,
      content: content.trim(),
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
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
