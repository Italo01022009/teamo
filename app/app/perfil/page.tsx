"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Stethoscope, Heart, Camera, Send } from "lucide-react";
import Image from "next/image";

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: "profissional" | "responsavel";
  avatar_url: string | null;
  bio: string | null;
  especialidade: string | null;
}

export default function PerfilPage() {
  const { profile: authProfile, refreshProfile, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);

  useEffect(() => {
    if (!authProfile) return;
    loadProfile();
  }, [authProfile]);

  const loadProfile = async () => {
    if (!authProfile) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authProfile.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setNome(data.nome);
      setEmail(data.email);
      setEspecialidade(data.especialidade || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      
      // Atualizar no banco
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;
      toast.success("Foto atualizada!");
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const save = async () => {
    if (!profile) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nome: nome.trim(),
          especialidade: especialidade.trim(),
          bio: bio.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      await refreshProfile();
      await loadProfile();
      setIsEditing(false);
      toast.success("Perfil atualizado!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const sendFeedback = async () => {
    if (!feedbackText.trim() || !profile) return;
    setSendingFeedback(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({
          profissional_id: profile.id,
          conteudo: feedbackText.trim(),
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      setFeedbackText("");
      toast.success("Obrigado pela avaliação!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSendingFeedback(false);
    }
  };

  if (!profile || !authProfile) return null;

  return (
    <div className="space-y-5">
      {/* Header - Visualização Pública */}
      <div className="card-soft gradient-soft space-y-4 p-5">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            {avatarUrl ? (
              <div className="relative h-24 w-24">
                <Image
                  src={avatarUrl}
                  alt={nome}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card text-primary shadow-md">
                {authProfile.tipo === "profissional" ? (
                  <Stethoscope className="h-10 w-10" />
                ) : (
                  <Heart className="h-10 w-10" />
                )}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {authProfile.tipo === "profissional" ? "Profissional" : "Responsável"}
          </p>
          <h1 className="text-2xl font-bold">{nome}</h1>
          {especialidade && (
            <p className="text-sm text-muted-foreground">{especialidade}</p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="text-sm text-muted-foreground">{bio}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {bio.length}/300
            </p>
          </div>
        )}
      </div>

      {/* Formulário de Edição */}
      <div className="card-soft space-y-4 p-5">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Editar Perfil
          </Button>
        ) : (
          <>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>

            {authProfile.tipo === "profissional" && (
              <div>
                <Label htmlFor="especialidade">
                  Especialidade / Formação
                </Label>
                <Input
                  id="especialidade"
                  placeholder="Ex: Psicóloga especializada em TEA"
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="bio">
                Bio ({bio.length}/300)
              </Label>
              <Textarea
                id="bio"
                placeholder="Fale um pouco sobre você..."
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                className="min-h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={save}
                disabled={busy}
                className="flex-1"
              >
                {busy ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Avalie o TEAmo */}
      {authProfile.tipo === "profissional" && (
        <div className="card-soft space-y-3 border-l-4 border-primary bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-semibold">Avalie o TEAmo</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Conversa rápida com nosso assistente IA — leva 1 minuto.
          </p>
          {feedbackText ? (
            <>
              <Textarea
                placeholder="Sua avaliação..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-20"
              />
              <Button
                onClick={sendFeedback}
                disabled={sendingFeedback || !feedbackText.trim()}
                className="w-full"
              >
                {sendingFeedback ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar Avaliação
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setFeedbackText(" ")}
              className="w-full"
            >
              Começar Avaliação
            </Button>
          )}
        </div>
      )}

      {/* Sair */}
      <Button
        variant="outline"
        onClick={signOut}
        className="w-full text-destructive"
      >
        Sair da conta
      </Button>
    </div>
  );
}
