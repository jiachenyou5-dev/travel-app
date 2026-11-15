"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addJournalComment,
  deleteJournalComment,
} from "@/app/actions/journal-interactions";
import { toast } from "sonner";
import { Trash2 } from "@/components/ui/clay-icons";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
}

interface JournalCommentSectionProps {
  journalId: string;
  initialComments: Comment[];
  currentUserId?: string;
}

export function JournalCommentSection({
  journalId,
  initialComments,
  currentUserId,
}: JournalCommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("请输入评论内容");
      return;
    }

    startTransition(async () => {
      try {
        const newComment = await addJournalComment(journalId, content);
        setComments((prev) => [newComment, ...prev]);
        setContent("");
        toast.success("评论发布成功");
      } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          toast.error("请先登录");
        } else {
          toast.error("评论失败，请稍后重试");
        }
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      try {
        await deleteJournalComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("评论已删除");
      } catch {
        toast.error("删除失败");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* 评论输入 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的评论..."
          className="min-h-20 resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending || !content.trim()} size="sm">
            {pending ? "发布中..." : "发布评论"}
          </Button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            暂无评论，来说点什么吧~
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 rounded-lg bg-muted/30"
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={comment.user.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {comment.user.name?.charAt(0) ?? "匿"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {comment.user.name ?? "匿名用户"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                    {currentUserId === comment.user.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={pending}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="删除评论"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
