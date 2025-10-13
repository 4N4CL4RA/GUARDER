-- Script para criar a tabela de reviews no Supabase

-- Criar tabela de reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  user TEXT NOT NULL,
  avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  location TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  helpful INTEGER DEFAULT 0,
  hasUserLiked BOOLEAN DEFAULT false,
  hasUserDisliked BOOLEAN DEFAULT false,
  replies JSONB DEFAULT '[]',
  verified BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general',
  coordinates JSONB,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reviews_location ON public.reviews(location);
CREATE INDEX IF NOT EXISTS idx_reviews_category ON public.reviews(category);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON public.reviews(date);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura por todos
CREATE POLICY "Allow public read access" ON public.reviews
FOR SELECT USING (true);

-- Política para permitir inserção por usuários autenticados
CREATE POLICY "Allow authenticated insert" ON public.reviews
FOR INSERT WITH CHECK (true);

-- Política para permitir atualização pelo próprio usuário
CREATE POLICY "Allow user update own reviews" ON public.reviews
FOR UPDATE USING (true);