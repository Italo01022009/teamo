"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, BarChart3, User, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function MobileNav() {
  const { profile } = useAuth();
  const pathname = usePathname();
  if (!profile) return null;

  const items =
    profile.tipo === "profissional"
      ? [
          { to: "/app", label: "Início", icon: Home },
          { to: "/app/sessoes", label: "Sessões", icon: ClipboardList },
          { to: "/app/familias", label: "Famílias", icon: Users },
          { to: "/app/relatorios", label: "Relatórios", icon: BarChart3 },
          { to: "/app/perfil", label: "Perfil", icon: User },
        ]
      : [
          { to: "/app", label: "Início", icon: Home },
          { to: "/app/rotina", label: "Rotina", icon: ClipboardList },
          { to: "/app/profissionais", label: "Profissionais", icon: Users },
          { to: "/app/historico", label: "Histórico", icon: BarChart3 },
          { to: "/app/perfil", label: "Perfil", icon: User },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-around px-2 py-2">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              href={it.to}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-all ${
                active ? "bg-primary-soft text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
