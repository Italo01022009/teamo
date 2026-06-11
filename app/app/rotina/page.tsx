"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ChoiceGrid } from "@/components/teamo/ChoiceGrid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";

export default function NovaRotinaPage() {
  const params = useSearchParams();
  const childId = z.string().optional().parse(params.get("childId") ?? undefined);
  const { profile } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [children, setChildren] = useState<{ id: string; nome: string }[]>([]);
  const [data, setData] = useState({
    child_id: childId ?? "",
    data: new Date().toISOString().slice(0, 10),
    sono: "", alimentacao: "", humor: "", energia: "",
    comunicacao: "", interacao: "",
    atividades: [] as string[], comportamentos: [] as string[], eventos: [] as string[],
    medicacao: "", observacoes: "",
  });

  useEffect(() => {
    supabase.from("children").select("id,nome").then(({ data: d }) => setChildren((d ?? []) as { id: string; nome: string }[]));
  }, []);

  if (!profile) return null;

  const toggleArr = (k: keyof typeof data, v: string) => setData((d) => {
    const a = d[k] as string[];
    return { ...d, [k]: a.includes(v) ? a.filter((x) => x !== v) : [...a, v] };
  });

  const save = async () => {
    if (!data.child_id) { toast.error("Selecione a criança."); return; }
    setBusy(true);
    const { error } = await supabase.from("routines").insert({
      child_id: data.child_id,
      responsavel_id: profile.id,
      data: data.data,
      sono: data.sono || null,
      alimentacao: data.alimentacao || null,
      humor: data.humor || null,
      energia: data.energia || null,
      comunicacao: data.comunicacao || null,
      interacao: data.interacao || null,
      atividades: data.atividades,
      comportamentos: data.comportamentos,
      eventos: data.eventos,
      medicacao: data.medicacao || null,
      observacoes: data.observacoes || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Rotina registrada!");
    router.push("/app");
  };

  return (
    <div className="space-y-5 pb-6">
      <button onClick={() => router.push("/app")} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="card-soft gradient-soft p-5">
        <h1 className="text-2xl font-bold">Como foi o dia?</h1>
        <p className="text-sm text-muted-foreground">Toque para registrar, bem rapidinho.</p>
      </div>

      <div className="card-soft space-y-4 p-5">
        <div>
          <Label>Criança</Label>
          <select value={data.child_id} onChange={(e) => setData({ ...data, child_id: e.target.value })}
            className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">Selecione...</option>
            {children.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="card-soft space-y-5 p-5">
        <ChoiceGrid options={[
          {value:"Dormiu bem",label:"Dormiu bem"},
          {value:"Acordou à noite",label:"Acordou à noite"},
          {value:"Dormiu pouco",label:"Dormiu pouco"},
          {value:"Dormiu muito",label:"Dormiu muito"},
        ]} value={data.sono} onChange={(v) => setData({ ...data, sono: v })} columns={2} />

        <ChoiceGrid options={[
          {value:"Comeu bem",label:"Comeu bem"},
          {value:"Comeu pouco",label:"Comeu pouco"},
          {value:"Recusou comida",label:"Recusou comida"},
          {value:"Seletividade alimentar",label:"Seletividade alimentar"},
        ]} value={data.alimentacao} onChange={(v) => setData({ ...data, alimentacao: v })} columns={2} />

        <ChoiceGrid options={[
          {value:"Feliz",label:"Feliz"},
          {value:"Neutro",label:"Neutro"},
          {value:"Irritado",label:"Irritado"},
          {value:"Triste",label:"Triste"},
        ]} value={data.humor} onChange={(v) => setData({ ...data, humor: v })} columns={2} />

        <ChoiceGrid options={[{value:"Baixa",label:"Baixa"},{value:"Normal",label:"Normal"},{value:"Alta",label:"Alta"}]} value={data.energia} onChange={(v) => setData({ ...data, energia: v })} columns={3} />

        <ChoiceGrid options={[
          {value:"Brincou",label:"Brincou"},
          {value:"Estudou",label:"Estudou"},
          {value:"Terapia",label:"Terapia"},
          {value:"Assistiu TV",label:"TV"},
          {value:"Usou celular",label:"Celular"},
          {value:"Saiu de casa",label:"Saiu"},
        ]} value={data.atividades} onChange={(v) => toggleArr("atividades", v)} multi columns={3} />

        <div>
          <Label htmlFor="obs">Observações (opcional)</Label>
          <Textarea id="obs" value={data.observacoes} onChange={(e) => setData({ ...data, observacoes: e.target.value })} />
        </div>
      </div>

      <Button onClick={save} disabled={busy} className="h-12 w-full text-base">
        <Check className="mr-2 h-5 w-5" /> {busy ? "Salvando..." : "Salvar dia"}
      </Button>
    </div>
  );
}
