-- Rôles applicatifs
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Profil visible par son proprietaire" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Profil modifiable par son proprietaire" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "Profil cree par son proprietaire" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Chacun voit ses roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Les administrateurs voient tous les roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Création automatique du profil + rôle utilisateur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nom, email)
  values (new.id, new.raw_user_meta_data ->> 'nom', new.email)
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Cantiques
create table public.cantiques (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  nom text not null,
  texte text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.cantiques to anon, authenticated;
grant insert, update, delete on public.cantiques to authenticated;
grant all on public.cantiques to service_role;
alter table public.cantiques enable row level security;
create policy "Cantiques visibles par tous" on public.cantiques
  for select to anon, authenticated using (true);
create policy "Seul administrateur ajoute" on public.cantiques
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Seul administrateur modifie" on public.cantiques
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Seul administrateur supprime" on public.cantiques
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger cantiques_touch_updated_at
  before update on public.cantiques
  for each row execute function public.touch_updated_at();

-- Version du recueil : l'administrateur publie une mise à jour
create table public.recueil_version (
  id integer primary key default 1,
  version integer not null default 1,
  note text,
  published_at timestamptz not null default now(),
  constraint recueil_version_single_row check (id = 1)
);
grant select on public.recueil_version to anon, authenticated;
grant update on public.recueil_version to authenticated;
grant all on public.recueil_version to service_role;
alter table public.recueil_version enable row level security;
create policy "Version visible par tous" on public.recueil_version
  for select to anon, authenticated using (true);
create policy "Seul administrateur publie une mise a jour" on public.recueil_version
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.recueil_version (id, version, note) values (1, 1, 'Version initiale');

INSERT INTO public.cantiques (numero, nom, texte) VALUES
  (1, 'Gloire à l''Agneau', '1. Gloire à l''Agneau qui fut immolé,
Lui seul est digne d''être exalté ;
Son sang précieux nous a rachetés,
Chantons sa grâce à l''éternité.

Refrain :
Gloire, gloire à l''Agneau de Dieu !
Son nom demeure au plus haut des cieux ;
Toute la terre entonne ce chant :
Digne est l''Agneau, le Roi triomphant !

2. Il a porté nos iniquités,
Sur cette croix il fut méprisé ;
Mais le matin du troisième jour,
Il s''est levé, vainqueur par amour.

3. Bientôt viendra l''appel du réveil,
Les rachetés monteront au ciel ;
Alors nos voix, sans fin, sans détour,
Loueront l''Agneau, notre seul secours.'),
  (2, 'Espérance vivante', '1. Dans la nuit de ce monde obscur,
Brille une lumière si pure ;
Christ est l''espérance vivante,
Sa promesse est douce et constante.

Refrain :
Espérance, ô ferme espérance,
Ancre de l''âme en la souffrance ;
Quand tout vacille autour de moi,
Je reste debout par la foi.

2. Les tempêtes peuvent gronder,
Mon Rocher ne peut s''ébranler ;
Sa Parole est mon fondement,
Elle demeure éternellement.'),
  (3, 'Conduis-moi, Berger fidèle', '1. Conduis-moi, Berger fidèle,
Par les sentiers du désert ;
Ta houlette me rappelle
Que ton cœur m''est grand ouvert.

Refrain :
Conduis-moi, conduis-moi,
Jour après jour, garde ma foi ;
Dans les vallées comme aux sommets,
Je marcherai, tu me connais.

2. Près des eaux tranquilles,
Tu restaures mon âme lassée ;
Même à l''ombre de la mort,
Ta présence est ma paix gardée.'),
  (4, 'Viens, Esprit de Dieu', '1. Viens, Esprit de Dieu, descends,
Souffle sur ce cœur brûlant ;
Remplis-nous de ta puissance,
Renouvelle notre alliance.

Refrain :
Viens, ô Esprit, viens embraser
L''autel que nous venons dresser ;
Que ta flamme jamais ne meure
Dans nos vies, à toute heure.

2. Sans toi nos chants sont sans voix,
Sans toi nos pas sont sans foi ;
Mais ton onction nous relève,
Et notre louange s''élève.'),
  (5, 'Le Tabernacle de l''Espérance', '1. Peuple élu, marche en avant,
Le Seigneur va devant ;
Sous la nuée le jour, la nuit,
Sa colonne de feu nous conduit.

Refrain :
Tabernacle, maison de sa gloire,
Lieu de louange et de victoire ;
Ici nous chantons d''un seul cœur :
Éternel, tu es le vainqueur !

2. Que nos familles soient bénies,
Que nos enfants servent le Christ ;
Que dans ce lieu de sainteté,
Règne à jamais sa vérité.'),
  (6, 'Quel ami fidèle est Jésus', '1. Quel ami fidèle et tendre
Nous avons en Jésus-Christ !
Toujours prêt à nous entendre,
À répondre à notre cri.

Refrain :
Il connaît nos défaillances,
Nos chutes et nos douleurs ;
Apportons-lui nos souffrances,
Il est l''ami des pécheurs.

2. Quand la route est difficile,
Quand nos forces s''en vont,
Sa main puissante et tranquille
Nous relève et nous répond.'),
  (7, 'Jour de joie éternelle', '1. Un jour viendra, jour sans nuage,
Où nous verrons notre Sauveur ;
Plus de sanglots, plus de naufrage,
Plus de douleur, plus de labeur.

Refrain :
Ô jour de joie éternelle,
Jour où l''Époux paraîtra !
L''Épouse enfin, pure et fidèle,
Dans sa gloire il l''emmènera.

2. Tenons ferme jusqu''à l''aurore,
Gardons la lampe allumée ;
Car celui qui vient bientôt encore
Récompense la fidélité.')
ON CONFLICT (numero) DO NOTHING;