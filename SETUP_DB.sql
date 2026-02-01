-- 1. Crear tabla de Transacciones
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  category text not null,
  type text not null check (type in ('income', 'expense')),
  user_id uuid default auth.uid()
);

-- 2. Habilitar seguridad (RLS)
alter table public.transactions enable row level security;

-- 3. Permitir que cada usuario vea y cree SOLO sus datos
create policy "Users can view own transactions" 
on public.transactions for select 
using (auth.uid() = user_id);

create policy "Users can insert own transactions" 
on public.transactions for insert 
with check (auth.uid() = user_id);
