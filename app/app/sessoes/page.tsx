"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ClipboardList } from "lucide-react";

interface S { id: string; data: string; duracao: number; child_id: string; evolucao: string | null; }

export default function SessoesPage() {
  const [items, setItems] = useState<S[]>([]);
  const [children, setChildren] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {
      const [s, c] = await Promise.all([
        supabase.from("sessions").select("id,data,duracao,child_id,evolucao").order("data", { ascending: false }),
        supabase.from("children").select("id,nome"),
      ]);
      setItems((s.data ?? []) as S[]);
      const m: Record<string, string> = {};
      ((c.data ?? []) as { id: string; nome: string }[]).forEach((x) => (m[x.id] = x.nome));
      setChildren(m);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessões</h1>
        <Link href="/app/sessoes/nova" className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="card-soft p-6 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-2 text-sm text-muted-foreground">Nenhuma sessão registrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <Link key={s.id} href={`/app/sessoes/${s.id}`} className="card-soft p-4 hover:border-primary transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{children[s.child_id] ?? "Criança"}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>⏱️ {s.duracao} min</span>
                    {s.evolucao && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        s.evolucao === "Melhorou" ? "bg-green-100 text-green-700" :
                        s.evolucao === "Regrediu" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>{s.evolucao}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-xs font-medium text-muted-foreground">{new Date(s.data).toLocaleDateString("pt-BR")}</span>
                  <span className="text-xs text-primary font-semibold hover:underline">Ver detalhes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
