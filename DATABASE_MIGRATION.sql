-- Script SQL para adicionar as novas funcionalidades ao TEAmo
-- Execute isso no Supabase SQL Editor (https://supabase.com/dashboard/project/[seu-projeto]/sql)

-- 1. Adicionar colunas à tabela profiles (foto, bio, especialidade)
ALTER TABLE profiles 
ADD COLUMN avatar_url TEXT DEFAULT NULL,
ADD COLUMN bio TEXT DEFAULT NULL CHECK (LENGTH(bio) <= 300),
ADD COLUMN especialidade TEXT DEFAULT NULL;

-- 2. Criar tabela de feedback para avaliações do TEAmo
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar índices para melhor performance
CREATE INDEX idx_feedback_profissional_id ON feedback(profissional_id);

-- 4. Criar storage bucket para avatares (se não existir)
-- Isso precisa ser feito via dashboard do Supabase:
-- - Vá para Storage
-- - Clique em "Create a new bucket"
-- - Nome: "profiles"
-- - Public: SIM

-- 5. Atualizar RLS policies se necessário
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profissionais podem inserir seus próprios feedbacks"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = profissional_id);

CREATE POLICY "Profissionais podem ler seus próprios feedbacks"
  ON feedback FOR SELECT
  USING (auth.uid() = profissional_id);
