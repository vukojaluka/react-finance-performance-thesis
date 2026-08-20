-- Idempotent live seed for luka.vukoja1991@gmail.com (existing auth user).
-- Does not recreate the auth user. Safe to re-run.

do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where email = 'luka.vukoja1991@gmail.com';

  if target_user_id is null then
    raise exception 'User luka.vukoja1991@gmail.com not found in auth.users';
  end if;

  delete from public.transactions where user_id = target_user_id;
  delete from public.budgets where user_id = target_user_id;
  delete from public.categories where user_id = target_user_id;

  insert into public.categories (id, user_id, name, color)
  values
    ('33333333-3333-3333-3333-c00000000001', target_user_id, 'Plaća', '#22c55e'),
    ('33333333-3333-3333-3333-c00000000002', target_user_id, 'Freelance', '#14b8a6'),
    ('33333333-3333-3333-3333-c00000000003', target_user_id, 'Namirnice', '#ef4444'),
    ('33333333-3333-3333-3333-c00000000004', target_user_id, 'Prijevoz', '#3b82f6'),
    ('33333333-3333-3333-3333-c00000000005', target_user_id, 'Režije', '#f59e0b'),
    ('33333333-3333-3333-3333-c00000000006', target_user_id, 'Zabava', '#a855f7'),
    ('33333333-3333-3333-3333-c00000000007', target_user_id, 'Restorani', '#e11d48');

  insert into public.budgets (id, user_id, category_id, amount, month, year)
  select
    format(
      '33333333-3333-3333-3333-%s',
      lpad((100000 + month_offset * 5 + category_idx)::text, 12, '0')
    )::uuid,
    target_user_id,
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
    target_user_id,
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
    target_user_id,
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
end;
$$;
