-- Initial application schema for the finance performance thesis project.
-- Source of truth: docs/architecture.md (sections 7 and 8).

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

-- ---------------------------------------------------------------------------
-- Custom types
-- ---------------------------------------------------------------------------

create type public.transaction_type as enum ('income', 'expense');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  color text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_user_id_name_key unique (user_id, name)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete no action,
  title text not null,
  amount numeric(12, 2) not null,
  type public.transaction_type not null,
  transaction_date date not null default current_date,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete no action,
  amount numeric(12, 2) not null,
  month smallint not null,
  year smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_user_id_category_id_month_year_key unique (user_id, category_id, month, year),
  constraint budgets_month_range_check check (month >= 1 and month <= 12),
  constraint budgets_year_positive_check check (year > 0)
);

-- ---------------------------------------------------------------------------
-- Indexes (documented in architecture.md)
-- ---------------------------------------------------------------------------

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_category_id_idx on public.transactions (category_id);
create index transactions_transaction_date_idx on public.transactions (transaction_date);
create index transactions_user_id_transaction_date_idx on public.transactions (user_id, transaction_date);

create index categories_user_id_idx on public.categories (user_id);

create index budgets_user_id_idx on public.budgets (user_id);
create index budgets_category_id_idx on public.budgets (category_id);
create index budgets_month_year_idx on public.budgets (month, year);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function private.set_updated_at();

create trigger transactions_set_updated_at
before update on public.transactions
for each row
execute function private.set_updated_at();

create trigger budgets_set_updated_at
before update on public.budgets
for each row
execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profile bootstrap on auth.users insert
-- ---------------------------------------------------------------------------

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'first_name', ''), 'User'),
    coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), 'Account')
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;
revoke all on function private.set_updated_at() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Privileges (explicit Data API grants; no anon access to user data)
-- ---------------------------------------------------------------------------

revoke all on table public.profiles from anon, authenticated, public;
revoke all on table public.categories from anon, authenticated, public;
revoke all on table public.transactions from anon, authenticated, public;
revoke all on table public.budgets from anon, authenticated, public;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.categories to authenticated;
grant select, insert, update, delete on table public.transactions to authenticated;
grant select, insert, update, delete on table public.budgets to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.categories to service_role;
grant select, insert, update, delete on table public.transactions to service_role;
grant select, insert, update, delete on table public.budgets to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- profiles
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using ((select auth.uid()) = id);

-- categories
create policy "categories_select_own"
on public.categories
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "categories_update_own"
on public.categories
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- transactions
create policy "transactions_select_own"
on public.transactions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "transactions_insert_own"
on public.transactions
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.categories as categories
    where categories.id = category_id
      and categories.user_id = (select auth.uid())
  )
);

create policy "transactions_update_own"
on public.transactions
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.categories as categories
    where categories.id = category_id
      and categories.user_id = (select auth.uid())
  )
);

create policy "transactions_delete_own"
on public.transactions
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- budgets
create policy "budgets_select_own"
on public.budgets
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "budgets_insert_own"
on public.budgets
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.categories as categories
    where categories.id = category_id
      and categories.user_id = (select auth.uid())
  )
);

create policy "budgets_update_own"
on public.budgets
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.categories as categories
    where categories.id = category_id
      and categories.user_id = (select auth.uid())
  )
);

create policy "budgets_delete_own"
on public.budgets
for delete
to authenticated
using ((select auth.uid()) = user_id);
