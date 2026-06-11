"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ChoiceGrid } from "@/components/teamo/ChoiceGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const OBJ = ["Comunicação", "Social", "Motor", "Emocional", "Atenção", "Autonomia"];
const ATIV = ["Brincadeiras", "Jogos", "Sensoriais", "Comunicação", "Interação"];
const COMPORT = ["Calmo", "Engajado", "Agitado", "Crises", "Repetições"];
const DIFIC = ["Comunicação", "Atenção", "Sensorial"];
const EVOLU = ["Melhorou", "Manteve", "Regrediu"];
const ESTRAT = ["Reforço positivo", "Rotina estruturada", "Estímulos visuais"];
const ESCALA = ["Baixo", "Médio", "Alto"];

export default function NovaSessaoPage() {
  const search = useSearchParams();
  const childId = z.string().optional().parse(search.get("childId") ?? undefined);
  const { profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [children, setChildren] = useState<{ id: string; nome: string }[]>([]);
  const [data, setData] = useState({
    child_id: childId ?? "",
    data: new Date().toISOString().slice(0, 10),
    duracao: "60",
    objetivos: [] as string[],
    atividades: [] as string[],
    desempenho: { comunicacao: "Médio", atencao: "Médio", participacao: "Médio" } as Record<string, string>,
    comportamento: [] as string[],
    dificuldades: [] as string[],
    evolucao: "",
    estrategias: [] as string[],
    recomendacoes: "",
    observacoes: "",
  });

  useEffect(() => {
    supabase.from("children").select("id,nome").then(({ data: d }) => setChildren((d ?? []) as { id: string; nome: string }[]));
  }, []);

  if (!profile) return null;

  if (children.length === 0) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.push("/app")} className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
        <div className="card-soft p-6 text-center">
          <h2 className="text-lg font-bold">Nenhuma criança vinculada</h2>
          <p className="mt-2 text-sm text-muted-foreground">Para registrar sessão, primeiro cadastre uma criança.</p>
          <Link href="/app/criancas/nova" className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Cadastrar criança</Link>
        </div>
      </div>
    );
  }

  const total = 6;
  const toggleArr = (k: keyof typeof data, v: string) => setData((d) => {
    const a = d[k] as string[];
    return { ...d, [k]: a.includes(v) ? a.filter((x) => x !== v) : [...a, v] };
  });

  const save = async () => {
    if (!data.child_id) { toast.error("Selecione a criança."); setStep(0); return; }
    setBusy(true);
    const { error } = await supabase.from("sessions").insert({
      child_id: data.child_id,
      profissional_id: profile.id,
      data: data.data,
      duracao: parseInt(data.duracao, 10) || 60,
      objetivos: data.objetivos,
      atividades: data.atividades,
      desempenho: data.desempenho,
      comportamento: data.comportamento,
      dificuldades: data.dificuldades,
      evolucao: data.evolucao || null,
      estrategias: data.estrategias,
      recomendacoes: data.recomendacoes || null,
      observacoes: data.observacoes || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Sessão registrada!");
    router.push("/app");
  };

  const next = () => step < total - 1 ? setStep(step + 1) : save();
  const back = () => step > 0 ? setStep(step - 1) : router.push("/app");

  return (
    <div className="space-y-5">
      <div>
        <button onClick={back} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</button>
        <div className="mb-1 flex gap-2">{Array.from({ length: total }).map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
        <p className="text-xs text-muted-foreground">Etapa {step + 1} de {total}</p>
      </div>

      <div className="card-soft p-5">
        {step === 0 && <div className="space-y-4"><h2 className="text-xl font-bold">Sessão: dados básicos</h2><div><Label>Criança</Label><select value={data.child_id} onChange={(e) => setData({ ...data, child_id: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="">Selecione...</option>{children.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="d">Data</Label><Input id="d" type="date" value={data.data} onChange={(e) => setData({ ...data, data: e.target.value })} /></div><div><Label htmlFor="dur">Duração (min)</Label><Input id="dur" type="number" min={5} max={300} value={data.duracao} onChange={(e) => setData({ ...data, duracao: e.target.value })} /></div></div></div>}
        {step === 1 && <ChoiceGrid options={OBJ.map((o) => ({ value: o, label: o }))} value={data.objetivos} onChange={(v) => toggleArr("objetivos", v)} multi columns={3} />}
        {step === 2 && <ChoiceGrid options={ATIV.map((o) => ({ value: o, label: o }))} value={data.atividades} onChange={(v) => toggleArr("atividades", v)} multi columns={2} />}
        {step === 3 && <div className="space-y-4">{(["comunicacao", "atencao", "participacao"] as const).map((k) => <div key={k}><Label className="mb-2 block capitalize">{k}</Label><ChoiceGrid options={ESCALA.map((s) => ({ value: s, label: s }))} value={data.desempenho[k]} onChange={(v) => setData({ ...data, desempenho: { ...data.desempenho, [k]: v } })} columns={3} /></div>)}</div>}
        {step === 4 && <div className="space-y-4"><ChoiceGrid options={COMPORT.map((o) => ({ value: o, label: o }))} value={data.comportamento} onChange={(v) => toggleArr("comportamento", v)} multi columns={3} /><ChoiceGrid options={DIFIC.map((o) => ({ value: o, label: o }))} value={data.dificuldades} onChange={(v) => toggleArr("dificuldades", v)} multi columns={3} /></div>}
        {step === 5 && <div className="space-y-4"><ChoiceGrid options={EVOLU.map((o) => ({ value: o, label: o }))} value={data.evolucao} onChange={(v) => setData({ ...data, evolucao: v })} columns={3} /><ChoiceGrid options={ESTRAT.map((o) => ({ value: o, label: o }))} value={data.estrategias} onChange={(v) => toggleArr("estrategias", v)} multi columns={2} /><div><Label htmlFor="rec">Recomendações para casa</Label><Textarea id="rec" value={data.recomendacoes} onChange={(e) => setData({ ...data, recomendacoes: e.target.value })} /></div><div><Label htmlFor="obs">Observações</Label><Textarea id="obs" value={data.observacoes} onChange={(e) => setData({ ...data, observacoes: e.target.value })} /></div></div>}
      </div>

      <Button onClick={next} disabled={busy} className="h-12 w-full text-base">
        {step === total - 1 ? <span className="flex items-center gap-2"><Check className="h-5 w-5" /> {busy ? "Salvando..." : "Salvar sessão"}</span> : <span className="flex items-center gap-2">Próximo <ArrowRight className="h-5 w-5" /></span>}
      </Button>
    </div>
  );
}
