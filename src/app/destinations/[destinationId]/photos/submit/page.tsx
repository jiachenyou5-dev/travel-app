import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { PhotoUploadForm } from "./form";

export default async function SubmitPhotosPage({
  params,
}: {
  params: Promise<{ destinationId: string }>;
}) {
  const { destinationId } = await params;

  let destination;
  try {
    destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true, nameZh: true },
    });
  } catch {
    notFound();
  }

  if (!destination) notFound();

  const session = await safeAuth();

  if (!session?.user) {
    redirect(
      `/login?callbackUrl=/destinations/${destinationId}/photos/submit`
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          {
            label: destination.nameZh,
            href: `/destinations/${destinationId}`,
          },
          { label: "上传照片" },
        ]}
      />

      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">上传目的地照片</h1>
          <p className="text-sm text-muted-foreground mt-1">
            为 {destination.nameZh} 添加照片，上传后即可在目的地页面展示
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <PhotoUploadForm destinationId={destinationId} />
        </div>
      </div>
    </div>
  );
}
