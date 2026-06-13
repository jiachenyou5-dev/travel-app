import { prisma } from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-utils";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { RestaurantForm } from "@/components/destinations/restaurant-form";
import { submitRestaurant } from "@/app/actions/restaurants";

export default async function SubmitRestaurantPage({
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
    redirect(
      `/login?callbackUrl=/destinations/${destinationId}/restaurants/submit`
    );
  }

  const boundAction = submitRestaurant.bind(null, destinationId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          {
            label: destination.nameZh,
            href: `/destinations/${destinationId}`,
          },
          { label: "提交新美食" },
        ]}
      />

      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">提交新美食</h1>
          <p className="text-sm text-muted-foreground mt-1">
            提交的美食需要管理员审核后才会公开展示
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <RestaurantForm action={boundAction} submitLabel="提交审核" />
        </div>
      </div>
    </div>
  );
}
