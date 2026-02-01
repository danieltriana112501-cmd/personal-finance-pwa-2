-- 1. Crear tabla de Presupuestos
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  category text not null unique,
  limit_amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Desactivar seguridad para uso personal simple
alter table public.budgets disable row level security;

-- 3. Insertar presupuestos por defecto (Puedes editarlos luego en Supabase)
insert into public.budgets (category, limit_amount) values
  ('food', 800000),
  ('transport', 400000),
  ('shopping', 200000),
  ('bills', 350000),
  ('coffee', 150000),
  ('other', 100000);
