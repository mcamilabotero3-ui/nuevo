-- Ejecuta esto en Supabase: panel del proyecto → SQL Editor → New query → pega y corre.

create table if not exists dashboard_data (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table dashboard_data enable row level security;

-- Permite leer y escribir con la clave pública (anon).
-- Esto es equivalente al nivel de seguridad que ya tenías compartiendo
-- el artifact en Claude: cualquiera con el enlace de la app puede editar.
-- Si en el futuro necesitas login y permisos por persona, aquí es donde
-- se reemplazaría esta política por una basada en auth.uid().
create policy "permitir lectura anon" on dashboard_data
  for select using (true);

create policy "permitir escritura anon" on dashboard_data
  for insert with check (true);

create policy "permitir actualizacion anon" on dashboard_data
  for update using (true);
