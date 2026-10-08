# React Finance Performance Thesis

## 1. Project Overview

### Problem Statement

MyFinance is a personal finance web application. Authenticated users record income and expense transactions, classify them with categories, set monthly category budgets, and view an aggregated dashboard.

The thesis uses this application to study TanStack Start rendering and data-fetching architecture: route loaders, TanStack Query, critical versus non-critical queries, Suspense, and SSR.

### Target Users

Individual authenticated users managing their own financial records. There is no multi-tenant organization model, no admin role, and no sharing of data between users.

### Project Scope

The implemented MVP includes:

- Email/password authentication (Supabase Auth)
- Protected application shell with sidebar navigation
- Dashboard (summary, monthly trend, recent transactions, current-month budgets)
- Transactions CRUD with URL-driven search, filters, sorting, and pagination
- Categories CRUD with URL-driven search and pagination
- Budgets CRUD with URL-driven month/year period navigation and spending progress
- PostgreSQL schema with Row Level Security (RLS)
- Local Supabase development (CLI, Docker, migrations, seed, RLS tests)

### Out of Scope

- Analytics (no route or feature module)
- Settings / profile management UI (no route or feature module)
- Multi-user households, teams, or roles beyond guest vs authenticated user
- Mobile native applications
- A public REST API for third-party clients

---

## 2. Thesis Goal

### Primary Goal

Evaluate how TanStack Start, TanStack Router, and TanStack Query can be combined so that a server-rendered React application loads critical content first and reveals independent widgets progressively, without blocking the initial render on secondary data.

### Secondary Goals

- Keep server authorization and database authorization explicit (`requireAuthMiddleware` and PostgreSQL RLS).
- Use URL search params as the source of truth for shareable list and period state.
- Keep Server Functions as the only application data boundary (no direct Supabase access from feature UI).

### Expected Outcomes

- A working personal-finance MVP that demonstrates the chosen architecture.
- Experiment 001 as an isolated comparison of loader strategies; measured results live in `docs/experiments.md`, not as production performance claims in this document.
- This document as the technical source of truth for the current implementation.

---

## 3. Application Overview

### Application Description

MyFinance is a Croatian-language (`lang="hr"`) TanStack Start application. Money is formatted as BAM. The UI is built with React 19, shadcn/ui, Tailwind CSS, and Sonner toasts.

### Core Modules

| Module | Status |
| ------ | ------ |
| Authentication | Implemented |
| Dashboard | Implemented |
| Transactions | Implemented (full CRUD) |
| Categories | Implemented (full CRUD) |
| Budgets | Implemented (full CRUD) |
| Analytics | Not implemented. |
| Settings | Not implemented. |
| Experiment 001 | Implemented as an isolated route at `/experiments/experiment-001`; not part of the product navigation |

### User Journey

1. Guest opens `/`, then `/register` or `/login`.
2. After authentication, the app clears the Query Cache, loads `currentUserQuery()`, invalidates the router, and navigates to `/dashboard` (or a sanitized `redirect` after login).
3. The user manages transactions, categories, and budgets from the protected sidebar.
4. Logout clears the Query Cache, invalidates the router, and returns to `/login`.

### Application Flow

#### Guest Flow

```text
/  →  /login | /register
```

Already-authenticated users hitting `/login` or `/register` are redirected away (login uses the sanitized `redirect` search param; register uses `/dashboard`).

#### Authenticated User Flow

```text
/dashboard
/transactions  →  /transactions/new  |  /transactions/$transactionId/edit
/categories    →  /categories/new    |  /categories/$categoryId/edit
/budgets       →  /budgets/new       |  /budgets/$budgetId/edit
```

Unauthenticated access to `_protected` routes redirects to `/login` with `redirect` set to the attempted location.

---

## 4. Functional Requirements

| ID | Requirement | Priority | Status |
| --- | ----------- | -------- | ------ |
| FR-01 | Register, log in, and log out with Supabase Auth | Must | Implemented |
| FR-02 | Protect application routes with `beforeLoad` | Must | Implemented |
| FR-03 | Dashboard summary, trend, recent transactions, and current-month budgets | Must | Implemented |
| FR-04 | Transactions list with search, filters, sort, pagination | Must | Implemented |
| FR-05 | Create, edit, and delete transactions | Must | Implemented |
| FR-06 | Categories list with search and pagination | Must | Implemented |
| FR-07 | Create, edit, and delete categories | Must | Implemented |
| FR-08 | Budgets period view with overall and per-category progress | Must | Implemented |
| FR-09 | Create, edit, and delete budgets | Must | Implemented |
| FR-10 | Isolate user data with RLS and server-derived identity | Must | Implemented |
| FR-11 | Analytics views | Could | Not implemented. |
| FR-12 | Settings / profile management | Could | Not implemented. |

---

## 5. Non-functional Requirements

| ID | Requirement | Description |
| --- | ----------- | ----------- |
| NFR-01 | SSR | TanStack Start server-renders routes; Query Cache is dehydrated/hydrated via `@tanstack/react-router-ssr-query`. |
| NFR-02 | Authn/Authz | Session from Supabase cookies; route guards for UX; `requireAuthMiddleware` for protected Server Functions; RLS at the database. |
| NFR-03 | Isolation | Users cannot read or write another user's rows. Enforced by RLS and `user_id` filters in Server Functions. |
| NFR-04 | Validation | Zod on search params, forms, and Server Function inputs. |
| NFR-05 | URL state | List filters and budget period live in the URL. |
| NFR-06 | Cache safety | Login, register (authenticated path), and logout call `clearUserQueryCache()` so cached data does not leak across accounts. |
| NFR-07 | Localization | UI copy is Croatian; root document uses `lang="hr"`. |
| NFR-08 | Accessibility | Form fields use shared ARIA helpers; icon-only row actions and progress bars expose labels where implemented. |

---

## 6. User Roles

### Guest

Permissions

- View `/`, `/login`, `/register`
- Call public auth Server Functions: `login`, `register`, `getCurrentUser`, `logout`
- Cannot access `_protected` routes or protected domain Server Functions

### Authenticated User

Permissions

- Access `/dashboard`, `/transactions/*`, `/categories/*`, `/budgets/*`
- CRUD own transactions, categories, and budgets
- Cannot access another user's rows (RLS + server-derived `user.id`)

There is no separate administrator role in the application.

---

## 7. Domain Model

### Profile

#### Purpose

Represents an authenticated user of the application. Stores profile information that is not managed by Supabase Authentication.

A row is created automatically by `private.handle_new_user()` when a row is inserted into `auth.users` (first/last name from auth metadata, with fallbacks).

#### Responsibilities

- Store personal information (`first_name`, `last_name`)
- Own all application data
- Personalize the user experience

#### Relationships

- One Profile has many Transactions
- One Profile has many Categories
- One Profile has many Budgets

The application does not currently expose a Settings UI to edit the profile.

---

### Transaction

#### Purpose

Represents a single financial record created by the user. A transaction can be either an income or an expense.

#### Responsibilities

- Store financial transactions
- Associate transactions with categories
- Provide data for dashboard statistics and budget spending (expenses only)

#### Relationships

- Belongs to one Profile
- Belongs to one Category

---

### Category

#### Purpose

Represents a user-defined classification used to organize financial transactions.

#### Responsibilities

- Organize transactions
- Group income and expense records
- Define visualization color
- Associate monthly budgets with transactions

#### Relationships

- Belongs to one Profile
- Has many Transactions
- Has many Budgets

---

### Budget

#### Purpose

Represents a monthly spending limit for a specific transaction category.

#### Responsibilities

- Store monthly budget values
- Compare planned and actual expense spending
- Provide budget progress information
- Support dashboard visualizations

#### Relationships

- Belongs to one Profile
- Belongs to one Category

## 8. Database Design

The application uses PostgreSQL as the primary relational database through Supabase. The schema is defined in `supabase/migrations/20260812111903_initial_schema.sql`. It is normalized for personal finance management and supports dashboard and budget aggregation queries.

---

### PostgreSQL Custom Types

#### transaction_type

```text
income
expense
```

---

### Profiles

#### Purpose

Stores additional user information that is not managed by Supabase Authentication.

#### Columns

| Column     | Type        | Nullable | Default | Description              |
| ---------- | ----------- | -------- | ------- | ------------------------ |
| id         | UUID        | No       | -       | References auth.users.id |
| first_name | TEXT        | No       | -       | User first name          |
| last_name  | TEXT        | No       | -       | User last name           |
| created_at | TIMESTAMPTZ | No       | NOW()   | Creation timestamp       |
| updated_at | TIMESTAMPTZ | No       | NOW()   | Last update timestamp    |

#### Constraints

- Primary Key (`id`)
- Foreign Key → `auth.users(id)` `ON DELETE CASCADE`

#### Relationships

- One Profile has many Transactions
- One Profile has many Categories
- One Profile has many Budgets

#### Indexes

- Primary Key (`id`)

---

### Transactions

#### Purpose

Stores all financial records created by users.

#### Columns

| Column           | Type             | Nullable | Default           | Description            |
| ---------------- | ---------------- | -------- | ----------------- | ---------------------- |
| id               | UUID             | No       | gen_random_uuid() | Transaction identifier |
| user_id          | UUID             | No       | -                 | Profile owner          |
| category_id      | UUID             | No       | -                 | Transaction category   |
| title            | TEXT             | No       | -                 | Transaction title      |
| amount           | NUMERIC(12,2)    | No       | -                 | Transaction amount     |
| type             | transaction_type | No       | -                 | Income or expense      |
| transaction_date | DATE             | No       | CURRENT_DATE      | Transaction date       |
| note             | TEXT             | Yes      | NULL              | Optional note          |
| created_at       | TIMESTAMPTZ      | No       | NOW()             | Creation timestamp     |
| updated_at       | TIMESTAMPTZ      | No       | NOW()             | Last update timestamp  |

#### Constraints

- Primary Key (`id`)
- Foreign Key → `profiles(id)` `ON DELETE CASCADE`
- Foreign Key → `categories(id)` `ON DELETE NO ACTION`

#### Relationships

- Many Transactions belong to one Profile
- Many Transactions belong to one Category

#### Indexes

- Primary Key (`id`)
- `INDEX(user_id)`
- `INDEX(category_id)`
- `INDEX(transaction_date)`
- Composite `INDEX(user_id, transaction_date)`

---

### Categories

#### Purpose

Stores user-defined transaction categories.

#### Columns

| Column     | Type        | Nullable | Default           | Description                        |
| ---------- | ----------- | -------- | ----------------- | ---------------------------------- |
| id         | UUID        | No       | gen_random_uuid() | Category identifier                |
| user_id    | UUID        | No       | -                 | Profile owner                      |
| name       | TEXT        | No       | -                 | Category name                      |
| color      | TEXT        | No       | -                 | Color used in charts and dashboard |
| created_at | TIMESTAMPTZ | No       | NOW()             | Creation timestamp                 |
| updated_at | TIMESTAMPTZ | No       | NOW()             | Last update timestamp              |

#### Constraints

- Primary Key (`id`)
- Foreign Key → `profiles(id)` `ON DELETE CASCADE`
- `UNIQUE(user_id, name)`

#### Relationships

- One Category has many Transactions
- One Category has many Budgets

#### Indexes

- Primary Key (`id`)
- `INDEX(user_id)`
- Unique index from `UNIQUE(user_id, name)`

---

### Budgets

#### Purpose

Stores monthly spending limits for transaction categories.

#### Columns

| Column      | Type          | Nullable | Default           | Description           |
| ----------- | ------------- | -------- | ----------------- | --------------------- |
| id          | UUID          | No       | gen_random_uuid() | Budget identifier     |
| user_id     | UUID          | No       | -                 | Profile owner         |
| category_id | UUID          | No       | -                 | Budget category       |
| amount      | NUMERIC(12,2) | No       | -                 | Budget amount         |
| month       | SMALLINT      | No       | -                 | Month (1-12)          |
| year        | SMALLINT      | No       | -                 | Year                  |
| created_at  | TIMESTAMPTZ   | No       | NOW()             | Creation timestamp    |
| updated_at  | TIMESTAMPTZ   | No       | NOW()             | Last update timestamp |

#### Constraints

- Primary Key (`id`)
- Foreign Key → `profiles(id)` `ON DELETE CASCADE`
- Foreign Key → `categories(id)` `ON DELETE NO ACTION`
- `UNIQUE(user_id, category_id, month, year)`
- `CHECK (month >= 1 AND month <= 12)`
- `CHECK (year > 0)`

#### Relationships

- Many Budgets belong to one Profile
- Many Budgets belong to one Category

#### Indexes

- Primary Key (`id`)
- `INDEX(user_id)`
- `INDEX(category_id)`
- Composite `INDEX(month, year)`
- Unique index from `UNIQUE(user_id, category_id, month, year)`

---

### Database Constraints

#### Foreign Keys

- `profiles.id` → `auth.users.id` `ON DELETE CASCADE`
- `transactions.user_id` → `profiles.id` `ON DELETE CASCADE`
- `transactions.category_id` → `categories.id` `ON DELETE NO ACTION`
- `categories.user_id` → `profiles.id` `ON DELETE CASCADE`
- `budgets.user_id` → `profiles.id` `ON DELETE CASCADE`
- `budgets.category_id` → `categories.id` `ON DELETE NO ACTION`

#### Unique Constraints

- `UNIQUE(user_id, name)` on `categories`
- `UNIQUE(user_id, category_id, month, year)` on `budgets`

#### Delete behavior

- Deleting a profile (and the linked `auth.users` row) cascades to owned categories, transactions, and budgets.
- Deleting a category is blocked while transactions or budgets still reference it (`ON DELETE NO ACTION`, PostgreSQL error `23503`). The application maps this to a Croatian domain error and does not cascade-delete dependent records.

---

### Automatic Timestamps

All tables include `created_at` and `updated_at` columns.

- `created_at` uses `DEFAULT NOW()`
- `updated_at` uses `DEFAULT NOW()`
- `updated_at` is maintained by trigger `private.set_updated_at()` on `profiles`, `categories`, `transactions`, and `budgets`

---

### Row Level Security (RLS)

RLS is enabled on `profiles`, `categories`, `transactions`, and `budgets` in the initial migration.

Policies enforce ownership at the database level:

- Authenticated users can select, insert, update, and delete only rows where `user_id` (or `id` for `profiles`) matches `auth.uid()`.
- Transaction and budget **insert/update** policies additionally require that the referenced `category_id` belongs to the same authenticated user.

`anon` is granted no table privileges on application tables. `authenticated` and `service_role` receive CRUD grants. Application Server Functions use the Supabase publishable key via `createSupabaseServerClient()`. The service-role key is not used by those handlers and is not exposed to browser code.

Route guards and Server Function authentication are separate from RLS. PostgreSQL policies remain the database authorization boundary even if application code misroutes a request.

RLS is covered by `supabase/tests/rls_verification_test.sql` (`pnpm db:test`).

---

### Seed Data

Local development seed (`supabase/seed.sql`, loaded on `supabase db reset`) provides:

- Deterministic demo auth users
- Default transaction categories
- Demo budgets
- Demo transactions

Seed data is for local development, manual testing, dashboard verification, and later measurements. It is not a production dataset. This document does not record seed credentials.

Do not run the local seed against a hosted/production Supabase project.

---

### Entity Relationship Diagram (ERD)

```text
                auth.users
                     │
                     │
                     ▼
                 profiles
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
    categories   transactions  budgets
          ▲            │          │
          └────────────┴──────────┘
```

## Authentication Architecture

Authentication is handled by Supabase Auth.

Supabase Auth is the source of truth for the authenticated user and session.

The application does not implement a custom authentication/session system.

### Authentication Flow

There are two related server-side flows.

**Route protection and current-user resolution:**

```text
Supabase Auth (session cookies)
      ↓
createSupabaseServerClient()
      ↓
getCurrentUser() Server Function
      ↓
currentUserQuery()  ['auth', 'current-user']
      ↓
TanStack Router beforeLoad
      ↓
_public / _protected layouts
```

**Protected domain Server Functions:**

```text
createSupabaseServerClient()
      ↓
requireAuthMiddleware
      ↓
auth.getUser()
      ↓
throw if missing or invalid session
      ↓
next({ context: { user, supabase } })
      ↓
Server Function handler
```

`getCurrentUser()` uses the Supabase server client and `auth.getUser()`. It does **not** use `requireAuthMiddleware`. Unauthenticated callers receive `{ isLoggedIn: false, user: null }` instead of a thrown error.

Safe user information returned to application code (`SafeUser`):

```ts
{
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
}
```

Authentication credentials, access tokens, refresh tokens, passwords, and service-role credentials are never exposed to client components.

Protected Server Functions do not repeat `auth.getUser()` in each handler. They read `user` and `supabase` from middleware `context`.

Public auth Server Functions remain public: `login`, `register`, `logout`, `getCurrentUser`.

User identity for writes is derived server-side from the session (`context.user.id`). Client-provided `user_id` is not trusted.

### Route Protection

Authentication-based route protection uses TanStack Router pathless layouts.

```text
_public/
├── index (landing `/`)
├── login (`/login`)
└── register (`/register`)

_protected/
├── dashboard (`/dashboard`)
├── transactions (`/transactions`)
├── transactions/new (`/transactions/new`)
├── transactions/$transactionId/edit (`/transactions/$transactionId/edit`)
├── categories (`/categories`)
├── categories/new (`/categories/new`)
├── categories/$categoryId/edit (`/categories/$categoryId/edit`)
├── budgets (`/budgets`)
├── budgets/new (`/budgets/new`)
└── budgets/$budgetId/edit (`/budgets/$budgetId/edit`)
```

The `_protected` layout performs the authentication check in `beforeLoad` using `currentUserQuery()` / `getCurrentUser()`.

Unauthenticated users are redirected to `/login` with `search.redirect` set to the attempted `location.href` (sanitized on the login route).

Authenticated users can access the protected application routes. The protected layout also sets `robots: noindex, nofollow`.

Login and register redirect already-authenticated users away from `/login` and `/register`. Register redirects to `/dashboard`. Login redirects to the sanitized `redirect` search param or `/dashboard`.

The authentication guard is a routing and user-experience mechanism. It is not a database security boundary.

### Authorization and RLS

Database authorization is enforced independently through PostgreSQL RLS.

The security model is:

```text
Client
  ↓
TanStack Query
  ↓
Server Function
  ↓
requireAuthMiddleware (protected operations)
  ↓
Supabase Server Client
  ↓
PostgreSQL RLS (auth.uid())
```

Route guards prevent unauthenticated users from entering protected application routes.

RLS prevents authenticated users from accessing or modifying data belonging to other users.

Application security does not depend on the TanStack Router guard alone.

### Current User

The authenticated user is exposed through `getCurrentUser()` and cached client-side via `currentUserQuery()` (`['auth', 'current-user']`).

TanStack Query is not the authentication authority.

Supabase Auth remains the source of truth for authentication state.

The application does not use React Context, Zustand, or another global client-side authentication store.

After login, successful authenticated registration, and logout, `clearUserQueryCache()` cancels in-flight queries and `queryClient.clear()` so the next user does not see the previous user's cached server state. Login/register then `fetchQuery(currentUserQuery())` and `router.invalidate()`.

### Authentication Routes

```text
/
/login
/register
```

Authentication Server Functions:

```text
login
register
logout
getCurrentUser
```

Login and register forms call `useServerFn(...)` from TanStack Form `onSubmit` (not `useMutation`). Logout uses `useMutation` because it is a button action without a form.

### Development Environment

Authentication is developed against the local Supabase environment provided by the Supabase CLI and Docker.

Local email confirmation is disabled (`enable_confirmations = false` in `supabase/config.toml`), so registration can create an authenticated session directly.

Mailpit is available for local email-related testing.

Local and production Supabase are separate projects. Production Auth settings are not defined in this repository's local config.

### Security Principles

- Supabase Auth is the authentication authority.
- Protected Server Functions authenticate through `requireAuthMiddleware`, which calls `auth.getUser()` once and provides `user` and `supabase` via handler `context`.
- Route guards are implemented through TanStack Router `beforeLoad`.
- Database authorization is enforced through PostgreSQL RLS.
- Feature UI does not call Supabase for domain data. A browser client helper exists at `src/integrations/supabase/client.ts` but is unused by feature code; privileged operations go through Server Functions.
- Service-role/secret keys are never exposed to browser code.
- Passwords and authentication tokens are never logged or returned to client code.
- Authentication state is not duplicated into a custom global client store.
- Query Cache is cleared on account switch (login / authenticated register / logout).

## 9. Application Pages

Implemented product routes:

**Public**

```text
/
/login
/register
```

**Protected**

```text
/dashboard
/transactions
/transactions/new
/transactions/$transactionId/edit
/categories
/categories/new
/categories/$categoryId/edit
/budgets
/budgets/new
/budgets/$budgetId/edit
```

Analytics and Settings are not implemented (no routes).

Experiment 001 is available at `/experiments/experiment-001` and is not part of the product sidebar.

---

### Landing

Purpose

Public entry page describing the product and linking to register/login. Unauthenticated visitors land here; authenticated users still reach `/dashboard` via post-auth redirects and protected routes (this page does not run an auth query).

Main Features

- Header with brand and calls to action
- Headline and short value proposition
- Feature overview (dashboard indicators and monthly trend, transactions, categories, budgets, RLS)
- Brief note that the app is part of a master's thesis on data-loading performance
- Footer
- Links to `/register` and `/login`

Rendering Strategy

- Static SSR of the landing component
- No data loader

Performance Notes

No server queries. No images or animation.

---

### Login

Purpose

Authenticate an existing user.

Main Features

- Email/password form (TanStack Form + Zod `loginSchema`)
- Inline form error (`role="alert"`)
- Link to register
- `redirect` search param (sanitized)

Rendering Strategy

- `beforeLoad` fetches `currentUserQuery()` and redirects if already logged in
- Submit calls `login` Server Function, then clears Query Cache, fetches current user, invalidates the router, and navigates

Performance Notes

No dashboard-style critical/non-critical split.

---

### Register

Purpose

Create an account.

Main Features

- First name, last name, email, password, confirm password (Zod `registerSchema`)
- Two success paths from `register`: `authenticated` (session created) or `confirmation_required` (inline status message, then login)
- Inline errors and optional success status

Rendering Strategy

- `beforeLoad` redirects authenticated users to `/dashboard`
- Authenticated register follows the same cache-clear + `currentUserQuery` + `router.invalidate` + navigate path as login

Performance Notes

No dashboard-style critical/non-critical split.

---

### Dashboard

Purpose

Authenticated home page showing financial overview widgets.

Main Features

- Summary cards: total income, total expenses, all-time balance, current-month balance
- Monthly income/expense trend chart (last six months)
- Recent transactions (five newest)
- Current-month budget progress (mapped from `getBudgets({ month, year })`)

Rendering Strategy

This is the Experiment 001 critical/non-critical pattern applied to the product dashboard. Other pages do not use this split.

- Critical: `dashboardSummaryQuery()` via `ensureQueryData()` in the route loader
- Non-critical: `monthlyTrendQuery()`, `recentTransactionsQuery()`, and dashboard `budgetsQuery()` started with `prefetchQuery()` without awaiting
- Summary widget consumes the query with `useQuery()` (pending skeleton and inline error)
- Non-critical widgets use independent `Suspense` + `useSuspenseQuery()`, each wrapped in `QueryErrorResetBoundary` + `CatchBoundary` with `DashboardWidgetError`

Performance Notes

Follows the critical/non-critical loader pattern selected from Experiment 001. Measured experiment results belong in `docs/experiments.md`.

---

### Transactions

Purpose

Full CRUD management of user financial records.

Main Features

- List with server-side search, category filter, type filter, sorting, and pagination (page size 20)
- URL-driven list state (`transactionFiltersSchema`)
- `"Sve"` / `"Svi"` map to omitted/`undefined` filters
- Changing category, type, search, sort, or sort direction resets `page` to 1; page-only navigation preserves filters
- Desktop filters inline; mobile/tablet filter drawer (`Sheet`, `lg:hidden`)
- Reusable create/edit form (`TransactionForm` / `useTransactionForm`)
- Delete confirmation dialog, toasts, query invalidation
- Out-of-range `page` clamped in `getTransactions()`; loader redirects when `result.page !== search.page`
- Delete last-item-on-page: refetch then navigate to last valid page if needed

Routes:

```text
/transactions
/transactions/new
/transactions/$transactionId/edit
```

Rendering Strategy

- List loader awaits `transactionsQuery(search)` and `categoryOptionsQuery()` in parallel, then may redirect to canonicalize `page`
- List uses `useQuery()` + `keepPreviousData` for filter transitions
- Create loader awaits `categoryOptionsQuery()`
- Edit loader awaits `transactionQuery(transactionId)` and `categoryOptionsQuery()`; defines `pendingComponent` and `notFoundComponent`

Performance Notes

This is a filter-driven list page, not the dashboard prefetch/Suspense split.

---

### Analytics

Not implemented. No route or feature module exists.

---

### Categories

Purpose

Full CRUD management of user-defined transaction categories.

Main Features

- List with server-side name search and pagination (page size 10)
- URL-driven `search` and `page` (`categorySearchSchema`)
- Changing search resets `page` to 1; page-only navigation preserves search; default `page=1` is stripped from the URL
- Create and edit forms with Zod (`name`, hex `color`)
- Duplicate name mapped from unique constraint (`23505`)
- Delete blocked while transactions or budgets reference the category (`23503`)
- Confirmation dialog, toasts, prefix invalidation of `['categories']`
- Category edit also invalidates `['transactions']`, `['dashboard']`, and `['budgets']` so joined names/colors stay consistent
- Out-of-range page clamp + loader redirect; delete last-item-on-page navigation

There is no category type filter and no category sort control.

Routes:

```text
/categories
/categories/new
/categories/$categoryId/edit
```

Rendering Strategy

- List loader awaits `categoriesQuery(search)` and redirects if the server clamped `page`
- List uses `useQuery()` + `keepPreviousData`
- Edit loader awaits `categoryQuery(categoryId)`; `pendingComponent` and `notFoundComponent`
- Transaction and budget forms use `categoryOptionsQuery()` (full ordered list), not the paginated list query

Performance Notes

Filter-driven list page. Options query is a separate cache entry under `['categories', 'options']`.

---

### Budgets

Purpose

Visualization-oriented monthly budget management. Not a paginated table.

Main Features

- URL-driven `month` / `year` (defaults to current period; defaults stripped from the URL)
- Previous/next month navigation with year rollover
- Overall monthly summary (total budget, spent, remaining, percentage)
- Per-category progress cards; expense-only spending for the selected month
- Over-budget: remaining can be negative; UI clamps the progress bar at 100% and highlights overflow
- Create/edit/delete; one budget per user/category/month/year (`23505` mapped to a domain error)
- Occupied categories excluded on create (availability hook)
- Year select includes the URL year when it falls outside the default nearby-year window
- Confirmation dialog, toasts; mutations invalidate `['budgets']` and `['dashboard']`

There is no budget list pagination.

Routes:

```text
/budgets
/budgets/new
/budgets/$budgetId/edit
```

Rendering Strategy

- List route validates `budgetSearchSchema`, `ensureQueryData(budgetsQuery({ month, year }))`
- List uses `useQuery()` + `keepPreviousData` during period changes
- Create loader awaits `categoryOptionsQuery()` and `budgetsQuery(search)`
- Edit loader awaits `budgetQuery(budgetId)` and `categoryOptionsQuery()`; `pendingComponent` and `notFoundComponent`
- Dashboard widget reuses `getBudgets()` for the current month and maps the overview into `DashboardBudget[]` under `['dashboard', 'budgets']`

Performance Notes

`getBudgets({ month, year })` loads budgets plus expense rows for the month (paged at 1000 on the server) and aggregates spending by category. Transaction collections are not sent to the browser.

---

### Settings

Not implemented. No route or feature module exists.

---

## 10. Features

### Authentication

Description

Supabase Auth with `_public` and `_protected` pathless layouts, `currentUserQuery()` / `getCurrentUser()`, `requireAuthMiddleware` on protected Server Functions, and Query Cache clearing on login/register/logout.

Business Value

Secure access to personal financial data without a custom session system.

Thesis Value

Server-side auth integration with TanStack Start Server Functions and TanStack Router route guards.

Priority

Implemented.

---

### Dashboard

Description

Read-only dashboard aggregating summary metrics, monthly trend, recent transactions, and budget progress.

Business Value

At-a-glance financial overview after login.

Thesis Value

Critical vs non-critical data loading, Suspense boundaries, and progressive widget rendering.

Priority

Implemented.

---

### Transactions

Description

Complete CRUD: URL-driven filters/pagination/sorting/search, create, edit, delete, form validation, and cache invalidation (including budgets, because expenses affect spending).

Business Value

Core personal finance record management.

Thesis Value

URL-as-state, server-side list queries, TanStack Form mutations, and targeted query invalidation.

Priority

Implemented.

---

### Analytics

Description

Not implemented.

Business Value

Not implemented.

Thesis Value

Not implemented.

Priority

Not started.

---

### Categories

Description

Complete CRUD: URL-driven name search and server-side pagination, create, edit, delete, form validation, and cache invalidation. `categoryOptionsQuery()` / `getCategoryOptions()` is the full-list read path for transaction and budget forms and filters.

Business Value

Users manage their own classification labels and colors.

Thesis Value

A simpler CRUD variant than Transactions (search + pagination, no type/sort filters) with a split between paginated management and options-for-forms.

Priority

Implemented.

---

### Budgets

Description

Complete CRUD: URL-driven `month`/`year` navigation, overall monthly summary, per-category progress, create, edit, delete, form validation, and cache invalidation. Dashboard widget reuses the same budget read model for the current month.

Business Value

Users set monthly spending limits per category and track expense progress.

Thesis Value

Period-as-URL-state, server-side spending aggregation, visualization-first UI (not table CRUD), and a shared read model between dashboard and management pages.

Priority

Implemented.

---

### Settings

Description

Not implemented.

Business Value

Not implemented.

Thesis Value

Not implemented.

Priority

Not started.

---

## 11. API Design

### API Architecture

The application does not expose a traditional REST API to the client.

TanStack Start Server Functions are the server-side API boundary.

Read path:

```text
Client Component / Route Loader
↓
TanStack Query
↓
queryOptions()
↓
Server Function
↓
Supabase / PostgreSQL
```

Mutation path (entity CRUD):

```text
TanStack Form
↓
Zod
↓
TanStack Query Mutation
↓
Server Function
↓
Database
↓
Query Invalidation
```

Login and register skip `useMutation` and call the Server Function from form `onSubmit`. Logout uses `useMutation` without a form.

Feature UI does not access Supabase for domain data.

Server Functions communicate with the database and enforce server-side authentication. Protected domain functions attach `requireAuthMiddleware`. Zod validates Server Function input at the server boundary. Handlers return application-level DTOs (for example `TransactionListItem`, `PaginatedCategories`, `BudgetOverview`) rather than raw Supabase result objects.

---

### Server Functions

Server Functions are organized by feature.

```text
features/
├── auth/
│   ├── middleware/
│   │   └── require-auth.middleware.ts
│   └── server/
│       ├── get-current-user.ts   # public
│       ├── login.ts              # public
│       ├── register.ts           # public
│       └── logout.ts             # public
├── categories/
│   └── server/
│       ├── get-categories.ts          # protected, paginated
│       ├── get-category-options.ts    # protected, full list
│       ├── get-category.ts            # protected
│       ├── create-category.ts         # protected
│       ├── update-category.ts         # protected
│       └── delete-category.ts         # protected
├── dashboard/
│   └── server/
│       ├── get-dashboard-summary.ts
│       ├── get-monthly-trend.ts
│       ├── get-recent-transactions.ts
│       └── get-budgets.ts             # DashboardBudget type only; no Server Function
├── budgets/
│   └── server/
│       ├── get-budgets.ts
│       ├── get-budget.ts
│       ├── create-budget.ts
│       ├── update-budget.ts
│       └── delete-budget.ts
└── transactions/
    └── server/
        ├── get-transactions.ts
        ├── get-transaction.ts
        ├── create-transaction.ts
        ├── update-transaction.ts
        └── delete-transaction.ts
```

Protected Server Functions attach `requireAuthMiddleware` before their handler. Public auth endpoints (`login`, `register`, `logout`, `getCurrentUser`) do not use it.

---

### Naming Conventions

Read operations use the `get` prefix.

Mutation operations use `create...`, `update...`, `delete...`.

The `fetch` prefix is not used for Server Function names. Internal helpers may use `fetch*` (for example `fetchTransactionsPage`).

There is no `upsertBudget` Server Function.

---

### Query Pattern

Read operations use TanStack Query.

Each feature defines reusable `queryOptions()` factories. The same options are reused by route loaders, `useQuery()`, `useSuspenseQuery()`, `prefetchQuery()`, and `ensureQueryData()`.

Default `staleTime` is 60 seconds (`src/integrations/tanstack-query/root-provider.tsx`).

---

### Mutation Pattern

Entity create/update/delete uses TanStack Query `useMutation` together with TanStack Form.

After success, only affected query key prefixes are invalidated. The application does not call `queryClient.clear()` after entity mutations. Cache clear is reserved for login / authenticated register / logout.

---

### Input Validation

User-provided input is validated with Zod.

Client-side validation provides immediate feedback through TanStack Form.

Server Functions do not trust client-side validation. They validate input at the server boundary (shape, required fields, allowed values, business rules). Authorization is middleware + RLS, not a client-supplied owner id.

---

### Authentication

Authentication is handled through Supabase Auth.

Server Functions determine the authenticated user from the server-side session.

Protected Server Functions use TanStack Start function middleware (`requireAuthMiddleware` in `features/auth/middleware/require-auth.middleware.ts`):

```text
createSupabaseServerClient()
↓
auth.getUser()
↓
throw if missing or invalid session
↓
next({ context: { user, supabase } })
```

Handlers read `user` and `supabase` from `context` instead of repeating the auth check.

Public auth Server Functions do not use this middleware:

- `login`, `register`, `logout`
- `getCurrentUser` (returns `{ isLoggedIn: false }` instead of throwing)

---

### Authorization

```text
Server Function
↓
requireAuthMiddleware (protected operations)
↓
Authenticated User + Supabase Server Client
↓
Row Level Security
↓
User-owned Data
```

Client-provided identifiers must never be trusted to determine ownership. Server Functions set `user_id` from `context.user.id`. RLS is defense in depth.

Route guards (`beforeLoad` on `_protected`) prevent unauthenticated navigation. They are not a substitute for RLS.

---

### Error Handling

Layered, not identical on every route.

**Zod / form validation**

- Route search params (transaction filters, category search, budget period, login `redirect`)
- TanStack Form + Zod for create/edit and auth forms
- Field-level errors via `FormField` and `getFormFieldAriaProps`

**Server / domain errors**

- Server Functions throw `Error` with Croatian messages (including mapped unique/FK codes)
- CRUD mutations surface errors through `onError` + Sonner
- Auth forms surface errors inline on the form

**Route error boundaries**

- `getRouteError()` distinguishes Zod validation vs global errors
- Transaction, category, and budget list/create/edit routes define `errorComponent`
- Edit routes for transaction, category, and budget define `notFoundComponent` and `pendingComponent`
- Dashboard has no route-level `errorComponent`; non-critical widgets use per-widget `CatchBoundary`; summary uses `useQuery` error UI
- `_protected` and root define simple `notFoundComponent`s

**Global toast feedback**

- Sonner `Toaster` in the root document (`position="top-right"`)

**Component-level query errors**

- Transaction, category, and budget lists handle `useQuery` errors inline in addition to route `errorComponent`

---

### Response Design

Server Functions return application-level typed data rather than raw Supabase responses.

Example list item (`TransactionListItem`):

```ts
{
  id,
  date,
  title,
  category,
  categoryColor,
  amount,
  type,
}
```

---

### Authentication API

- `getCurrentUser()` — public; `{ isLoggedIn: false }` when unauthenticated
- `login()` — public
- `register()` — public; `{ status: 'authenticated', user }` or `{ status: 'confirmation_required', email }`
- `logout()` — public

---

### Dashboard API

Dashboard Server Functions (all protected):

- `getDashboardSummary()` — all-time income/expense/balance plus current-month balance
- `getMonthlyTrend()` — last six months income/expense/balance points
- `getRecentTransactions()` — five most recent transactions with category name

There is **no** dashboard `getBudgets` Server Function. `src/features/dashboard/server/get-budgets.ts` exports the `DashboardBudget` DTO. `features/dashboard/queries/budgets.query.ts` calls `getBudgets` from the budgets feature for the current period and maps `overview.categories` into `DashboardBudget[]`.

Query keys:

```text
['dashboard', 'summary']
['dashboard', 'monthly-trend']
['dashboard', 'recent-transactions']
['dashboard', 'budgets']
```

Loader: non-awaited `prefetchQuery` for the three non-critical keys, then `ensureQueryData(dashboardSummaryQuery())`.

---

### Transactions API

All transaction Server Functions use `requireAuthMiddleware`. Inputs are validated with Zod.

- `getTransactions()` — paginated list; search (`ilike` on title), `category_id`, `type`, sort (`date` → `transaction_date`, `amount`, `description` → `title`), page size 20
- `getTransaction()` — single record for edit
- `createTransaction()`
- `updateTransaction()`
- `deleteTransaction()`

List URL params (`transactionFiltersSchema`):

- `page`, `category_id`, `type`, `search`, `sort`, `sortDirection`
- `"Sve"` / `"Svi"` / empty strings become `undefined` and are omitted from the URL (`stripSearchParams` plus preprocess)
- Changing category, type, search, sort, or sortDirection resets `page` to 1

Query keys:

```text
['transactions', filters]           // list; filters mirror URL search params
['transactions', 'detail', id]      // detail
```

Out-of-range pages: server returns the last valid page (or page 1 when total is 0). The list loader redirects when `result.page !== search.page`. Pagination UI uses `data.page`.

Create/update/delete invalidate:

```text
['transactions']
['dashboard']
['budgets']
```

Delete also `removeQueries` for the detail key, then refetches the current list query to adjust the page if needed.

---

### Categories API

All category Server Functions use `requireAuthMiddleware`.

- `getCategories()` — always paginated (`categorySearchSchema`: `page`, optional `search`); page size 10
- `getCategoryOptions()` — full ordered list (`id`, `name`, `color`) for selects/filters
- `getCategory()` — single record for edit
- `createCategory()`
- `updateCategory()`
- `deleteCategory()`

List URL params:

- `page`, `search`
- Changing search resets `page` to 1
- Default `page=1` omitted from the URL

Query keys:

```text
['categories', filters]             // paginated management list
['categories', 'options']           // full list for forms and transaction filters
['categories', 'detail', id]
```

Prefix `invalidateQueries({ queryKey: ['categories'] })` covers list, options, and detail.

Create/update invalidate `['categories']`. Update also invalidates `['transactions']`, `['dashboard']`, and `['budgets']`. Delete invalidates `['categories']`, removes the detail key, and may navigate to the last valid page.

Duplicate names: PostgreSQL `23505`. In-use delete: `23503`.

---

### Budgets API

All budget Server Functions use `requireAuthMiddleware`.

- `getBudgets({ month, year })` — `BudgetOverview` (summary + per-category progress). Expense-only aggregation for the month date range. Income excluded.
- `getBudget(budgetId)` — single budget for edit
- `createBudget()`
- `updateBudget()`
- `deleteBudget()` — deletes the budget row only; does not delete transactions

Query keys:

```text
['budgets', { month, year }]
['budgets', 'detail', budgetId]
['dashboard', 'budgets']            // dashboard mapping of the same getBudgets() read
```

Mutations invalidate `['budgets']` and `['dashboard']`. Delete also removes the detail key.

Duplicate `(user_id, category_id, month, year)` maps to a Croatian domain error (`23505`).

No pagination.

---

### Analytics API

Not implemented. No analytics Server Functions or routes exist.

---

### Query and Mutation Boundaries

#### Critical Server Data

Use `await queryClient.ensureQueryData(...)` when the route should not continue without that data (dashboard summary; transaction/category/budget list and form loaders).

#### Non-Critical Server Data

Used on the dashboard only: `void queryClient.prefetchQuery(...)` then `useSuspenseQuery()` inside widget Suspense boundaries.

#### User-Initiated Data

Filter, search, pagination, and period changes are URL-driven. Loaders re-run from `loaderDeps`. Components use `useQuery` + `keepPreviousData` so the previous page remains visible during the transition. These are not “client-only after hydration” queries; they are still prepared in the loader.

---

### API Design Principles

1. Server Functions are the server-side boundary.
2. Feature UI does not access Supabase for domain data.
3. Read operations use TanStack Query `queryOptions()` factories.
4. Entity mutations use TanStack Query mutations; auth login/register use form `onSubmit`.
5. Query options are reused across loaders and components.
6. Server Functions use typed inputs and outputs.
7. Client-side validation uses Zod; the server validates again.
8. Authentication is derived from the server-side session.
9. Authorization is `requireAuthMiddleware` plus RLS.
10. Server Functions return domain DTOs.
11. Only affected query prefixes are invalidated after entity mutations.
12. The dashboard uses a critical/non-critical loader split; list and form pages do not.

## 12. High-Level Architecture

### Application Layers

**Client**

React 19 UI, TanStack Router, TanStack Query, TanStack Form, shadcn/ui.

**Server**

TanStack Start Server Functions, `requireAuthMiddleware`, `createSupabaseServerClient()`.

**Database**

PostgreSQL (Supabase), RLS, migrations, seed, `pnpm db:test`.

**External Services**

Supabase Auth (local CLI stack in development).

### Project Conventions

#### Folder Structure

Feature-based architecture. Imports use `@/` (maps to `src/`).

```text
src/
├── components/
│   ├── layouts/protected/   # sidebar, nav, page wrapper
│   └── ui/                  # shadcn primitives, FormField, DatePicker, Sonner
├── experiments/
│   └── experiment-001/      # isolated experiment; not product features
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── queries/
│   │   ├── schemas/
│   │   └── server/
│   ├── budgets/
│   ├── categories/
│   ├── dashboard/
│   └── transactions/
├── integrations/
│   ├── supabase/
│   └── tanstack-query/
├── lib/                     # format-currency, format-date, form-errors, route-errors, search-params
├── routes/
│   ├── _public/
│   ├── _protected/
│   └── experiments/
├── router.tsx
└── styles.css
```

Each feature owns components, hooks, queries, schemas, server functions, and feature-specific lib helpers.

Shared architectural primitives:

- `FormField`, `form-field-error`, `lib/form-errors.ts`
- `DatePicker`
- `Toaster` (Sonner)
- `getRouteError()` (`lib/route-errors.ts`)
- Currency/date formatting (`lib/format-currency.ts`, `lib/format-date.ts`)
- Search-param empty-string helpers (`lib/search-params.ts`)
- `clearUserQueryCache()` (`integrations/tanstack-query/clear-user-cache.ts`)

Transaction/category/budget form fields stay in their features.

---

#### Naming Conventions

##### Server Functions

Verb-based names, for example `getDashboardSummary`, `getTransactions`, `createTransaction`, `getCategoryOptions`.

##### Query Options

Factories such as:

- `currentUserQuery()`
- `dashboardSummaryQuery()`, `monthlyTrendQuery()`, `recentTransactionsQuery()`
- dashboard `budgetsQuery()` (no period argument; key `['dashboard', 'budgets']`)
- `transactionsQuery(filters)`, `transactionQuery(id)`
- `categoriesQuery(filters)`, `categoryOptionsQuery()`, `categoryQuery(id)`
- `budgetsQuery(period)`, `budgetQuery(id)`

Dashboard and budgets both export `budgetsQuery`. They are different functions with different keys.

##### File Naming

Kebab-case: `dashboard-summary.query.ts`, `get-dashboard-summary.ts`, `create-transaction.ts`.

---

#### Project Principles

- Feature-first architecture
- Shared UI in `components/ui` (and protected layout under `components/layouts`)
- Business logic in the corresponding feature
- Shared utilities in `lib`
- One `queryOptions` factory per query
- One responsibility per file

### Data Flow

Read path:

```text
Route Loader / Component
  ↓
queryOptions() factory
  ↓
TanStack Query (ensureQueryData / prefetchQuery / useQuery / useSuspenseQuery)
  ↓
Server Function (+ requireAuthMiddleware for protected operations)
  ↓
Supabase Server Client
  ↓
PostgreSQL / RLS
```

Mutation path (entity CRUD):

```text
TanStack Form + Zod
  ↓
TanStack Query Mutation
  ↓
Server Function (+ requireAuthMiddleware)
  ↓
PostgreSQL / RLS
  ↓
Query invalidation (affected prefixes)
  ↓
UI (toast, navigation)
```

## 13. Rendering Strategy

### Rendering Model

The application uses TanStack Start with SSR. Routes and components participate in SSR and continue on the client after hydration.

There is no Next.js `"use client"` classification.

Rendering is determined by route requirements, data criticality, query loading strategy, Suspense, and file-based code splitting.

---

### SSR Pages

Landing, login, register, dashboard, and all transaction/category/budget routes are SSR-capable.

Route loaders prepare Query Cache entries. Critical data uses `ensureQueryData`.

---

### Client Pages

Routes are not exclusively server-rendered or exclusively client-rendered.

After hydration, the same React tree handles forms, filters, pagination, dialogs, drawers, and Query updates.

---

### Critical Data Rendering

Examples: authenticated session in `beforeLoad`, dashboard summary, initial list/detail queries for CRUD pages.

Awaited in the loader:

```ts
await queryClient.ensureQueryData(criticalQuery())
```

---

### Non-Critical Data Rendering

Used on the **dashboard** for trend, recent transactions, and budgets widgets:

```ts
void queryClient.prefetchQuery(nonCriticalQuery())
```

The loader does not await those promises. Widgets use `useSuspenseQuery` inside per-widget Suspense boundaries.

This strategy originates from Experiment 001. It is not applied to every page.

---

### Page-type rendering (do not conflate)

| Page type | Loader | Component consumption |
| --------- | ------ | --------------------- |
| Dashboard | Prefetch non-critical, await summary | Summary: `useQuery`. Widgets: `Suspense` + `useSuspenseQuery` + widget `CatchBoundary` |
| Filter-driven lists | Await list (and options where needed); maybe redirect | `useQuery` + `keepPreviousData`; inline error UI |
| CRUD forms | Await detail and/or `categoryOptionsQuery` | Form hooks; `useQuery` for options |

---

### Suspense Boundaries

Independent dashboard widgets use separate Suspense boundaries so a slow chart does not block recent transactions.

A single page-wide Suspense boundary is not used for those widgets.

The summary block is not behind Suspense; it uses `useQuery` after `ensureQueryData`.

---

### Streaming

Intended dashboard flow:

```text
Route Loader
    │
    ├── Start non-critical queries (prefetch, not awaited)
    │
    └── Await dashboardSummaryQuery
            │
            ▼
       Initial Render (summary via useQuery)
            │
            ├── Monthly Trend Suspense
            │
            ├── Recent Transactions Suspense
            │
            └── Budgets Suspense
                    │
                    ▼
             Progressive Reveal
```

Exact streaming/hydration behavior is delegated to TanStack Start and TanStack Query (`setupRouterSsrQueryIntegration` in `src/router.tsx`).

---

### Code Splitting Strategy

Routes are code-split by TanStack Start / Router file routes.

Experiment 001 lives under `src/experiments/` and `src/routes/experiments/` so it is not imported into product dashboard widgets.

Code splitting is not applied indiscriminately to every chart. Bundle measurements belong with thesis measurements, not as claims here.

---

### Search Params Strategy

URL search parameters are the source of truth for shareable, bookmarkable, history-navigable state.

**Transactions** (`/transactions`):

```text
page
category_id
type
search
sort
sortDirection
```

Example:

```text
/transactions?search=food&category_id=<uuid>&sort=date&sortDirection=desc&page=2
```

`category_id` is a category UUID. Omitting it means all categories.

**Categories** (`/categories`):

```text
search
page
```

**Budgets** (`/budgets`):

```text
month
year
```

Zod validates search params (`validateSearch`). `stripSearchParams` omits defaults (`page=1`, default sort, current budget period).

`"Sve"` / `"Svi"` and empty strings become omitted params (`undefined`), which means no backend filter.

Filter/search/sort changes reset `page` to 1 on transactions and categories. Page-only (or period-only) navigation preserves the rest.

Browser refresh, back, and forward restore URL state. Query keys include those params, so cache entries stay aligned with the URL.

Login uses `redirect` (sanitized: must start with `/` and must not start with `//`).

---

### Rendering Decision Rules

1. SSR for initial page content.
2. Critical data is awaited in the route loader.
3. Independent non-critical dashboard data is prefetched without awaiting.
4. Dashboard widgets use `useSuspenseQuery`; dashboard summary uses `useQuery`.
5. Independent widgets use independent Suspense and error boundaries.
6. URL-relevant list/period state lives in search params.
7. List pages use `keepPreviousData`, not the dashboard widget pattern.
8. Rendering optimizations should be validated in experiments (`docs/experiments.md`) rather than assumed.

---

### Rendering Strategy Example (dashboard)

```ts
export const Route = createFileRoute('/_protected/dashboard')({
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(monthlyTrendQuery())
    void context.queryClient.prefetchQuery(recentTransactionsQuery())
    void context.queryClient.prefetchQuery(budgetsQuery())

    await context.queryClient.ensureQueryData(dashboardSummaryQuery())
  },
  component: DashboardPage,
})
```

`budgetsQuery()` in this snippet is `features/dashboard/queries/budgets.query.ts`.

## 14. Data Fetching Strategy

### Data Fetching Architecture

TanStack Query is the server-state layer. Route loaders start or await queries; components consume the same `queryOptions()`.

Default query `staleTime` is 60 seconds to avoid an immediate refetch of SSR-fetched data after hydration.

Router `defaultPreload` is `'intent'`; `defaultPreloadStaleTime` is `0` (TanStack Router preload stale time, distinct from Query `staleTime`).

---

### Query Options

Factories are the source of truth for keys, `queryFn`, and configuration.

Example:

```ts
export function transactionsQuery(filters: TransactionFilters) {
  return queryOptions({
    queryKey: ['transactions', filters] as const,
    queryFn: () => getTransactions({ data: filters }),
  })
}
```

---

### Feature query keys (from source)

```text
['auth', 'current-user']

['dashboard', 'summary']
['dashboard', 'monthly-trend']
['dashboard', 'recent-transactions']
['dashboard', 'budgets']

['transactions', filters]
['transactions', 'detail', transactionId]

['categories', filters]
['categories', 'options']
['categories', 'detail', categoryId]

['budgets', { month, year }]
['budgets', 'detail', budgetId]
```

Do not invent additional namespaces. Prefix invalidation (`['transactions']`, `['categories']`, `['budgets']`, `['dashboard']`) is the mutation contract.

---

### Route Loader Data Fetching

Loaders populate the Query Cache. They do not pass server data as page props when Query already owns that data.

`loaderDeps` bind list loaders to validated search params.

---

### useSuspenseQuery vs useQuery

`useSuspenseQuery` is used for dashboard non-critical widgets that were prefetched and sit behind Suspense.

`useQuery` is used for:

- Dashboard summary (after `ensureQueryData`)
- Transaction, category, and budget lists (`keepPreviousData`)
- Category options in forms and transaction filters

`useQuery` in this codebase still runs against cache filled by loaders; it is not reserved for “client-only” data.

---

### Query Cache

Identified by `queryKey`. Different filter objects are different entries.

Provides deduplication, staleness, background refetch, SSR hydration, and invalidation.

---

### staleTime and gcTime

`staleTime` (configured to 60s by default) is freshness.

`gcTime` is how long inactive cache remains. The app uses Query defaults for `gcTime` and does not set server `gcTime` to `0`.

Experiment 001 also used a 60s `staleTime` during measurements. That experimental choice matches the current app default but is not a measured production SLA.

---

### SSR Hydration

`setupRouterSsrQueryIntegration({ router, queryClient })` coordinates dehydration, hydration, and streaming. The app does not implement a custom dehydrate/hydrate layer.

---

### Query Invalidation

Entity mutations invalidate prefixes that actually depend on the write.

| Mutation | Invalidates |
| -------- | ----------- |
| Transaction create/update/delete | `['transactions']`, `['dashboard']`, `['budgets']` |
| Category create | `['categories']` |
| Category update | `['categories']`, `['transactions']`, `['dashboard']`, `['budgets']` |
| Category delete | `['categories']` (plus detail `removeQueries`) |
| Budget create/update/delete | `['budgets']`, `['dashboard']` |
| Login / authenticated register / logout | `queryClient.clear()` via `clearUserQueryCache()` |

---

### Dependent vs independent queries

Independent queries are parallelized (`Promise.all` in loaders; dashboard prefetch before awaiting summary).

Dependent queries must wait for a real input (for example edit loaders need `transactionId` from the path).

---

### URL-Driven Queries

Search params that change returned data are part of the query key (`filters` or `{ month, year }`).

---

### Pagination

Used for transactions (20) and categories (10). Not used for budgets.

State is the `page` search param. The query key includes the full filters object.

Server returns `page`, `pageSize`, `total`, `totalPages`. Out-of-range pages are clamped; list loaders redirect to the canonical `page`. Deleting the last row on a page navigates to the last valid page.

---

### Infinite Queries

Not used. Table and category management use URL-driven pagination.

---

### Query Prefetching Rules

- Dashboard: non-awaited `prefetchQuery` for independent widgets; `ensureQueryData` for summary.
- List/form routes: `ensureQueryData` for data required to render the page.
- Intent preload is enabled on the router for links.

---

### Data Fetching Decision Rules

1. Define queries with `queryOptions()` factories.
2. Orchestrate in route loaders.
3. `ensureQueryData` for data the route must have.
4. Non-awaited `prefetchQuery` only for dashboard independent widgets.
5. Start those prefetches before awaiting summary so they overlap.
6. `useSuspenseQuery` for those dashboard widgets.
7. `useQuery` + `keepPreviousData` for URL-driven lists.
8. One Query Cache for server state.
9. `staleTime` 60s by default; override per query only if needed (none currently override).
10. Invalidate by prefix according to data dependencies.
11. Put URL params in the query key when they affect data.
12. Parallelize independent work; preserve true dependencies.
13. Record measurements in `docs/experiments.md`, not as unverified claims here.

## 15. State Management

### State Management Philosophy

```text
Server State     →  TanStack Query
URL State        →  TanStack Router search params
Form State       →  TanStack Form
Form Validation  →  Zod
Local UI State   →  React state
```

No Redux or Zustand.

---

### Server State

Examples: current user, transactions, categories, budgets, dashboard aggregates.

Do not copy Query `data` into `useState` as a second source of truth.

---

### URL State

Transactions, categories, and budgets list/period state as documented in Search Params Strategy.

---

### Form State

Implemented forms:

- Login, register
- Transaction create/edit
- Category create/edit
- Budget create/edit

Settings/profile forms: Not implemented.

Forms initialize from query data (edit) or defaults (create) and stay local until submit. Success invalidates Query entries (or clears the cache on auth).

---

### Local UI State

Dialog open state, filter drawer, temporary input before debounce (transaction search field), sidebar open cookie.

---

### Derived State

Balances and budget percentages are computed on the server (or in budget progress helpers) rather than stored as independent client stores.

---

### State Persistence

- Server data → PostgreSQL
- Shareable navigation → URL
- Session → Supabase Auth cookies
- Sidebar open → cookie set by the sidebar component
- Temporary UI → React state

No general-purpose localStorage store for domain data.

---

### State Management Decision Rules

1. TanStack Query owns server state.
2. Search params own shareable list/period state.
3. TanStack Form owns form values.
4. Zod validates forms and server input.
5. React state owns purely local UI.
6. Derive aggregates instead of duplicating them.
7. Mutations go through Server Functions; then invalidate or clear cache.
8. No global client store unless a concrete requirement cannot fit the above.

## 16. Performance Strategy

### SSR

TanStack Start SSR plus Query integration. Protected pages still SSR; they are `noindex`.

### Suspense

Dashboard non-critical widgets only. Not a global page wrapper.

### Lazy Loading

File-route code splitting. Experiment 001 is a separate route tree entry.

### Code Splitting

Route-based. No additional manual `React.lazy` layer for product widgets.

### startTransition

Not used as an application-wide strategy.

### React.memo

Not used as an application-wide strategy.

### Virtualization

Not implemented. Transaction and category tables paginate on the server instead.

Architectural performance decision that **is** implemented: dashboard critical/non-critical query split (Experiment 001). Quantitative results belong in `docs/experiments.md` and the thesis measurements chapter.

## 17. UX Strategy

### Navigation

Protected sidebar: dashboard, transactions, categories, budgets. Breadcrumbs from `nav-links.ts`. Intent preload on links. Logout in the sidebar footer.

### Forms

Shared `FormField` + Zod. Reusable feature forms for create/edit. Auth forms keep errors inline; CRUD mutations use toasts.

### Loading States

Dashboard summary skeleton via `useQuery` pending. Widget skeletons in Suspense fallbacks. Edit routes use `pendingComponent`. Lists dim content during `keepPreviousData` fetches.

### Empty States

Handled inside list/table/budget card UIs when there is no data (including empty budget period).

### Error States

Route `errorComponent`s on CRUD routes; widget `CatchBoundary` on dashboard; inline list errors; toasts on mutations; inline auth errors.

### Responsive Design

Protected layout with collapsible sidebar. Transaction filters use a `Sheet` below the `lg` breakpoint.

### Accessibility

Form ARIA via `getFormFieldAriaProps`. Icon-only row menus labeled. Budget progress bars labeled. Auth errors use `role="alert"`.

## 18. Testing Strategy

### Functional Testing

PostgreSQL RLS tests: `pnpm db:test` (`supabase/tests/rls_verification_test.sql`).

Application unit tests and end-to-end browser tests: Not implemented.

### Lighthouse

Not implemented as an automated suite in this repository.

### React Profiler

Not implemented as a documented workflow in application code.

### Bundle Analyzer

Not implemented.

### Network Analysis

Used during Experiment 001 (see `docs/experiments.md`). Not an automated CI check.

### UX Testing

Manual verification during development. Not a formal documented protocol in this file.

## 19. Measurements

Lighthouse, Core Web Vitals, bundle size, network, React render time, and task-completion metrics are **not** recorded in this architecture document.

Experiment methodology and Experiment 001 measurements belong in `docs/experiments.md`. Thesis Chapter 4 is the place for final performance discussion.

## 20. Decision Log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026 | TanStack Start + file routes + Server Functions | SSR React app without a separate REST API |
| 2026 | Supabase Auth + cookie server client | Session source of truth; no custom JWT layer |
| 2026 | `requireAuthMiddleware` on protected Server Functions | One `getUser()` per call; handlers receive `user` + `supabase` |
| 2026 | PostgreSQL RLS on all app tables | Database authorization boundary independent of the router |
| 2026 | TanStack Query `queryOptions` factories | Shared cache between loaders and components |
| 2026 | Dashboard critical/non-critical loader split | Experiment 001; progressive widgets |
| 2026 | URL search params for lists and budget period | Shareable, history-friendly state |
| 2026 | Split `getCategories` / `getCategoryOptions` | Paginated management vs full options for forms |
| 2026 | `clearUserQueryCache` on login/register/logout | Prevent cross-account Query Cache leaks |
| 2026 | Expense-only budget spending | Income must not consume category budgets |
| 2026 | `ON DELETE NO ACTION` from categories to transactions/budgets | Block in-use category delete; map `23503` |

## 21. Project Roadmap

MVP application modules listed in section 3 are implemented.

Remaining product modules:

- Analytics — Not implemented.
- Settings — Not implemented.

Experiment work continues in `src/experiments/` and `docs/experiments.md`. This file does not define sprint dates.

---

## Open Questions

None that contradict the documented MVP. Analytics and Settings remain unimplemented by design.
