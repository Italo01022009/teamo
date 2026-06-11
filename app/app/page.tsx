"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Baby, ClipboardList, BarChart3, Calendar, BookOpen } from "lucide-react";

interface Child { id: string; nome: string; idade: number; diagnostico: string | null; }
interface Session { id: string; data: string; child_id: string; evolucao: string | null; }
interface Routine { id: string; data: string; child_id: string; humor: string | null; }

export default function DashboardPage() {
  const { profile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const [c, s, r] = await Promise.all([
        supabase.from("children").select("id,nome,idade,diagnostico").order("created_at", { ascending: false }),
        supabase.from("sessions").select("id,data,child_id,evolucao").order("data", { ascending: false }).limit(5),
        supabase.from("routines").select("id,data,child_id,humor").order("data", { ascending: false }).limit(5),
      ]);
      setChildren((c.data ?? []) as Child[]);
      setSessions((s.data ?? []) as Session[]);
      setRoutines((r.data ?? []) as Routine[]);
      setLoading(false);
    })();
  }, [profile]);

  if (!profile) return null;
  const isPro = profile.tipo === "profissional";

  return (
    <div className="space-y-5">
      <section className="card-soft gradient-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isPro ? "Painel profissional" : "Olá, família"}
        </p>
        <h1 className="mt-1 text-2xl font-bold">Bem-vindo(a), {profile.nome.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPro
            ? "Acompanhe suas crianças, registre sessões e veja a evolução."
            : "Registre o dia da criança em poucos toques."}
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Crianças</h2>
          <Link href="/app/criancas/nova" className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Nova
          </Link>
        </div>
        {loading ? (
          <div className="card-soft h-24 animate-pulse" />
        ) : children.length === 0 ? (
          <div className="card-soft p-6 text-center">
            <Baby className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">Nenhuma criança cadastrada ainda.</p>
            <Link href="/app/criancas/nova" className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Cadastrar primeira criança
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {children.map((c) => (
              <Link key={c.id} href={`/app/criancas/${c.id}`} className="card-soft flex items-center gap-3 p-4 transition-all hover:border-primary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-mint-foreground">
                  <Baby className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{c.nome}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.idade} anos {c.diagnostico ? `• ${c.diagnostico}` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        {isPro ? (
          <>
            <Link href="/app/sessoes/nova" className="card-soft p-4 hover:border-primary">
              <ClipboardList className="h-6 w-6 text-primary" />
              <div className="mt-2 font-semibold">Nova sessão</div>
              <div className="text-xs text-muted-foreground">Registrar atendimento</div>
            </Link>
            <Link href="/app/relatorios" className="card-soft p-4 hover:border-primary">
              <BarChart3 className="h-6 w-6 text-accent-foreground" />
              <div className="mt-2 font-semibold">Relatórios</div>
              <div className="text-xs text-muted-foreground">Gráficos e evolução</div>
            </Link>
            <Link href="/app/sessoes" className="card-soft p-4 hover:border-primary">
              <BookOpen className="h-6 w-6 text-primary" />
              <div className="mt-2 font-semibold">Sessões</div>
              <div className="text-xs text-muted-foreground">Ver histórico</div>
            </Link>
            <Link href="/app/historico" className="card-soft p-4 hover:border-primary">
              <Calendar className="h-6 w-6 text-accent-foreground" />
              <div className="mt-2 font-semibold">Ver rotinas</div>
              <div className="text-xs text-muted-foreground">Rotinas das crianças</div>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/rotina" className="card-soft p-4 hover:border-primary">
              <ClipboardList className="h-6 w-6 text-primary" />
              <div className="mt-2 font-semibold">Registrar rotina</div>
              <div className="text-xs text-muted-foreground">Como foi o dia?</div>
            </Link>
            <Link href="/app/historico" className="card-soft p-4 hover:border-primary">
              <Calendar className="h-6 w-6 text-accent-foreground" />
              <div className="mt-2 font-semibold">Histórico</div>
              <div className="text-xs text-muted-foreground">Dias anteriores</div>
            </Link>
          </>
        )}
      </section>

      {isPro && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Últimas sessões</h2>
          {sessions.length === 0 ? (
            <p className="card-soft p-4 text-center text-sm text-muted-foreground">
              Nenhuma sessão registrada.
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => {
                const child = children.find((c) => c.id === s.child_id);
                return (
                  <div key={s.id} className="card-soft p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">{child?.nome ?? "Criança"}</span>
                      <span className="text-xs text-muted-foreground">{new Date(s.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                    {s.evolucao && (
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        s.evolucao === "Melhorou" ? "bg-mint text-mint-foreground" :
                        s.evolucao === "Regrediu" ? "bg-peach text-peach-foreground" : "bg-muted text-muted-foreground"
                      }`}>{s.evolucao}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold">Últimas rotinas</h2>
        {routines.length === 0 ? (
          <p className="card-soft p-4 text-center text-sm text-muted-foreground">
            Nenhuma rotina registrada ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {routines.map((r) => {
              const child = children.find((c) => c.id === r.child_id);
              return (
                <div key={r.id} className="card-soft p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{child?.nome ?? "Criança"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.data).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {r.humor && <span className="mt-1 inline-block text-xs text-muted-foreground">Humor: {r.humor}</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
