GRANT SELECT ON TABLE public.cantiques TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cantiques TO authenticated;
GRANT ALL ON TABLE public.cantiques TO service_role;

GRANT SELECT ON TABLE public.recueil_version TO anon;
GRANT SELECT, UPDATE ON TABLE public.recueil_version TO authenticated;
GRANT ALL ON TABLE public.recueil_version TO service_role;