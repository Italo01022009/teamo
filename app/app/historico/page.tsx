"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Smile, Meh, Frown, Moon, Utensils, NotebookPen } from "lucide-react";

interface R {
  id: string; data: string; child_id: string;
  humor: string | null; sono: string | null; alimentacao: string | null;
  energia: string | null; comunicacao: string | null; interacao: string | null;
  medicacao: string | null; observacoes: string | null;
  atividades: string[] | null; comportamentos: string[] | null; eventos: string[] | null;
}

const moodIcon: Record<string, typeof Smile> = { Feliz: Smile, Neutro: Meh, Irritado: Frown };

export default function HistoricoPage() {
  const [items, setItems] = useState<R[]>([]);
  const [children, setChildren] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const [r, c] = await Promise.all([
        supabase.from("routines").select("id,data,child_id,humor,sono,alimentacao,energia,comunicacao,interacao,medicacao,observacoes,atividades,comportamentos,eventos").order("data", { ascending: false }),
        supabase.from("children").select("id,nome"),
      ]);
      setItems((r.data ?? []) as R[]);
      const m: Record<string, string> = {};
      ((c.data ?? []) as { id: string; nome: string }[]).forEach((x) => (m[x.id] = x.nome));
      setChildren(m);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Historico</h1>
      {items.length === 0 ? (
        <div className="card-soft p-6 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-2 text-sm text-muted-foreground">Nenhum registro ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((r) => {
            const MoodIcon = r.humor ? moodIcon[r.humor] ?? Smile : null;
            return (
              <div key={r.id} className="card-soft p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{children[r.child_id] ?? "Crianca"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.data).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {r.humor && MoodIcon && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1 text-primary">
                      <MoodIcon className="h-3.5 w-3.5" /> {r.humor}
                    </span>
                  )}
                  {r.sono && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-1 text-mint-foreground">
                      <Moon className="h-3.5 w-3.5" /> {r.sono}
                    </span>
                  )}
                  {r.alimentacao && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2 py-1 text-peach-foreground">
                      <Utensils className="h-3.5 w-3.5" /> {r.alimentacao}
                    </span>
                  )}
                </div>
                {r.observacoes && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <NotebookPen className="h-3.5 w-3.5" /> {r.observacoes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
