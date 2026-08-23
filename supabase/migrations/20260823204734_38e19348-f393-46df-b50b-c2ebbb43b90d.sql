ALTER TABLE public.cantiques ADD COLUMN IF NOT EXISTS langue text NOT NULL DEFAULT 'fr';
ALTER TABLE public.cantiques DROP CONSTRAINT IF EXISTS cantiques_numero_key;
CREATE UNIQUE INDEX IF NOT EXISTS cantiques_langue_numero_idx ON public.cantiques (langue, numero);