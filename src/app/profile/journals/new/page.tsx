import { requireAuth } from "@/lib/auth-utils";
import { JournalForm } from "@/components/journals/journal-form";
import { createJournal } from "@/app/actions/journals";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";

export default async function NewJournalPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: "我的游记", href: "/profile/journals" },
          { label: "写游记" },
        ]}
      />
      <h2 className="text-lg font-semibold text-foreground">写游记</h2>
      <JournalForm action={createJournal} />
    </div>
  );
}
