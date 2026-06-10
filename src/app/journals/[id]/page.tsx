import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Lightbox } from "@/components/ui/lightbox";
import { ImageGrid } from "@/components/ui/image-upload";
import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!journal || !journal.isPublished) notFound();

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

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>{journal.user.name ?? "匿名用户"}</span>
          <span>·</span>
          <span>
            {new Date(journal.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
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
      </article>
    </div>
  );
}
