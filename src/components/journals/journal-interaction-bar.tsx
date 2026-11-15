"use client";

import { useState, useTransition } from "react";
import { Heart, Bookmark, MessageCircle } from "@/components/ui/clay-icons";
import { setJournalLike, setJournalFavorite } from "@/app/actions/journal-interactions";
import { useRouter } from "next/navigation";

interface JournalInteractionBarProps {
  journalId: string;
  initialLiked: boolean;
  initialFavorited: boolean;
  likeCount: number;
  commentCount: number;
  onCommentClick?: () => void;
}

export function JournalInteractionBar({
  journalId,
  initialLiked,
  initialFavorited,
  likeCount: initialLikeCount,
  commentCount,
  onCommentClick,
}: JournalInteractionBarProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [beating, setBeating] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleLike() {
    startTransition(async () => {
      try {
        const result = await setJournalLike(journalId, !liked);
        setLiked(result.liked);
        setLikeCount(result.likeCount);
        if (result.liked) {
          setBeating(true);
          setTimeout(() => setBeating(false), 400);
        }
      } catch {
        router.push("/login");
      }
    });
  }

  function handleFavorite() {
    startTransition(async () => {
      try {
        const result = await setJournalFavorite(journalId, !favorited);
        setFavorited(result.favorited);
      } catch {
        router.push("/login");
      }
    });
  }

  return (
    <div className="flex items-center gap-1 border-t border-border pt-4 mt-4">
      {/* 点赞 */}
      <button
        onClick={handleLike}
        disabled={pending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          liked
            ? "text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15"
            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        }`}
        title={liked ? "取消点赞" : "点赞"}
      >
        <Heart
          className={`w-4 h-4 transition-transform ${liked ? "" : "grayscale opacity-50"} ${beating ? "animate-[heart-beat_0.4s_ease]" : ""}`}
        />
        <span>{likeCount}</span>
      </button>

      {/* 收藏 */}
      <button
        onClick={handleFavorite}
        disabled={pending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          favorited
            ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/15"
            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
        }`}
        title={favorited ? "取消收藏" : "收藏"}
      >
        <Bookmark
          className={`w-4 h-4 transition-transform ${favorited ? "" : "grayscale opacity-50"}`}
        />
        <span>{favorited ? "已收藏" : "收藏"}</span>
      </button>

      {/* 评论 */}
      <button
        onClick={onCommentClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
        title="评论"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{commentCount}</span>
      </button>
    </div>
  );
}
