"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Heart } from "lucide-react";
import { Logo } from "@/src/components/teamo/Logo";
import { useAuth } from "@/src/hooks/use-auth";

export default function EscolhaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.push("/app");
  }, [loading, router, user]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <Link href="/auth?mode=login"><Logo /></Link>
      <div className="mt-10">
        <h1 className="text-3xl font-bold leading-tight">Como você vai usar o TEAmo?</h1>
        <p className="mt-2 text-muted-foreground">Escolha o tipo de conta para personalizar a experiência.</p>
      </div>
      <div className="mt-8 space-y-4">
        <button
          onClick={() => router.push("/auth?tipo=profissional&mode=signup")}
          className="card-soft flex w-full items-center gap-4 p-5 text-left transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <div className="text-lg font-bold">Sou profissional</div>
            <div className="text-sm text-muted-foreground">Terapeutas, psicólogos, fonoaudiólogos...</div>
          </div>
        </button>
        <button
          onClick={() => router.push("/auth?tipo=responsavel&mode=signup")}
          className="card-soft flex w-full items-center gap-4 p-5 text-left transition-all hover:border-accent hover:shadow-lg"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <div className="text-lg font-bold">Sou responsável</div>
            <div className="text-sm text-muted-foreground">Pais, mães, cuidadores...</div>
          </div>
        </button>
      </div>
      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/auth?mode=login" className="font-semibold text-primary">Entrar</Link>
      </p>
    </div>
  );
}
