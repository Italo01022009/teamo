"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Stethoscope, Check, X, Search, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Profissional { id: string; nome: string; email: string; }
interface Child { id: string; nome: string; idade: number; diagnostico: string | null; }
interface LinkRow { id: string; child_id: string; profissional_id: string; }
interface SessionRow {
  id: string;
  data: string;
  child_id: string;
  profissional_id: string;
  evolucao: string | null;
  observacoes: string | null;
}

export default function ProfissionaisPage() {
  const { profile, user } = useAuth();
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [sessionsByProfessional, setSessionsByProfessional] = useState<Record<string, SessionRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedChild, setSelectedChild] = useState<string>("");

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: profs }, { data: kids }, { data: lks }] = await Promise.all([
      supabase.from("profiles").select("id,nome,email").eq("tipo", "profissional").order("nome"),
      supabase.from("children").select("id,nome,idade,diagnostico").eq("responsavel_id", user.id).order("nome"),
      supabase.from("child_professionals").select("id,child_id,profissional_id").eq("responsavel_id", user.id),
    ]);
    setProfissionais((profs ?? []) as Profissional[]);
    setChildren((kids ?? []) as Child[]);
    setLinks((lks ?? []) as LinkRow[]);
    if (kids && kids.length > 0) setSelectedChild((prev) => prev || kids[0].id);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!selectedChild || links.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionsByProfessional({});
      return;
    }
    (async () => {
      const profIds = Array.from(
        new Set(
          links
            .filter((l) => l.child_id === selectedChild)
            .map((l) => l.profissional_id),
        ),
      );
      if (profIds.length === 0) {
        setSessionsByProfessional({});
        return;
      }
      const { data } = await supabase
        .from("sessions")
        .select("id,data,child_id,profissional_id,evolucao,observacoes")
        .eq("child_id", selectedChild)
        .in("profissional_id", profIds)
        .order("data", { ascending: false });
      const grouped: Record<string, SessionRow[]> = {};
      ((data ?? []) as SessionRow[]).forEach((session) => {
        if (!grouped[session.profissional_id]) grouped[session.profissional_id] = [];
        grouped[session.profissional_id].push(session);
      });
      setSessionsByProfessional(grouped);
    })();
  }, [links, selectedChild]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  if (profile?.tipo !== "responsavel") return <div className="card-soft p-6 text-center text-muted-foreground">Página para responsáveis.</div>;
  if (loading) return <div className="card-soft h-40 animate-pulse" />;

  const isLinked = (profId: string) => links.some((l) => l.profissional_id === profId && l.child_id === selectedChild);
  const toggleLink = async (prof: Profissional) => {
    if (!user || !selectedChild) return toast.error("Cadastre uma criança primeiro.");
    const existing = links.find((l) => l.profissional_id === prof.id && l.child_id === selectedChild);
    if (existing) {
      const { error } = await supabase.from("child_professionals").delete().eq("id", existing.id);
      if (error) return toast.error(error.message);
      toast.success(`${prof.nome} desvinculado.`);
    } else {
      const { error } = await supabase.from("child_professionals").insert({ child_id: selectedChild, profissional_id: prof.id, responsavel_id: user.id });
      if (error) return toast.error(error.message);
      toast.success(`${prof.nome} vinculado.`);
    }
    load();
  };

  const filtered = profissionais.filter((p) => p.nome.toLowerCase().includes(query.toLowerCase()) || p.email.toLowerCase().includes(query.toLowerCase()));
  const selectedChildData = children.find((c) => c.id === selectedChild);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Profissionais</h1>
      {children.length === 0 ? <div className="card-soft p-5 text-center text-sm text-muted-foreground">Cadastre uma criança primeiro.</div> : <>
        <div className="card-soft space-y-3 p-4">
          <div className="flex flex-wrap gap-2">{children.map((c) => <button key={c.id} onClick={() => setSelectedChild(c.id)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${selectedChild === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{c.nome}</button>)}</div>
          {selectedChildData && (
            <p className="text-xs text-muted-foreground">
              {selectedChildData.idade} anos {selectedChildData.diagnostico ? `• ${selectedChildData.diagnostico}` : ""}
            </p>
          )}
        </div>
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar profissional" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" /></div>
        <div className="space-y-3">{filtered.map((p) => {
          const linked = isLinked(p.id);
          const sessions = sessionsByProfessional[p.id] ?? [];
          return <div key={p.id} className="card-soft flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary"><Stethoscope className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.nome}</p>
              <p className="truncate text-xs text-muted-foreground">{p.email}</p>
              {linked && (
                <div className="mt-2 rounded-xl bg-muted/60 p-2">
                  <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-foreground">
                    <ClipboardList className="h-3.5 w-3.5 text-primary" />
                    Registros deste profissional
                  </p>
                  {sessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma sessão registrada para esta criança.</p>
                  ) : (
                    <ul className="space-y-1">
                      {sessions.slice(0, 3).map((s) => (
                        <li key={s.id} className="rounded-md bg-background/70 px-2 py-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span>{new Date(s.data).toLocaleDateString("pt-BR")}</span>
                            <span className="text-muted-foreground">{s.evolucao ?? "Sem evolução"}</span>
                          </div>
                          {s.observacoes && <p className="mt-1 line-clamp-2 text-muted-foreground">{s.observacoes}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <Button size="sm" variant={linked ? "outline" : "default"} onClick={() => toggleLink(p)}>{linked ? <><X className="mr-1 h-4 w-4" /> Desvincular</> : <><Check className="mr-1 h-4 w-4" /> Vincular</>}</Button>
          </div>;
        })}</div>
      </>}
    </div>
  );
}
