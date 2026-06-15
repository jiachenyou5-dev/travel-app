import { redirect } from "next/navigation";
import { safeAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await safeAuth();
  const user = session?.user as { role?: string } | undefined;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}
