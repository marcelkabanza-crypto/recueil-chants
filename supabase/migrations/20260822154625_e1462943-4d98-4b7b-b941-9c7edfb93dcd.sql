GRANT SELECT ON public.cantiques TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cantiques TO authenticated;
GRANT ALL ON public.cantiques TO service_role;
GRANT SELECT ON public.recueil_version TO anon;
GRANT SELECT, INSERT, UPDATE ON public.recueil_version TO authenticated;
GRANT ALL ON public.recueil_version TO service_role;