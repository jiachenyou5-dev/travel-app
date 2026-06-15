import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { JournalForm } from "@/components/journals/journal-form";
import { updateJournal } from "@/app/actions/journals";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!journal || journal.userId !== user.id) notFound();

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: "我的游记", href: "/profile/journals" },
          { label: "编辑游记" },
        ]}
      />
      <h2 className="text-lg font-semibold text-foreground">编辑游记</h2>
      <JournalForm
        action={updateJournal.bind(null, journal.id)}
        defaultValues={{
          title: journal.title,
          content: journal.content,
          region: journal.region ?? undefined,
        }}
        submitLabel="保存修改"
      />
    </div>
  );
}
