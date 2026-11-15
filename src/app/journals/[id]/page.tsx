import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { ImageGrid } from "@/components/ui/image-upload";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JournalInteractionBar } from "@/components/journals/journal-interaction-bar";
import { JournalCommentSection } from "@/components/journals/journal-comment-section";
import { safeAuth } from "@/lib/auth-utils";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await safeAuth();
  const currentUser = session?.user as { id: string } | undefined;

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      photos: { orderBy: { sortOrder: "asc" } },
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!journal || !journal.isPublished) notFound();

  let liked = false;
  let favorited = false;

  if (currentUser) {
    const [likeRecord, favRecord] = await Promise.all([
      prisma.journalLike.findUnique({
        where: {
          userId_journalId: {
            userId: currentUser.id,
            journalId: id,
          },
        },
      }),
      prisma.journalFavorite.findUnique({
        where: {
          userId_journalId: {
            userId: currentUser.id,
            journalId: id,
          },
        },
      }),
    ]);
    liked = likeRecord !== null;
    favorited = favRecord !== null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "游记", href: "/journals" },
          { label: journal.title },
        ]}
      />

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {journal.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <span>{journal.user.name ?? "匿名用户"}</span>
          <span>·</span>
          <span>
            {new Date(journal.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {journal.region && (
            <>
              <span>·</span>
              <span className="text-primary/80">{journal.region}</span>
            </>
          )}
        </div>

        {journal.photos.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">游记图片</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGrid
                images={journal.photos.map((p) => ({
                  id: p.id,
                  url: p.url,
                }))}
              />
            </CardContent>
          </Card>
        )}

        <div className="markdown-chat prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {journal.content}
          </ReactMarkdown>
        </div>

        {/* 互动栏 */}
        <JournalInteractionBar
          journalId={journal.id}
          initialLiked={liked}
          initialFavorited={favorited}
          likeCount={journal._count.likes}
          commentCount={journal._count.comments}
        />
      </article>

      {/* 评论区 */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          评论 ({journal._count.comments})
        </h2>
        <JournalCommentSection
          journalId={journal.id}
          initialComments={journal.comments}
          currentUserId={currentUser?.id}
        />
      </section>
    </div>
  );
}
