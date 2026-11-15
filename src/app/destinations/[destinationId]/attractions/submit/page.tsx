import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { AttractionForm } from "@/components/destinations/attraction-form";
import { submitAttraction } from "@/app/actions/attractions";

export default async function SubmitAttractionPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  const { destinationId } = await params;

  const [destination, session] = await Promise.all([
    prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true, nameZh: true },
    }),
    safeAuth(),
  ]);

  if (!destination) notFound();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/destinations/${destinationId}/attractions/submit`);
  }

  const boundAction = submitAttraction.bind(null, destinationId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          { label: destination.nameZh, href: `/destinations/${destinationId}` },
          { label: "提交新景点" },
        ]}
      />

      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">提交新景点</h1>
          <p className="text-sm text-muted-foreground mt-1">
            提交的景点需要管理员审核后才会公开展示
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <AttractionForm
            action={boundAction}
            submitLabel="提交审核"
          />
        </div>
      </div>
    </div>
  );
}
