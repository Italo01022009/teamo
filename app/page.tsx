"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/src/components/teamo/Logo";
import {
  Heart,
  Sparkles,
  Users,
  UserPlus,
  ClipboardList,
  LineChart,
  CalendarCheck,
  MessagesSquare,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/app");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <Link
          href="/auth?mode=login"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary-soft"
        >
          Entrar
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-12 pt-6 sm:pt-12">
        <div className="card-soft gradient-hero relative overflow-hidden p-7 sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Cuidado conectado
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Conectando profissionais e famílias para{" "}
              <span className="text-primary">acompanhar cada evolução</span>.
            </h1>
            <p className="mt-4 text-base font-medium text-foreground/80 sm:text-lg">
              Um espaço silencioso e focado.
            </p>
            <p className="mt-3 text-sm text-foreground/70 sm:text-base">
              O TEAmo é a plataforma onde profissionais e responsáveis registram rotinas,
              sessões e evoluções de crianças com TEA — em tempo real, com poucos toques
              e sem complicação.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/escolha"
                className="rounded-2xl bg-primary px-6 py-4 text-center text-base font-semibold text-primary-foreground shadow-lg hover:opacity-95"
              >
                Criar conta gratuita
              </Link>
              <Link
                href="/auth?mode=login"
                className="rounded-2xl border-2 border-foreground/10 bg-white/80 px-6 py-4 text-center text-base font-semibold text-foreground hover:bg-white"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="card-soft p-7 sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Nossa proposta
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Um cuidado mais conectado, mais humano e mais consistente.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Acompanhar uma criança com TEA exige consistência entre quem cuida em casa
              e quem atende clinicamente. O TEAmo une essas duas frentes em um único lugar
              calmo e organizado: a família registra a rotina do dia, e o profissional
              acompanha em tempo real, planeja sessões e devolve evoluções claras.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Como funciona
            </span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Em 3 passos simples</h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: UserPlus,
                step: "1",
                title: "Cadastro",
                text: "Crie sua conta como profissional ou responsável e cadastre a criança em poucos toques.",
              },
              {
                icon: ClipboardList,
                step: "2",
                title: "Registro de rotina",
                text: "A família registra o dia (humor, sono, alimentação, comportamento) com toques rápidos.",
              },
              {
                icon: LineChart,
                step: "3",
                title: "Acompanhamento profissional",
                text: "O profissional acompanha em tempo real, registra sessões e gera relatórios automáticos.",
              },
            ].map((s) => {
              const I = s.icon;
              return (
                <li key={s.step} className="card-soft relative p-5">
                  <div className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                    Passo {s.step}
                  </div>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <I className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-12">
          <div className="mb-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Benefícios
            </span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Tudo o que você precisa em um só lugar
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CalendarCheck,
                title: "Organização de atendimentos",
                text: "Sessões, datas e objetivos sempre à mão para o profissional.",
              },
              {
                icon: ClipboardList,
                title: "Registro detalhado da evolução",
                text: "Comportamento, comunicação, desempenho e estratégias por sessão.",
              },
              {
                icon: MessagesSquare,
                title: "Comunicação família ↔ profissional",
                text: "Rotina diária visível em tempo real para quem acompanha a criança.",
              },
              {
                icon: FileText,
                title: "Relatórios automáticos",
                text: "Gráficos e textos gerados automaticamente a partir dos registros.",
              },
            ].map((b) => {
              const I = b.icon;
              return (
                <div key={b.title} className="card-soft p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-mint-foreground">
                    <I className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="card-soft p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold">Para profissionais</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Psicólogos, fonoaudiólogos, terapeutas ocupacionais e educadores que
              acompanham crianças com TEA e querem organizar atendimentos e acompanhar
              evolução com clareza.
            </p>
          </div>
          <div className="card-soft p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-peach text-peach-foreground">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold">Para responsáveis</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Famílias que querem registrar o dia da criança de forma simples,
              compartilhar com a equipe profissional e acompanhar a evolução ao longo
              do tempo.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="card-soft gradient-soft flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Pronto para começar agora</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie sua conta gratuita e registre o primeiro dia em menos de 2 minutos.
                </p>
              </div>
            </div>
            <Link
              href="/escolha"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-95"
            >
              <Sparkles className="h-4 w-4" /> Criar conta gratuita
            </Link>
          </div>
        </section>
      </section>

      <footer className="border-t border-border bg-card/50 py-6 text-center text-xs text-muted-foreground">
        TEAmo - feito com cuidado para quem cuida.
      </footer>
    </div>
  );
}


