-- 1. Agregar columna user_id (NULLABLE inicialmente para evitar errores)
alter table public.budgets 
add column if not exists user_id uuid null;

alter table public.savings_goals 
add column if not exists user_id uuid null;

-- 2. Asignar los datos existentes al primer usuario encontrado (TÚ)
-- Esto asume que tú eres el único usuario registrado por ahora.
do $$
declare
  first_user_id uuid;
begin
  select id into first_user_id from auth.users limit 1;
  
  if first_user_id is not null then
    update public.budgets set user_id = first_user_id where user_id is null;
    update public.savings_goals set user_id = first_user_id where user_id is null;
  end if;
end $$;

-- 3. Ahora hacer la columna obligatoria (NOT NULL) y default al usuario actual
alter table public.budgets 
alter column user_id set default auth.uid(),
alter column user_id set not null;

alter table public.savings_goals 
alter column user_id set default auth.uid(),
alter column user_id set not null;

-- 4. Habilitar RLS
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;

-- 5. Crear Políticas (Policies)

-- BUDGETS
drop policy if exists "Users can view own budgets" on public.budgets;
create policy "Users can view own budgets" on public.budgets for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own budgets" on public.budgets;
create policy "Users can insert own budgets" on public.budgets for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own budgets" on public.budgets;
create policy "Users can update own budgets" on public.budgets for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own budgets" on public.budgets;
create policy "Users can delete own budgets" on public.budgets for delete using (auth.uid() = user_id);

-- SAVINGS
drop policy if exists "Users can view own savings" on public.savings_goals;
create policy "Users can view own savings" on public.savings_goals for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own savings" on public.savings_goals;
create policy "Users can insert own savings" on public.savings_goals for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own savings" on public.savings_goals;
create policy "Users can update own savings" on public.savings_goals for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own savings" on public.savings_goals;
create policy "Users can delete own savings" on public.savings_goals for delete using (auth.uid() = user_id);
