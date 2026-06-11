"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Stethoscope, Sparkles, Users, UserPlus, ClipboardList, LineChart, CalendarCheck, MessagesSquare, FileText, ShieldCheck } from "lucide-react";
import { supabase } from "@/src/integrations/supabase/client";
import { Logo } from "@/src/components/teamo/Logo";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/hooks/use-auth";
import { toast } from "sonner";

function AuthPageContent() {
  const search = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryMode = search.get("mode");
  const queryTipo = search.get("tipo");
  const defaultMode = useMemo(() => (queryMode === "signup" ? "signup" : "login"), [queryMode]);
  const defaultTipo = useMemo(() => (queryTipo === "profissional" ? "profissional" : "responsavel"), [queryTipo]);

  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [tipo, setTipo] = useState<"profissional" | "responsavel">(defaultTipo);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) router.push("/app"); }, [router, user]);
  useEffect(() => { setMode(defaultMode); setTipo(defaultTipo); }, [defaultMode, defaultTipo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pwd,
          options: { emailRedirectTo: `${window.location.origin}/app`, data: { nome: nome.trim(), tipo } },
        });
        if (error) throw error;
        toast.success("Conta criada!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pwd });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
      router.push("/app");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/auth?mode=login"><Logo /></Link>
        <Link href="/escolha" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary-soft">
          Criar conta
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-10 pt-2 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="card-soft gradient-hero p-7 sm:p-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Cuidado conectado
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Conectando profissionais e famílias para <span className="text-primary">acompanhar cada evolução</span>.
            </h1>
            <p className="mt-3 text-sm text-foreground/80 sm:text-base">O TEAmo une rotina familiar e acompanhamento clínico em um único lugar.</p>
            <div className="mt-4 rounded-xl bg-white/70 p-3 text-xs text-foreground/70">
              <strong>Demo:</strong> profissional@demo.com / responsavel@demo.com — senha <code>demo123</code>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[{ icon: UserPlus, title: "Cadastro", text: "Crie sua conta como profissional ou responsável." }, { icon: ClipboardList, title: "Registro diário", text: "A família registra sono, humor e comportamento." }, { icon: LineChart, title: "Acompanhamento", text: "O profissional acompanha e gera relatórios." }].map((s) => {
              const I = s.icon;
              return <div key={s.title} className="card-soft p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><I className="h-5 w-5" /></div><h3 className="mt-2 font-bold">{s.title}</h3><p className="text-sm text-muted-foreground">{s.text}</p></div>;
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[{ icon: CalendarCheck, title: "Organização de atendimentos", text: "Sessões, datas e objetivos organizados." }, { icon: MessagesSquare, title: "Comunicação família ↔ profissional", text: "Rotina em tempo real para a equipe." }, { icon: FileText, title: "Relatórios automáticos", text: "Indicadores com base nos registros." }, { icon: Users, title: "Para profissionais e responsáveis", text: "Fluxos pensados para os dois perfis." }].map((b) => {
              const I = b.icon;
              return <div key={b.title} className="card-soft p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-mint-foreground"><I className="h-5 w-5" /></div><h3 className="mt-2 font-bold">{b.title}</h3><p className="text-sm text-muted-foreground">{b.text}</p></div>;
            })}
          </div>

          <div className="card-soft gradient-soft flex items-start gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
            <div><h3 className="font-bold">Pronto para começar</h3><p className="text-sm text-muted-foreground">Crie sua conta e registre o primeiro dia em poucos minutos.</p></div>
          </div>
        </div>

        <div className="lg:sticky lg:top-5 lg:self-start">
          <div className="card-soft p-6">
            <div className="mb-5 flex rounded-xl bg-muted p-1">
              <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === "login" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Entrar</button>
              <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === "signup" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Criar conta</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && <>
                <div>
                  <Label className="mb-2 block">Tipo de conta</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setTipo("profissional")} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-medium ${tipo === "profissional" ? "border-primary bg-primary-soft text-primary" : "border-border"}`}><Stethoscope className="h-5 w-5" /> Profissional</button>
                    <button type="button" onClick={() => setTipo("responsavel")} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-medium ${tipo === "responsavel" ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}><Heart className="h-5 w-5" /> Responsável</button>
                  </div>
                </div>
                <div><Label htmlFor="nome">Seu nome</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} /></div>
              </>}
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="pwd">Senha</Label><Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required minLength={6} /></div>
              <Button type="submit" disabled={busy} className="h-12 w-full text-base">{busy ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
              <Link href={mode === "login" ? "/escolha" : "/auth?mode=login"} className="font-semibold text-primary">
                {mode === "login" ? "Criar conta" : "Entrar"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthPageContent />
    </Suspense>
  );
}
