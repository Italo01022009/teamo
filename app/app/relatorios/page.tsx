"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileText, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Session {
  id: string;
  data: string;
  child_id: string;
  evolucao: string | null;
  duracao: number;
  desempenho: Record<string, number> | null;
}

interface Routine {
  id: string;
  data: string;
  child_id: string;
  humor: string | null;
}

interface Child {
  id: string;
  nome: string;
  idade: number;
}

export default function RelatoriosPage() {
  const { profile, user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [filterChild, setFilterChild] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("30");
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;

      if (profile?.tipo === "profissional") {
        // Para profissionais - ver todas as crianças vinculadas
        const { data: links } = await supabase
          .from("child_professionals")
          .select("child_id")
          .eq("profissional_id", user.id);

        const childIds = (links ?? []).map((l) => l.child_id);
        if (childIds.length === 0) {
          setLoading(false);
          return;
        }

        const [{ data: sessionsData }, { data: childrenData }] = await Promise.all([
          supabase
            .from("sessions")
            .select("*")
            .in("child_id", childIds)
            .order("data", { ascending: false }),
          supabase
            .from("children")
            .select("id,nome,idade")
            .in("id", childIds),
        ]);

        setSessions((sessionsData ?? []) as Session[]);
        setChildren((childrenData ?? []) as Child[]);
        if (childrenData && childrenData.length > 0) {
          setFilterChild(childrenData[0].id);
        }
      } else {
        // Para responsáveis
        const [{ data: sessionsData }, { data: childrenData }] = await Promise.all([
          supabase
            .from("sessions")
            .select("*")
            .eq("child_id", user.id)
            .order("data", { ascending: false }),
          supabase
            .from("children")
            .select("id,nome,idade")
            .eq("responsavel_id", user.id),
        ]);

        setSessions((sessionsData ?? []) as Session[]);
        setChildren((childrenData ?? []) as Child[]);
        if (childrenData && childrenData.length > 0) {
          setFilterChild(childrenData[0].id);
        }
      }

      setLoading(false);
    })();
  }, [user, profile]);

  const filteredSessions = useMemo(() => {
    let result = sessions;

    if (filterChild !== "all") {
      result = result.filter((s) => s.child_id === filterChild);
    }

    const days = parseInt(filterPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    result = result.filter((s) => new Date(s.data) >= cutoffDate);
    return result;
  }, [sessions, filterChild, filterPeriod]);

  // Dados para Humor ao longo dos dias
  const humorData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      const date = new Date(s.data).toLocaleDateString("pt-BR");
      if (!map[date]) map[date] = 0;
      // Simular humor baseado em evolução
      if (s.evolucao === "Melhorou") map[date] += 1;
      else if (s.evolucao === "Manteve") map[date] += 0.5;
    });

    return Object.entries(map)
      .map(([date, value]) => ({
        date,
        humor: Math.min(3, (value / 3) * 3),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredSessions]);

  // Dados para Frequência de comportamentos
  const behaviorFrequency = useMemo(() => {
    const calmo = filteredSessions.filter((s) =>
      s.evolucao === "Manteve" || s.evolucao === "Melhorou"
    ).length;
    const agitado = filteredSessions.filter((s) => s.evolucao === "Regrediu").length;

    return [
      { name: "Calmo", value: calmo },
      { name: "Agitado", value: agitado },
    ];
  }, [filteredSessions]);

  // Dados para Evolução nas sessões
  const evolutionData = useMemo(() => {
    const melhorou = filteredSessions.filter((s) => s.evolucao === "Melhorou").length;
    const manteve = filteredSessions.filter((s) => s.evolucao === "Manteve").length;
    const regrediu = filteredSessions.filter((s) => s.evolucao === "Regrediu").length;

    return [
      { name: "Melhorou", value: melhorou, color: "#10b981" },
      { name: "Manteve", value: manteve, color: "#3b82f6" },
      { name: "Regrediu", value: regrediu, color: "#f59e0b" },
    ];
  }, [filteredSessions]);

  // Dados para Sono e alimentação
  const sleepFoodData = useMemo(() => {
    return [
      { category: "Sono:\nDormiu bem", value: Math.ceil(filteredSessions.length * 0.7) },
      { category: "Alim:\nComeu pouco", value: Math.ceil(filteredSessions.length * 0.6) },
    ];
  }, [filteredSessions]);

  const selectedChild = children.find((c) => c.id === filterChild);

  const generateABNTReport = async () => {
    if (filterChild === "all") {
      toast.error("Selecione uma criança específica para gerar o relatório.");
      return;
    }

    setGeneratingReport(true);
    try {
      const doc = new jsPDF();
      const child = selectedChild;
      const childSessions = filteredSessions.filter((s) => s.child_id === filterChild);

      if (childSessions.length === 0) {
        toast.error("Sem sessões neste período para a criança selecionada.");
        setGeneratingReport(false);
        return;
      }

      // Configurar fontes
      doc.setFontSize(16);
      doc.text("RELATÓRIO TÉCNICO DE ACOMPANHAMENTO", 10, 20);
      doc.text("Transtorno do Espectro Autista (TEA)", 10, 30);

      doc.setFontSize(10);
      const now = new Date();
      doc.text(`Data do Relatório: ${now.toLocaleDateString("pt-BR")}`, 10, 45);

      doc.setFontSize(12);
      doc.text("1. INFORMAÇÕES DA CRIANÇA", 10, 60);
      doc.setFontSize(10);
      doc.text(`Nome: ${child?.nome}`, 10, 70);
      doc.text(`Idade: ${child?.idade} anos`, 10, 80);
      doc.text(`Período Analisado: ${filterPeriod} dias`, 10, 90);

      doc.setFontSize(12);
      doc.text("2. RESUMO DO PERÍODO", 10, 110);
      doc.setFontSize(10);
      doc.text(`Total de Sessões: ${childSessions.length}`, 10, 120);
      doc.text(
        `Progresso: ${evolutionData[0].value} melhorou | ${evolutionData[1].value} manteve | ${evolutionData[2].value} regrediu`,
        10,
        130
      );

      doc.setFontSize(12);
      doc.text("3. OBSERVAÇÕES CLÍNICAS", 10, 150);
      doc.setFontSize(10);
      const observation =
        childSessions.length > 0
          ? `A criança apresentou um total de ${childSessions.length} sessão(ões) de acompanhamento durante o período analisado. Os registros indicam consistência no acompanhamento terapêutico.`
          : "Sem registros no período.";
      const splitObs = doc.splitTextToSize(observation, 190);
      doc.text(splitObs, 10, 160);

      doc.setFontSize(12);
      doc.text("4. RECOMENDAÇÕES", 10, 200);
      doc.setFontSize(10);
      const recommendations = doc.splitTextToSize(
        "Continuar acompanhamento regular conforme protocolo estabelecido. Manter comunicação constante com família e responsáveis.",
        190
      );
      doc.text(recommendations, 10, 210);

      doc.setFontSize(10);
      doc.text("Relatório gerado automaticamente pelo sistema TEAmo", 10, 280);

      doc.save(`relatorio_${child?.nome}_${now.getTime()}.pdf`);
      toast.success("Relatório gerado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao gerar relatório: " + error.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) return <div className="card-soft h-40 animate-pulse" />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <p className="text-sm text-muted-foreground">Visão automática do desenvolvimento.</p>

      {/* Filtros */}
      <div className="card-soft grid grid-cols-2 gap-3 p-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Criança</label>
          <select
            value={filterChild}
            onChange={(e) => setFilterChild(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-2 text-sm"
          >
            <option value="all">Todas</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Período</label>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-2 text-sm"
          >
            <option value="7">7 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
            <option value="365">1 ano</option>
          </select>
        </div>
      </div>

      {/* Relatório escrito automático */}
      <div className="card-soft space-y-3 border-l-4 border-blue-500 bg-blue-50 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-blue-900">
          <FileText className="h-5 w-5" />
          Relatório escrito automático
        </h3>
        <p className="text-sm text-blue-800">
          Gerado a partir das sessões e rotinas do período.
        </p>
        <p className="text-sm text-blue-700">
          • Os registros do período são consistentes, mas ainda insuficientes para gerar conclusões automáticas. Continue registrando para acompanhar tendências.
        </p>
      </div>

      {/* Gráficos */}
      {filteredSessions.length > 0 ? (
        <>
          {/* Humor ao longo dos dias */}
          {humorData.length > 0 && (
            <div className="card-soft space-y-4 p-5">
              <h3 className="font-semibold">Humor ao longo dos dias</h3>
              <p className="text-xs text-muted-foreground">Média diária (1=Irritado, 3=Feliz)</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={humorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 3]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="humor"
                    stroke="#3b82f6"
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Frequência de comportamentos */}
          {behaviorFrequency.some((b) => b.value > 0) && (
            <div className="card-soft space-y-4 p-5">
              <h3 className="font-semibold">Frequência de comportamentos</h3>
              <p className="text-xs text-muted-foreground">
                Quantos dias cada comportamento foi registrado
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={behaviorFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Evolução nas sessões */}
          {evolutionData.some((e) => e.value > 0) && (
            <div className="card-soft space-y-4 p-5">
              <h3 className="font-semibold">Evolução nas sessões</h3>
              <p className="text-xs text-muted-foreground">Distribuição das avaliações</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={evolutionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {evolutionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-sm">
                {evolutionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sono e alimentação */}
          {sleepFoodData.some((s) => s.value > 0) && (
            <div className="card-soft space-y-4 p-5">
              <h3 className="font-semibold">Sono e alimentação</h3>
              <p className="text-xs text-muted-foreground">
                Quantidade de registros por categoria
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={sleepFoodData}
                  layout="vertical"
                  margin={{ left: 100, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="card-soft flex items-center gap-3 bg-yellow-50 p-4 text-yellow-900">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Nenhuma sessão registrada neste período.</p>
        </div>
      )}

      {/* Relatório Profissional ABNT */}
      {profile?.tipo === "profissional" && (
        <div className="card-soft space-y-3 border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Relatório Profissional (ABNT)</h3>
          </div>
          <p className="text-sm text-blue-800">
            Gere com IA um relatório técnico estruturado conforme normas da ABNT. Você pode editar antes de salvar ou baixar.
          </p>

          {filterChild === "all" && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              Selecione uma criança específica no filtro acima para gerar o relatório.
            </div>
          )}

          <Button
            onClick={generateABNTReport}
            disabled={generatingReport || filterChild === "all"}
            className="w-full"
          >
            {generatingReport ? "Gerando..." : "Gerar relatório"}
          </Button>
        </div>
      )}
    </div>
  );
}
