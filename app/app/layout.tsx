import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { auth } from "@/lib/auth/server";
import { neonAuthConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const demoCookie = store.get("arthsetu_demo")?.value === "1";
  const configured = neonAuthConfigured();

  let user: { email?: string | null; name?: string | null } | null = null;

  if (configured) {
    try {
      const { data: session } = await auth.getSession();

      if (session?.user) {
        user = {
          email: session.user.email,
          name: session.user.name,
        };
      }
    } catch {
      user = null;
    }

    if (!user && !demoCookie) {
      redirect("/login");
    }
  }

  return (
    <AppShell user={user} demo={demoCookie || !configured}>
      {children}
    </AppShell>
  );
}
