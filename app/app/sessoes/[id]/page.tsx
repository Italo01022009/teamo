"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  child_id: string;
  profissional_id: string;
  data: string;
  duracao: number;
  evolucao: string | null;
  desempenho: Record<string, number> | null;
  objetivos: string[] | null;
  atividades: string[] | null;
  comportamento: string[] | null;
  estrategias: string[] | null;
  recomendacoes: string | null;
  observacoes: string | null;
}

interface Child {
  nome: string;
}

interface Professional {
  nome: string;
}

const evolucaoColors: Record<string, string> = {
  "Melhorou": "bg-green-100 text-green-800",
  "Manteve": "bg-blue-100 text-blue-800",
  "Regrediu": "bg-red-100 text-red-800",
};

const performanceColors: Record<string, string> = {
  "Baixo": "bg-red-200",
  "Médio": "bg-yellow-200",
  "Alto": "bg-green-200",
};

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [session, setSession] = useState<Session | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!sessionData) {
        setLoading(false);
        return;
      }

      setSession(sessionData as Session);

      const [{ data: childData }, { data: profData }] = await Promise.all([
        supabase.from("children").select("nome").eq("id", sessionData.child_id).maybeSingle(),
        supabase.from("profiles").select("nome").eq("id", sessionData.profissional_id).maybeSingle(),
      ]);

      setChild(childData as Child);
      setProfessional(profData as Professional);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="card-soft h-40 animate-pulse" />;
  if (!session) return <p className="text-center text-muted-foreground">Sessão não encontrada.</p>;

  const getPerformanceWidth = (value: number) => Math.min(100, (value / 3) * 100);

  return (
    <div className="space-y-4">
      <Link href="/app/sessoes" className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Header */}
      <div className="card-soft gradient-soft space-y-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{child?.nome}</h1>
            <p className="text-sm text-muted-foreground">
              📅 {new Date(session.data).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-sm text-muted-foreground">
              ⏱️ {session.duracao} min
            </p>
            {professional && (
              <p className="text-sm text-muted-foreground">
                👨‍⚕️ {professional.nome}
              </p>
            )}
          </div>
          {session.evolucao && (
            <Badge className={evolucaoColors[session.evolucao] || ""}>
              {session.evolucao}
            </Badge>
          )}
        </div>
      </div>

      {/* Desempenho da sessão */}
      {session.desempenho && (
        <div className="card-soft space-y-4 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Desempenho da sessão</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(session.desempenho).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{key}</span>
                  <span className="text-muted-foreground">
                    {["Baixo", "Médio", "Alto"][Math.round(value) - 1] || "Médio"}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all ${performanceColors[
                      ["Baixo", "Médio", "Alto"][Math.round(value) - 1] || "Médio"
                    ] || "bg-gray-400"}`}
                    style={{ width: `${getPerformanceWidth(value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objetivos */}
      {session.objetivos && session.objetivos.length > 0 && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Objetivos</h2>
          <div className="flex flex-wrap gap-2">
            {session.objetivos.map((obj, idx) => (
              <Badge key={idx} variant="outline">
                {obj}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Atividades realizadas */}
      {session.atividades && session.atividades.length > 0 && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Atividades realizadas</h2>
          <div className="flex flex-wrap gap-2">
            {session.atividades.map((ativ, idx) => (
              <Badge key={idx} variant="secondary">
                {ativ}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Comportamento observado */}
      {session.comportamento && session.comportamento.length > 0 && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Comportamento observado</h2>
          <div className="flex flex-wrap gap-2">
            {session.comportamento.map((comp, idx) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                {comp}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Estratégias utilizadas */}
      {session.estrategias && session.estrategias.length > 0 && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Estratégias utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {session.estrategias.map((est, idx) => (
              <Badge key={idx} className="bg-yellow-100 text-yellow-800">
                {est}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações para casa */}
      {session.recomendacoes && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Recomendações para casa</h2>
          <p className="text-sm text-muted-foreground">{session.recomendacoes}</p>
        </div>
      )}

      {/* Observações */}
      {session.observacoes && (
        <div className="card-soft space-y-3 p-5">
          <h2 className="font-semibold">Observações</h2>
          <p className="text-sm text-muted-foreground">{session.observacoes}</p>
        </div>
      )}
    </div>
  );
}
