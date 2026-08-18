import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAuthenticated, getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const session = await getSession();

  return <AdminShell username={session.username ?? "admin"}>{children}</AdminShell>;
}
