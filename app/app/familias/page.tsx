"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Heart, Baby, Mail, UserCheck } from "lucide-react";

interface ChildRow { id: string; nome: string; idade: number; diagnostico: string | null; responsavel_id: string; }
interface ProfileRow { id: string; nome: string; email: string; }
interface RoutineRow { id: string; child_id: string; data: string; humor: string | null; }
interface LinkRow { child_id: string; responsavel_id: string; }
interface SessionRow { id: string; child_id: string; data: string; evolucao: string | null; }

export default function FamiliasPage() {
  const { profile, user } = useAuth();
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [responsaveis, setResponsaveis] = useState<Record<string, ProfileRow>>({});
  const [linkOwners, setLinkOwners] = useState<Record<string, string>>({});
  const [routines, setRoutines] = useState<RoutineRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: links } = await supabase.from("child_professionals").select("child_id,responsavel_id").eq("profissional_id", user.id);
    const linkRows = (links ?? []) as LinkRow[];
    const ownersByChild: Record<string, string> = {};
    linkRows.forEach((l) => {
      ownersByChild[l.child_id] = l.responsavel_id;
    });
    setLinkOwners(ownersByChild);
    const linkedIds = linkRows.map((l) => l.child_id);
    const { data: kidsDirect } = await supabase.from("children").select("id,nome,idade,diagnostico,responsavel_id").eq("profissional_id", user.id);
    let kidsLinked: ChildRow[] = [];
    if (linkedIds.length > 0) {
      const { data } = await supabase.from("children").select("id,nome,idade,diagnostico,responsavel_id").in("id", linkedIds);
      kidsLinked = (data ?? []) as ChildRow[];
    }
    const map = new Map<string, ChildRow>();
    [...(kidsDirect ?? []), ...kidsLinked].forEach((k) => map.set(k.id, k as ChildRow));
    const allKids = Array.from(map.values());
    setChildren(allKids);
    const respIds = Array.from(new Set([
      ...allKids.map((k) => k.responsavel_id).filter(Boolean),
      ...linkRows.map((l) => l.responsavel_id).filter(Boolean),
    ]));
    if (respIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id,nome,email").in("id", respIds);
      const dict: Record<string, ProfileRow> = {};
      (profs ?? []).forEach((p) => (dict[p.id] = p as ProfileRow));
      setResponsaveis(dict);
    }
    if (allKids.length > 0) {
      const { data: rts } = await supabase.from("routines").select("id,child_id,data,humor").in("child_id", allKids.map((k) => k.id)).order("data", { ascending: false }).limit(20);
      setRoutines((rts ?? []) as RoutineRow[]);
      const { data: sts } = await supabase.from("sessions").select("id,child_id,data,evolucao").eq("profissional_id", user.id).in("child_id", allKids.map((k) => k.id)).order("data", { ascending: false }).limit(20);
      setSessions((sts ?? []) as SessionRow[]);
    } else setRoutines([]);
    if (allKids.length === 0) setSessions([]);
    setLoading(false);
  }, [user]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  if (profile?.tipo !== "profissional") return <div className="card-soft p-6 text-center text-muted-foreground">Página para profissionais.</div>;
  if (loading) return <div className="card-soft h-40 animate-pulse" />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Famílias acompanhadas</h1>
      {children.length === 0 ? <div className="card-soft p-6 text-center text-sm text-muted-foreground">Nenhuma família vinculada ainda.</div> : (
        <div className="space-y-4">
          {children.map((c) => {
            const ownerId = linkOwners[c.id] ?? c.responsavel_id;
            const resp = responsaveis[ownerId];
            const childRoutines = routines.filter((r) => r.child_id === c.id).slice(0, 3);
            const childSessions = sessions.filter((s) => s.child_id === c.id).slice(0, 3);
            return (
              <div key={c.id} className="card-soft p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><Baby className="h-6 w-6" /></div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/app/criancas/${c.id}`} className="font-bold hover:text-primary">{c.nome}</Link>
                    <p className="text-xs text-muted-foreground">{c.idade} anos {c.diagnostico ? `• ${c.diagnostico}` : ""}</p>
                  </div>
                </div>
                {resp && <div className="mt-4 rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">{resp.nome}</span></div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><UserCheck className="h-3.5 w-3.5" /> Responsável pela criança</div>
                  <a href={`mailto:${resp.email}`} className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Mail className="h-3 w-3" /> {resp.email}</a>
                </div>}
                <div className="mt-4">
                  {childRoutines.length === 0 ? <p className="text-xs text-muted-foreground">Nenhuma rotina registrada.</p> : (
                    <ul className="space-y-1">{childRoutines.map((r) => <li key={r.id} className="flex items-center justify-between text-sm"><span>{new Date(r.data).toLocaleDateString("pt-BR")}</span><span className="text-muted-foreground">{r.humor ?? "-"}</span></li>)}</ul>
                  )}
                </div>
                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold text-foreground">Sessões registradas por você</p>
                  {childSessions.length === 0 ? <p className="text-xs text-muted-foreground">Nenhuma sessão registrada por você ainda.</p> : (
                    <ul className="space-y-1">{childSessions.map((s) => <li key={s.id} className="flex items-center justify-between text-sm"><span>{new Date(s.data).toLocaleDateString("pt-BR")}</span><span className="text-muted-foreground">{s.evolucao ?? "-"}</span></li>)}</ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
