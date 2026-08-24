-- Reproducible RLS verification for local development seed users.
-- User A: 11111111-1111-1111-1111-111111111111 (alice@example.com)
-- User B: 22222222-2222-2222-2222-222222222222 (bob@example.com)
--
-- Run with: npx supabase test db

begin;

create schema if not exists tests;

create or replace function tests.authenticate_as(p_user_id uuid)
returns void
language plpgsql
as $$
begin
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config(
    'request.jwt.claims',
    json_build_object(
      'sub', p_user_id::text,
      'role', 'authenticated',
      'aud', 'authenticated'
    )::text,
    true
  );
end;
$$;

select plan(27);

-- ---------------------------------------------------------------------------
-- User A positive cases
-- ---------------------------------------------------------------------------

select tests.authenticate_as('11111111-1111-1111-1111-111111111111'::uuid);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'User A can read own profile'
);

select is(
  (select count(*)::integer from public.categories),
  5,
  'User A can read own categories'
);

select is(
  (select count(*)::integer from public.transactions),
  6,
  'User A can read own transactions'
);

select is(
  (select count(*)::integer from public.budgets),
  4,
  'User A can read own budgets'
);

select lives_ok(
  $$
    insert into public.categories (id, user_id, name, color)
    values (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10',
      '11111111-1111-1111-1111-111111111111',
      'Temp A Category',
      '#111111'
    )
  $$,
  'User A can create own category'
);

select lives_ok(
  $$
    update public.categories
    set color = '#222222'
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10'
  $$,
  'User A can update own category'
);

select lives_ok(
  $$
    insert into public.transactions (
      id,
      user_id,
      category_id,
      title,
      amount,
      type,
      transaction_date
    )
    values (
      'cccccccc-cccc-cccc-cccc-cccccccccc10',
      '11111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
      'Temp A expense',
      10.00,
      'expense',
      current_date
    )
  $$,
  'User A can create own transaction with own category'
);

select lives_ok(
  $$
    update public.transactions
    set amount = 11.00
    where id = 'cccccccc-cccc-cccc-cccc-cccccccccc10'
  $$,
  'User A can update own transaction'
);

select throws_ok(
  $$
    update public.transactions
    set category_id = 'dddddddd-dddd-dddd-dddd-ddddddddddd2'
    where id = 'cccccccc-cccc-cccc-cccc-ccccccccccc2'
  $$,
  '42501',
  'new row violates row-level security policy for table "transactions"',
  'User A cannot update own transaction to User B category'
);

select throws_ok(
  $$
    update public.transactions
    set user_id = '22222222-2222-2222-2222-222222222222'
    where id = 'cccccccc-cccc-cccc-cccc-ccccccccccc2'
  $$,
  '42501',
  'new row violates row-level security policy for table "transactions"',
  'User A cannot reassign own transaction to another user'
);

select lives_ok(
  $$
    insert into public.budgets (
      id,
      user_id,
      category_id,
      amount,
      month,
      year
    )
    values (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10',
      '11111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10',
      50.00,
      8,
      2026
    )
  $$,
  'User A can create own budget with own category'
);

select lives_ok(
  $$
    update public.budgets
    set amount = 55.00
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10'
  $$,
  'User A can update own budget'
);

select lives_ok(
  $$
    delete from public.budgets
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10'
  $$,
  'User A can delete own budget'
);

select lives_ok(
  $$
    delete from public.transactions
    where id = 'cccccccc-cccc-cccc-cccc-cccccccccc10'
  $$,
  'User A can delete own transaction'
);

select lives_ok(
  $$
    delete from public.categories
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10'
  $$,
  'User A can delete own unused category'
);

-- ---------------------------------------------------------------------------
-- User A negative cases against User B data
-- ---------------------------------------------------------------------------

select is(
  (
    select count(*)::integer
    from public.profiles
    where id = '22222222-2222-2222-2222-222222222222'
  ),
  0,
  'User A cannot read User B profile'
);

select is(
  (
    select count(*)::integer
    from public.categories
    where user_id = '22222222-2222-2222-2222-222222222222'
  ),
  0,
  'User A cannot read User B categories'
);

select is(
  (
    select count(*)::integer
    from public.transactions
    where user_id = '22222222-2222-2222-2222-222222222222'
  ),
  0,
  'User A cannot read User B transactions'
);

select is(
  (
    select count(*)::integer
    from public.budgets
    where user_id = '22222222-2222-2222-2222-222222222222'
  ),
  0,
  'User A cannot read User B budgets'
);

select is_empty(
  $$
    update public.transactions
    set amount = 999.99
    where id = 'ffffffff-ffff-ffff-ffff-fffffffffff1'
    returning id
  $$,
  'User A cannot update User B transactions'
);

select is_empty(
  $$
    delete from public.budgets
    where id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1'
    returning id
  $$,
  'User A cannot delete User B budgets'
);

select throws_ok(
  $$
    insert into public.transactions (
      id,
      user_id,
      category_id,
      title,
      amount,
      type,
      transaction_date
    )
    values (
      'cccccccc-cccc-cccc-cccc-cccccccccc99',
      '11111111-1111-1111-1111-111111111111',
      'dddddddd-dddd-dddd-dddd-ddddddddddd2',
      'Cross-user category attempt',
      1.00,
      'expense',
      current_date
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "transactions"',
  'User A cannot attach User B category to User A transaction'
);

select throws_ok(
  $$
    insert into public.transactions (
      id,
      user_id,
      category_id,
      title,
      amount,
      type,
      transaction_date
    )
    values (
      'cccccccc-cccc-cccc-cccc-cccccccccc98',
      '22222222-2222-2222-2222-222222222222',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
      'Forged user_id attempt',
      1.00,
      'expense',
      current_date
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "transactions"',
  'User A cannot create transaction with forged user_id even with own category'
);

select throws_ok(
  $$
    insert into public.budgets (
      id,
      user_id,
      category_id,
      amount,
      month,
      year
    )
    values (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb99',
      '11111111-1111-1111-1111-111111111111',
      'dddddddd-dddd-dddd-dddd-ddddddddddd3',
      10.00,
      8,
      2026
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "budgets"',
  'User A cannot attach User B category to User A budget'
);

-- ---------------------------------------------------------------------------
-- User B inverse isolation
-- ---------------------------------------------------------------------------

reset role;

select tests.authenticate_as('22222222-2222-2222-2222-222222222222'::uuid);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'User B can read own profile'
);

select is(
  (
    select count(*)::integer
    from public.categories
    where user_id = '11111111-1111-1111-1111-111111111111'
  ),
  0,
  'User B cannot read User A categories'
);

select throws_ok(
  $$
    insert into public.transactions (
      id,
      user_id,
      category_id,
      title,
      amount,
      type,
      transaction_date
    )
    values (
      'ffffffff-ffff-ffff-ffff-ffffffffff99',
      '22222222-2222-2222-2222-222222222222',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
      'Cross-user category attempt',
      1.00,
      'expense',
      current_date
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "transactions"',
  'User B cannot attach User A category to User B transaction'
);

reset role;

select * from finish();

rollback;
