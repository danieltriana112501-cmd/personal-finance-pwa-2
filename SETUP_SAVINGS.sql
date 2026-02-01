-- 1. Crear tabla de Metas de Ahorro
create table public.savings_goals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Desactivar seguridad
alter table public.savings_goals disable row level security;

-- 3. Insertar ejemplos
insert into public.savings_goals (name, target_amount, current_amount, target_date) values
  ('Fondo de Emergencia', 5000000, 1200000, '2026-12-31'),
  ('Viaje a Santa Marta', 3000000, 500000, '2026-06-30');
