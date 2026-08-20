-- Local development seed data only.
-- Creates deterministic Auth users A/B plus demo categories, budgets, and transactions.
-- Do not use this seed against a hosted/production Supabase project.

create extension if not exists pgcrypto with schema extensions;

-- Deterministic local-only users
-- User A: alice@example.com / password123
-- User B: bob@example.com / password123
-- UUIDs are fixed so RLS verification and app fixtures stay reproducible.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'alice@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Alice","last_name":"Demo"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'bob@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Bob","last_name":"Demo"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    format(
      '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
      '11111111-1111-1111-1111-111111111111',
      'alice@example.com'
    )::jsonb,
    'email',
    '11111111-1111-1111-1111-111111111111',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    format(
      '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
      '22222222-2222-2222-2222-222222222222',
      'bob@example.com'
    )::jsonb,
    'email',
    '22222222-2222-2222-2222-222222222222',
    now(),
    now(),
    now()
  );

-- Profiles are created automatically by private.handle_new_user().

-- ---------------------------------------------------------------------------
-- User A demo data
-- ---------------------------------------------------------------------------

insert into public.categories (id, user_id, name, color)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Salary', '#22c55e'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', 'Groceries', '#ef4444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', 'Transport', '#3b82f6'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111111', 'Utilities', '#f59e0b'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111111', 'Entertainment', '#a855f7');

insert into public.budgets (id, user_id, category_id, amount, month, year)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 400.00, 8, 2026),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 150.00, 8, 2026),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 200.00, 8, 2026),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 120.00, 8, 2026);

insert into public.transactions (
  id,
  user_id,
  category_id,
  title,
  amount,
  type,
  transaction_date,
  note
)
values
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'August salary',
    3200.00,
    'income',
    '2026-08-01',
    'Monthly salary deposit'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Weekly groceries',
    86.40,
    'expense',
    '2026-08-03',
    null
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc3',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'Bus pass',
    45.00,
    'expense',
    '2026-08-05',
    'Monthly pass'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc4',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    'Electricity bill',
    78.25,
    'expense',
    '2026-08-07',
    null
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc5',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5',
    'Cinema tickets',
    24.00,
    'expense',
    '2026-08-09',
    'Weekend movie'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc6',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Market vegetables',
    32.10,
    'expense',
    '2026-08-10',
    null
  );

-- ---------------------------------------------------------------------------
-- User B demo data (for RLS isolation checks)
-- ---------------------------------------------------------------------------

insert into public.categories (id, user_id, name, color)
values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '22222222-2222-2222-2222-222222222222', 'Freelance', '#14b8a6'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', '22222222-2222-2222-2222-222222222222', 'Rent', '#f97316'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', '22222222-2222-2222-2222-222222222222', 'Dining', '#e11d48');

insert into public.budgets (id, user_id, category_id, amount, month, year)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 800.00, 8, 2026),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 250.00, 8, 2026);

insert into public.transactions (
  id,
  user_id,
  category_id,
  title,
  amount,
  type,
  transaction_date,
  note
)
values
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff1',
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'Client invoice',
    1500.00,
    'income',
    '2026-08-02',
    'Project payment'
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff2',
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'August rent',
    800.00,
    'expense',
    '2026-08-01',
    null
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff3',
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    'Dinner out',
    42.50,
    'expense',
    '2026-08-08',
    null
  );

-- ---------------------------------------------------------------------------
-- User C demo data (Luka)
-- User C: luka.vukoja1991@gmail.com / password123
-- NOTE: `pnpm db:reset` recreates this auth user with the fixed UUID below.
-- If you registered manually with a different UUID, reset replaces that account.
-- ---------------------------------------------------------------------------

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'luka.vukoja1991@gmail.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Luka","last_name":"Vukoja"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    format(
      '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
      '33333333-3333-3333-3333-333333333333',
      'luka.vukoja1991@gmail.com'
    )::jsonb,
    'email',
    '33333333-3333-3333-3333-333333333333',
    now(),
    now(),
    now()
  );

-- Profile is created automatically by private.handle_new_user().

insert into public.categories (id, user_id, name, color)
values
  ('33333333-3333-3333-3333-c00000000001', '33333333-3333-3333-3333-333333333333', 'Plaća', '#22c55e'),
  ('33333333-3333-3333-3333-c00000000002', '33333333-3333-3333-3333-333333333333', 'Freelance', '#14b8a6'),
  ('33333333-3333-3333-3333-c00000000003', '33333333-3333-3333-3333-333333333333', 'Namirnice', '#ef4444'),
  ('33333333-3333-3333-3333-c00000000004', '33333333-3333-3333-3333-333333333333', 'Prijevoz', '#3b82f6'),
  ('33333333-3333-3333-3333-c00000000005', '33333333-3333-3333-3333-333333333333', 'Režije', '#f59e0b'),
  ('33333333-3333-3333-3333-c00000000006', '33333333-3333-3333-3333-333333333333', 'Zabava', '#a855f7'),
  ('33333333-3333-3333-3333-c00000000007', '33333333-3333-3333-3333-333333333333', 'Restorani', '#e11d48');

insert into public.budgets (id, user_id, category_id, amount, month, year)
select
  format(
    '33333333-3333-3333-3333-%s',
    lpad((100000 + month_offset * 5 + category_idx)::text, 12, '0')
  )::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  category_id,
  budget_amount,
  extract(month from month_start)::smallint,
  extract(year from month_start)::smallint
from (
  select
    month_offset,
    (date '2026-03-01' + (month_offset * interval '1 month'))::date as month_start,
    category_idx,
    category_id,
    case
      when category_idx = 1 and month_offset = 5 then 80.00
      when category_idx = 1 then 350.00
      when category_idx = 2 then 120.00
      when category_idx = 3 then 180.00
      when category_idx = 4 then 100.00
      else 150.00
    end as budget_amount
  from generate_series(0, 5) as month_offset
  cross join (
    values
      (1, '33333333-3333-3333-3333-c00000000003'::uuid),
      (2, '33333333-3333-3333-3333-c00000000004'::uuid),
      (3, '33333333-3333-3333-3333-c00000000005'::uuid),
      (4, '33333333-3333-3333-3333-c00000000006'::uuid),
      (5, '33333333-3333-3333-3333-c00000000007'::uuid)
  ) as expense_categories(category_idx, category_id)
) as budget_rows;

insert into public.transactions (
  id,
  user_id,
  category_id,
  title,
  amount,
  type,
  transaction_date,
  note
)
select
  format(
    '33333333-3333-3333-3333-%s',
    lpad((200000 + month_offset * 20 + income_idx)::text, 12, '0')
  )::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  case
    when income_idx = 1 then '33333333-3333-3333-3333-c00000000001'::uuid
    else '33333333-3333-3333-3333-c00000000002'::uuid
  end,
  case
    when income_idx = 1 then 'Plaća ' || to_char(month_start, 'TMMonth YYYY')
    else 'Freelance projekt #' || income_idx
  end,
  case
    when income_idx = 1 then 3000.00 + (month_offset * 50.00)
    else 80.00 + (((income_idx * 37) + (month_offset * 10)) % 370)
  end,
  'income',
  month_start + (least(1 + ((income_idx - 1) * 2), last_day) - 1),
  case when income_idx = 1 then 'Mjesečna plaća' else null end
from (
  select
    month_offset,
    (date '2026-03-01' + (month_offset * interval '1 month'))::date as month_start,
    extract(
      day from (
        date_trunc('month', date '2026-03-01' + (month_offset * interval '1 month'))
        + interval '1 month - 1 day'
      )
    )::integer as last_day,
    income_idx
  from generate_series(0, 5) as month_offset
  cross join generate_series(1, 10) as income_idx
) as income_rows;

insert into public.transactions (
  id,
  user_id,
  category_id,
  title,
  amount,
  type,
  transaction_date,
  note
)
select
  format(
    '33333333-3333-3333-3333-%s',
    lpad((300000 + month_offset * 20 + expense_idx)::text, 12, '0')
  )::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  case (expense_idx - 1) % 5
    when 0 then '33333333-3333-3333-3333-c00000000003'::uuid
    when 1 then '33333333-3333-3333-3333-c00000000004'::uuid
    when 2 then '33333333-3333-3333-3333-c00000000005'::uuid
    when 3 then '33333333-3333-3333-3333-c00000000006'::uuid
    else '33333333-3333-3333-3333-c00000000007'::uuid
  end,
  case (expense_idx - 1) % 5
    when 0 then 'Namirnice'
    when 1 then 'Prijevoz'
    when 2 then 'Režije'
    when 3 then 'Zabava'
    else 'Restorani'
  end || ' #' || expense_idx,
  15.00 + (((expense_idx * 23) + (month_offset * 15)) % 205),
  'expense',
  month_start + (least(2 + ((expense_idx - 1) * 2), last_day) - 1),
  null
from (
  select
    month_offset,
    (date '2026-03-01' + (month_offset * interval '1 month'))::date as month_start,
    extract(
      day from (
        date_trunc('month', date '2026-03-01' + (month_offset * interval '1 month'))
        + interval '1 month - 1 day'
      )
    )::integer as last_day,
    expense_idx
  from generate_series(0, 5) as month_offset
  cross join generate_series(1, 10) as expense_idx
) as expense_rows;
