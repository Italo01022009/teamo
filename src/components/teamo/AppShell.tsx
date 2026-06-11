"use client";

import { type ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const { signOut, profile } = useAuth();
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Link href="/app"><Logo /></Link>
          <div className="flex items-center gap-2">
            {profile && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Olá, {profile.nome.split(" ")[0]}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-5">{children}</main>
      <MobileNav />
    </div>
  );
}
