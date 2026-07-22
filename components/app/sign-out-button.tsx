"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";

export function SignOutButton({ demo }: { demo: boolean }) {
  const router = useRouter();

  async function exit() {
    if (demo) {
      await fetch("/api/demo-session", { method: "DELETE" });
    } else {
      try {
        await authClient.signOut();
      } catch {
        // Navigation still clears the visible workspace.
      }
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button className="shell-link signout" onClick={exit}>
      <LogOut size={16} />
      <span>{demo ? "Exit demo" : "Sign out"}</span>
    </button>
  );
}
