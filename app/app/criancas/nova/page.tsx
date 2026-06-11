"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChoiceGrid } from "@/components/teamo/ChoiceGrid";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const DIAGNOSTICOS = ["Nível 1 (suporte leve)", "Nível 2 (suporte substancial)", "Nível 3 (suporte muito substancial)", "Em investigação"];
const DIFIC = ["Comunicação", "Interação social", "Mudanças", "Sensoriais", "Atenção", "Crises", "Sono", "Alimentação"];
const HABIL = ["Memória", "Música", "Leitura", "Lógica", "Visual", "Motora", "Foco", "Curiosidade"];
const SENSI = ["Sons altos", "Luzes fortes", "Texturas", "Cheiros", "Multidão", "Toque"];
const PREFER = ["Brinquedos", "Livros", "Vídeos", "Jogos", "Música", "Animais", "Carrinhos", "Quebra-cabeça"];

export default function NovaCriancaPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState({
    nome: "", idade: "", diagnostico: "",
    dificuldades: [] as string[], habilidades: [] as string[],
    sensibilidades: [] as string[], preferencias: [] as string[],
    rotina_escolar: "", observacoes: "",
  });

  if (!profile) return null;
  const total = 6;

  const toggle = (k: keyof typeof data, v: string) => {
    setData((d) => {
      const arr = d[k] as string[];
      return { ...d, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  };

  const save = async () => {
    if (!data.nome || !data.idade) {
      toast.error("Informe ao menos nome e idade.");
      setStep(0);
      return;
    }
    setBusy(true);
    const payload = {
      nome: data.nome.trim(),
      idade: parseInt(data.idade, 10) || 0,
      diagnostico: data.diagnostico || null,
      dificuldades: data.dificuldades,
      habilidades: data.habilidades,
      sensibilidades: data.sensibilidades,
      preferencias: data.preferencias,
      rotina_escolar: data.rotina_escolar || null,
      observacoes: data.observacoes || null,
      responsavel_id: profile.tipo === "responsavel" ? profile.id : null,
      profissional_id: profile.tipo === "profissional" ? profile.id : null,
    };
    const { error } = await supabase.from("children").insert(payload);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Criança cadastrada!");
    router.push("/app");
  };

  const next = () => step < total - 1 ? setStep(step + 1) : save();
  const back = () => step > 0 ? setStep(step - 1) : router.push("/app");

  return (
    <div className="space-y-5">
      <div>
        <button onClick={back} className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="mb-1 flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Etapa {step + 1} de {total}</p>
      </div>

      <div className="card-soft p-5">
        {step === 0 && <div className="space-y-4"><h2 className="text-xl font-bold">Quem é a criança?</h2><div><Label htmlFor="nome">Nome</Label><Input id="nome" value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} /></div><div><Label htmlFor="idade">Idade</Label><Input id="idade" type="number" min={0} max={25} value={data.idade} onChange={(e) => setData({ ...data, idade: e.target.value })} /></div></div>}
        {step === 1 && <div className="space-y-3"><h2 className="text-xl font-bold">Nível de suporte</h2><ChoiceGrid options={DIAGNOSTICOS.map((d) => ({ value: d, label: d }))} value={data.diagnostico} onChange={(v) => setData({ ...data, diagnostico: v })} columns={2} /></div>}
        {step === 2 && <div className="space-y-3"><h2 className="text-xl font-bold">Principais dificuldades</h2><ChoiceGrid options={DIFIC.map((d) => ({ value: d, label: d }))} value={data.dificuldades} onChange={(v) => toggle("dificuldades", v)} multi columns={2} /></div>}
        {step === 3 && <div className="space-y-3"><h2 className="text-xl font-bold">Habilidades e talentos</h2><ChoiceGrid options={HABIL.map((d) => ({ value: d, label: d }))} value={data.habilidades} onChange={(v) => toggle("habilidades", v)} multi columns={2} /></div>}
        {step === 4 && <div className="space-y-4"><ChoiceGrid options={SENSI.map((d) => ({ value: d, label: d }))} value={data.sensibilidades} onChange={(v) => toggle("sensibilidades", v)} multi columns={2} /><ChoiceGrid options={PREFER.map((d) => ({ value: d, label: d }))} value={data.preferencias} onChange={(v) => toggle("preferencias", v)} multi columns={2} /></div>}
        {step === 5 && <div className="space-y-3"><div><Label htmlFor="esc">Rotina escolar</Label><Textarea id="esc" value={data.rotina_escolar} onChange={(e) => setData({ ...data, rotina_escolar: e.target.value })} /></div><div><Label htmlFor="obs">Observações</Label><Textarea id="obs" value={data.observacoes} onChange={(e) => setData({ ...data, observacoes: e.target.value })} /></div></div>}
      </div>

      <Button onClick={next} disabled={busy} className="h-12 w-full text-base">
        {step === total - 1 ? <span className="flex items-center gap-2"><Check className="h-5 w-5" /> {busy ? "Salvando..." : "Salvar"}</span> : <span className="flex items-center gap-2">Próximo <ArrowRight className="h-5 w-5" /></span>}
      </Button>
    </div>
  );
}
