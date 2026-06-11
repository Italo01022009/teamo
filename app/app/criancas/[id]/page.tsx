"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface Child {
  id: string; nome: string; idade: number; diagnostico: string | null;
  dificuldades: string[]; habilidades: string[]; sensibilidades: string[];
  preferencias: string[]; rotina_escolar: string | null; observacoes: string | null;
}

export default function CriancaDetalhePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { profile } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("children").select("*").eq("id", id).maybeSingle();
      setChild(data as Child | null);
      setLoading(false);
    })();
  }, [id]);

  const remove = async () => {
    if (!confirm("Remover esta criança?")) return;
    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Criança removida.");
    router.push("/app");
  };

  if (loading) return <div className="card-soft h-40 animate-pulse" />;
  if (!child) return <p className="text-center text-muted-foreground">Criança não encontrada.</p>;

  return (
    <div className="space-y-5">
      <Link href="/app" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <div className="card-soft gradient-soft p-5">
        <h1 className="text-2xl font-bold">{child.nome}</h1>
        <p className="text-sm text-muted-foreground">{child.idade} anos</p>
      </div>
      {profile?.tipo === "profissional" ? (
        <Link href={`/app/sessoes/nova?childId=${child.id}`} className="card-soft flex items-center gap-3 p-4 hover:border-primary"><ClipboardList className="h-5 w-5 text-primary" /><span className="font-semibold">Nova sessão</span></Link>
      ) : (
        <Link href={`/app/rotina?childId=${child.id}`} className="card-soft flex items-center gap-3 p-4 hover:border-primary"><ClipboardList className="h-5 w-5 text-primary" /><span className="font-semibold">Registrar rotina</span></Link>
      )}
      <Button variant="ghost" onClick={remove} className="w-full text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Remover criança</Button>
    </div>
  );
}
