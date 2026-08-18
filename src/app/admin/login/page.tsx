import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso administrador",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const authed = await isAuthenticated();
  if (authed) redirect("/admin");

  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-bg p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-lg font-bold text-white">
            EI
          </span>
          <h1 className="mt-4 text-lg font-semibold text-ink-950">Administración</h1>
          <p className="mt-1 text-sm text-ink-500">Extintores Imperio</p>
        </div>

        <LoginForm redirectTo={from && from.startsWith("/admin") ? from : "/admin"} />
      </div>
    </div>
  );
}
