import { safeAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { DestinationForm } from "@/components/destinations/destination-form";
import { submitDestination } from "@/app/actions/destinations";

export default async function SubmitDestinationPage() {
  const session = await safeAuth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/destinations/submit");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav
        items={[
          { label: "目的地", href: "/destinations" },
          { label: "提交新目的地" },
        ]}
      />

      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">提交新目的地</h1>
          <p className="text-sm text-muted-foreground mt-1">
            提交的目的地需要管理员审核后才会公开展示
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <DestinationForm action={submitDestination} submitLabel="提交审核" />
        </div>
      </div>
    </div>
  );
}
