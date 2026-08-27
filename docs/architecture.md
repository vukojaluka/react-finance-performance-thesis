# React Finance Performance Thesis

## 1. Project Overview

### Problem Statement

### Target Users

### Project Scope

### Out of Scope

---

## 2. Thesis Goal

### Primary Goal

### Secondary Goals

### Expected Outcomes

---

## 3. Application Overview

### Application Description

### Core Modules

### User Journey

### Application Flow

#### Guest Flow

#### Authenticated User Flow

---

## 4. Functional Requirements

| ID  | Requirement | Priority | Status |
| --- | ----------- | -------- | ------ |

---

## 5. Non-functional Requirements

| ID  | Requirement | Description |
| --- | ----------- | ----------- |

---

## 6. User Roles

### Guest

Permissions

### Authenticated User

Permissions

---

## 7. Domain Model

### Profile

#### Purpose

Represents an authenticated user of the application. Stores profile information that is not managed by Supabase Authentication.

#### Responsibilities

- Store personal information
- Own all application data
- Personalize the user experience

#### Relationships

- One Profile has many Transactions
- One Profile has many Categories
- One Profile has many Budgets

---

### Transaction

#### Purpose

Represents a single financial record created by the user. A transaction can be either an income or an expense.

#### Responsibilities

- Store financial transactions
- Associate transactions with categories
- Provide data for dashboard statistics
- Provide data for analytics and reports

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
- Compare planned and actual spending
- Provide budget progress information
- Support dashboard visualizations

#### Relationships

- Belongs to one Profile
- Belongs to one Category

## 8. Database Design

The application uses PostgreSQL as the primary relational database through Supabase. The database schema is designed to be simple, normalized and optimized for personal finance management while supporting fast dashboard queries and analytics.

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

- Primary Key (id)
- Foreign Key → auth.users(id)
- ON DELETE CASCADE

#### Relationships

- One Profile has many Transactions
- One Profile has many Categories
- One Profile has many Budgets

#### Indexes

- Primary Key (id)

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

- Primary Key (id)
- Foreign Key → profiles(id)
- Foreign Key → categories(id)

#### Relationships

- Many Transactions belong to one Profile
- Many Transactions belong to one Category

#### Indexes

- Primary Key (id)
- INDEX(user_id)
- INDEX(category_id)
- INDEX(transaction_date)
- Composite INDEX(user_id, transaction_date)

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

- Primary Key (id)
- Foreign Key → profiles(id)
- UNIQUE(user_id, name)

#### Relationships

- One Category has many Transactions
- One Category has many Budgets

#### Indexes

- Primary Key (id)
- INDEX(user_id)

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

- Primary Key (id)
- Foreign Key → profiles(id)
- Foreign Key → categories(id)
- UNIQUE(user_id, category_id, month, year)

#### Relationships

- Many Budgets belong to one Profile
- Many Budgets belong to one Category

#### Indexes

- Primary Key (id)
- INDEX(user_id)
- INDEX(category_id)
- Composite INDEX(month, year)

---

### Database Constraints

#### Foreign Keys

- profiles.id → auth.users.id
- transactions.user_id → profiles.id
- transactions.category_id → categories.id
- categories.user_id → profiles.id
- budgets.user_id → profiles.id
- budgets.category_id → categories.id

#### Unique Constraints

- UNIQUE(user_id, name) on categories
- UNIQUE(user_id, category_id, month, year) on budgets

#### Cascade Rules

- Deleting a profile deletes all owned data (ON DELETE CASCADE)
- Deleting a category is restricted while transactions exist (ON DELETE RESTRICT)

---

### Automatic Timestamps

All tables include `created_at` and `updated_at` columns.

- `created_at` uses `DEFAULT NOW()`
- `updated_at` uses `DEFAULT NOW()`
- `updated_at` is automatically maintained by a PostgreSQL trigger (`private.set_updated_at()`)

---

### Row Level Security (RLS)

RLS is implemented on all application tables (`profiles`, `categories`, `transactions`, `budgets`) in the initial Supabase migration.

Policies enforce ownership at the database level:

- Authenticated users can read, create, update, and delete only rows where `user_id` (or `id` for `profiles`) matches `auth.uid()`.
- Transaction and budget writes additionally require that the referenced `category_id` belongs to the same authenticated user.

The application uses the Supabase publishable key for normal client and server client access. The service-role key is not exposed to browser code and is not used by application Server Functions for routine data access.

Route guards and Server Function authentication are separate from RLS. Even if application code misroutes a request, PostgreSQL policies remain the database authorization boundary.

---

### Seed Data

Local development seed scripts (`supabase/seed.sql`) provide:

- Deterministic demo auth users
- Default transaction categories
- Demo budgets
- Demo transactions

Seed data is used for local development, manual testing, dashboard verification, reproducible transaction data, and later performance measurements. It is not a production dataset.

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

The server-side authentication flow is:

```text
Supabase Auth
      ↓
createSupabaseServerClient()
      ↓
getCurrentUser() Server Function
      ↓
TanStack Router beforeLoad
      ↓
_public / _protected layouts
```

`getCurrentUser()` uses the Supabase server client and `auth.getUser()` to resolve the authenticated user.

Only safe user information is returned to application code:

```ts
{
  id: string
  email: string
}
```

Authentication credentials, access tokens, refresh tokens, passwords, and service-role credentials are never exposed to client components.

### Route Protection

Authentication-based route protection is implemented using TanStack Router pathless layouts.

```text
_public/
├── index (landing `/`)
├── login
└── register

_protected/
├── dashboard (`/dashboard`)
├── transactions (`/transactions`)
├── transactions/new (`/transactions/new`)
└── transactions/$transactionId/edit (`/transactions/$transactionId/edit`)
```

The `_protected` layout performs the authentication check in `beforeLoad` using `currentUserQuery()` / `getCurrentUser()`.

Unauthenticated users are redirected to `/login`.

Authenticated users can access the protected application routes.

Login and register redirect already-authenticated users away from `/login` and `/register`. Register redirects to `/dashboard`; login redirects to the sanitized `redirect` search param or `/dashboard`.

The authentication guard is a routing and user-experience mechanism. It is not considered a database security boundary.

### Authorization and RLS

Database authorization is enforced independently through Supabase Row Level Security.

The security model is:

```text
Client
  ↓
TanStack Query
  ↓
Server Function
  ↓
Supabase Server Client
  ↓
Supabase Auth
  ↓
PostgreSQL RLS
```

Route guards prevent unauthenticated users from entering protected application routes.

RLS prevents authenticated users from accessing or modifying data belonging to other users.

Therefore, application security does not depend on the TanStack Router guard alone.

### Current User

The authenticated user is exposed through `getCurrentUser()` and cached client-side via `currentUserQuery()` (`['auth', 'current-user']`).

TanStack Query is not the authentication authority.

Supabase Auth remains the source of truth for authentication state.

The application does not use React Context, Zustand, or another global client-side authentication store.

### Authentication Routes

The current authentication routes are:

```text
/
/login
/register
```

Authentication actions are implemented through Server Functions:

```text
login
register
logout
getCurrentUser
```

Login, registration, and logout use the existing Supabase client/server integration.

### Development Environment

Authentication is currently developed against the local Supabase environment provided by the Supabase CLI and Docker.

Local email confirmation is disabled for development, allowing registration to create an authenticated session directly.

Mailpit is available for local email-related testing.

Production Supabase Auth configuration will be configured separately when the application is deployed.

### Security Principles

The authentication implementation follows these principles:

- Supabase Auth is the authentication authority.
- Protected Server Functions authenticate through `requireAuthMiddleware`, which calls `auth.getUser()` once and provides `user` and `supabase` via handler `context`.
- Route guards are implemented server-side through TanStack Router `beforeLoad`.
- Database authorization is enforced through PostgreSQL RLS.
- Client components do not directly access Supabase for privileged operations.
- Service-role/secret keys are never exposed to browser code.
- Passwords and authentication tokens are never logged or returned to client code.
- Authentication state is not duplicated into a custom global client store.

## 9. Application Pages

### Landing

Purpose

Main Features

Rendering Strategy

Performance Notes

---

### Login

Purpose

Main Features

Rendering Strategy

Performance Notes

---

### Register

Purpose

Main Features

Rendering Strategy

Performance Notes

---

### Dashboard

Purpose

Authenticated home page showing financial overview widgets.

Main Features

- Summary cards (income, expense, balance)
- Monthly income/expense trend chart
- Recent transactions list
- Current-month budget progress

Rendering Strategy

- Critical: `dashboardSummaryQuery()` via `ensureQueryData()` in the route loader
- Non-critical: `monthlyTrendQuery()`, `recentTransactionsQuery()`, `budgetsQuery()` prefetched without awaiting
- Non-critical widgets render behind independent Suspense boundaries with skeleton fallbacks

Performance Notes

Follows the critical/non-critical loader pattern validated by Experiment 001.

---

### Transactions

Purpose

Full CRUD management of user financial records.

Main Features

- List with server-side search, filters, sorting, and pagination
- Create and edit forms with Zod validation
- Delete with confirmation dialog
- URL-driven list state (TanStack Router search params)
- Toast feedback and query invalidation for list/dashboard sync

Routes:

```text
/transactions
/transactions/new
/transactions/$transactionId/edit
```

Rendering Strategy

- List loader awaits `transactionsQuery(search)` and `categoriesQuery()`
- List data is consumed with `useQuery()` and `keepPreviousData` for filter transitions
- Create/edit loaders await `categoriesQuery()`; edit also awaits `transactionQuery(transactionId)`

Performance Notes

Filter, search, sort, and type changes reset `page` to 1. Page-only navigation preserves active filters.

---

### Analytics

Not implemented. No route or feature module exists yet.

---

### Categories

Purpose

Full CRUD management of user-defined transaction categories.

Main Features

- List with optional URL-driven name search (client-side filter over full list)
- Create and edit forms with Zod validation
- Delete with confirmation dialog
- Toast feedback and targeted query invalidation

Routes:

```text
/categories
/categories/new
/categories/$categoryId/edit
```

Rendering Strategy

- List loader awaits `categoriesQuery(search)`
- Edit loader awaits `categoryQuery(categoryId)`
- Search and page are URL-driven; out-of-range pages are clamped server-side

Performance Notes

Filter/search changes reset `page` to 1. Page-only navigation preserves search. Transaction forms still use the unfiltered `categoriesQuery()` full list.

---

### Budgets

Not implemented as a standalone page. Budget data is read through `getBudgets()` for the dashboard widget. Navigation includes a `/budgets` link, but the route is not implemented yet.

---

### Settings

Not implemented. No route or feature module exists yet.

---

## 10. Features

### Authentication

Description

Supabase Auth with `_public` and `_protected` pathless layouts, `currentUserQuery()` / `getCurrentUser()`, and `requireAuthMiddleware` on protected Server Functions.

Business Value

Secure access to personal financial data without a custom session system.

Thesis Value

Demonstrates server-side auth integration with TanStack Start Server Functions and TanStack Router route guards.

Priority

Implemented.

---

### Dashboard

Description

Read-only dashboard aggregating summary metrics, monthly trend, recent transactions, and budget progress.

Business Value

At-a-glance financial overview after login.

Thesis Value

Demonstrates critical vs non-critical data loading, Suspense boundaries, and progressive widget rendering.

Priority

Implemented.

---

### Transactions

Description

Complete CRUD feature: list with URL-driven filters/pagination/sorting/search, create, edit, delete, form validation, and cache invalidation.

Business Value

Core personal finance record management.

Thesis Value

Demonstrates URL-as-state, server-side list queries, TanStack Form mutations, and targeted query invalidation.

Priority

Implemented.

---

### Analytics

Description

Planned read-only analytics views. Not implemented.

Business Value

TBD when implemented.

Thesis Value

TBD when implemented.

Priority

Not started.

---

### Categories

Description

Complete CRUD feature: list with URL-driven name search and server-side pagination, create, edit, delete, form validation, and cache invalidation. Unfiltered `categoriesQuery()` remains the shared read path for transaction forms and filters.

Business Value

Categories organize transactions and budgets; users can manage their own classification labels and colors.

Thesis Value

Demonstrates a simpler CRUD variant than Transactions (search + pagination, no type/category/sort filters) while reusing the same Server Function, form, and invalidation patterns.

Priority

Implemented.

---

### Budgets

Description

Budget CRUD is not implemented. `getBudgets()` provides read-only current-month budget progress for the dashboard widget.

Business Value

Budget tracking on dashboard; management UI is planned.

Thesis Value

TBD when CRUD is implemented.

Priority

Read-only dashboard widget only.

---

### Settings

Description

Planned profile/settings management. Not implemented.

Business Value

TBD when implemented.

Thesis Value

TBD when implemented.

Priority

Not started.

---

## 11. API Design

### API Architecture

The application does not expose a traditional REST API to the client.

TanStack Start Server Functions are used as the server-side API boundary.

The general data flow is:

Client Component
↓
TanStack Query
↓
queryOptions()
↓
Server Function
↓
Database / Supabase

For mutations:

Form
↓
TanStack Form + Zod
↓
TanStack Query Mutation
↓
Server Function
↓
Database / Supabase
↓
Query Invalidation

Client-side feature code does not access Supabase directly.

Server Functions are responsible for communicating with the database and enforcing server-side authentication and authorization requirements.

---

### Server Functions

Server Functions provide the boundary between the client application and server-side data access.

They are organized by feature rather than as one global API layer.

Example:

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
│       ├── get-categories.ts     # protected
│       ├── get-category.ts       # protected
│       ├── create-category.ts    # protected
│       ├── update-category.ts    # protected
│       └── delete-category.ts    # protected
├── dashboard/
│   └── server/
│       ├── get-dashboard-summary.ts
│       ├── get-monthly-trend.ts
│       ├── get-recent-transactions.ts
│       └── get-budgets.ts
└── transactions/
    └── server/
        ├── get-transactions.ts
        ├── get-transaction.ts
        ├── create-transaction.ts
        ├── update-transaction.ts
        └── delete-transaction.ts
```

Protected Server Functions attach `requireAuthMiddleware` before their handler. Public auth endpoints (`login`, `register`, `logout`, `getCurrentUser`) do not use it.

Server Functions return typed domain data rather than exposing raw database responses.

---

### Naming Conventions

Read operations use the `get` prefix:

- `getDashboardSummary()`
- `getMonthlyTrend()`
- `getRecentTransactions()`
- `getBudgets()`
- `getTransactions()`
- `getTransaction()`
- `getCategories()`
- `getCurrentUser()`

Mutation operations use:

- `create...`
- `update...`
- `delete...`

Implemented mutation examples:

- `createTransaction()`
- `updateTransaction()`
- `deleteTransaction()`
- `createCategory()`
- `updateCategory()`
- `deleteCategory()`

Planned mutation naming (not implemented):

- `createBudget()`, `updateBudget()`, `deleteBudget()`

The `fetch` prefix is not used for Server Function naming.

---

### Query Pattern

Read operations use TanStack Query.

Each feature defines reusable query option factories using `queryOptions()`.

Example:

```ts
export function transactionsQuery(filters: TransactionFilters) {
  return queryOptions({
    queryKey: ['transactions', filters] as const,
    queryFn: () => getTransactions({ data: filters }),
  })
}
```

List queries include URL-derived `filters` in the query key. Detail queries use `['transactions', 'detail', transactionId]`.

The same query options are reused by:

- Route Loaders
- `useQuery()`
- `useSuspenseQuery()`
- `prefetchQuery()`
- `ensureQueryData()`

This provides a shared Query Cache entry and consistent query configuration.

---

### Mutation Pattern

Mutations use TanStack Query together with TanStack Form where a form is involved.

The general flow is:

TanStack Form
↓
Zod validation
↓
TanStack Query Mutation
↓
Server Function
↓
Database
↓
Query Invalidation

After a successful mutation, only affected queries should be invalidated.

The application should avoid invalidating the entire Query Cache after every mutation.

Example affected queries after a transaction mutation:

```text
['transactions']   # list + detail (prefix invalidation)
['dashboard']      # summary, monthly-trend, recent-transactions, budgets
```

Example invalidation:

```ts
await Promise.all([
  queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
])
```

The exact invalidation strategy is defined per feature.

---

### Input Validation

User-provided input is validated with Zod.

Client-side validation provides immediate feedback through TanStack Form.

Server Functions must not trust client-side validation and must validate important input at the server boundary as well.

The server is responsible for enforcing:

- Input shape
- Required fields
- Allowed values
- Business rules
- Authorization requirements

---

### Authentication

Authentication is handled through Supabase Auth.

Server Functions determine the authenticated user from the server-side session rather than accepting a client-provided `userId` as the source of truth.

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

Business operations are performed in the context of the authenticated user, with RLS as the database authorization boundary.

---

### Authorization

Authorization is enforced at the server and database layers.

The application uses PostgreSQL Row Level Security (RLS) on all user-owned tables. Policies are defined in the Supabase migration and enforce row ownership using `auth.uid()`. Transaction and budget write policies also verify category ownership.

The general security model is:

Server Function
↓
requireAuthMiddleware (protected operations)
↓
Authenticated User + Supabase Server Client
↓
Row Level Security
↓
User-owned Data

Client-provided identifiers must never be trusted to determine ownership of protected resources. Server Functions derive `user_id` from the authenticated session; RLS provides defense in depth at the database layer.

Route guards (`beforeLoad` on `_protected`) prevent unauthenticated navigation. They are not a substitute for RLS.

---

### Error Handling

The application uses layered error handling:

**Zod / form validation**

- Route search params validated with Zod (e.g. transaction list filters)
- TanStack Form + Zod schemas for create/edit forms
- Field-level errors via shared form helpers (`FormField`, `getFormFieldErrorMessage`)

**Server / domain errors**

- Server Functions throw typed application errors (e.g. not found, database failure, unauthenticated)
- Mutations surface server errors through TanStack Query `onError` handlers

**Route error boundaries**

- Shared `getRouteError()` helper normalizes validation vs global errors
- Transaction list, create, and edit routes define route-level `errorComponent`s
- Edit route also defines `notFoundComponent` and `pendingComponent`
- Dashboard non-critical widgets use `CatchBoundary` + `QueryErrorResetBoundary` per widget

**Global toast feedback**

- Sonner toaster in the root document for mutation success/failure

**Component-level query errors**

- Transaction list handles query errors inline when using `useQuery()` (in addition to route-level handling)

Not every route uses identical error boundary coverage. Standalone `/budgets`, `/analytics`, and `/settings` routes are not implemented yet. Categories list, create, and edit routes define route-level `errorComponent`s; edit also defines `notFoundComponent` and `pendingComponent`.

---

### Response Design

Server Functions return application-level typed data rather than raw Supabase responses.

Example:

```ts
return {
  id,
  title,
  amount,
  type,
  date,
  category,
  categoryColor,
}
```

Database-specific response objects should not unnecessarily leak into the client application.

This keeps the client-side domain model decoupled from the database implementation.

---

### Authentication API

Authentication-related Server Functions:

- `getCurrentUser()` — public; returns `{ isLoggedIn: false }` when unauthenticated
- `login()` — public
- `register()` — public
- `logout()` — public

Authentication functionality is kept separate from business-domain operations.

---

### Dashboard API

Dashboard Server Functions provide aggregated data for dashboard widgets.

Implemented operations:

- `getDashboardSummary()` — critical summary metrics
- `getMonthlyTrend()` — monthly income/expense trend
- `getRecentTransactions()` — recent activity list
- `getBudgets()` — current-month budget progress

Query keys:

```text
['dashboard', 'summary']
['dashboard', 'monthly-trend']
['dashboard', 'recent-transactions']
['dashboard', 'budgets']
```

Critical dashboard data uses `ensureQueryData(dashboardSummaryQuery())` in the route loader.

Independent non-critical widgets use non-awaited `prefetchQuery()` and `useSuspenseQuery()` behind Suspense boundaries with skeleton fallbacks.

---

### Transactions API

Transactions provide full CRUD functionality.

Operations:

- `getTransactions()` — paginated list with server-side search, filters, sorting
- `getTransaction()` — single record for edit
- `createTransaction()`
- `updateTransaction()`
- `deleteTransaction()`

All transaction Server Functions use `requireAuthMiddleware`. Inputs are validated with Zod at the server boundary.

List state is URL-driven via TanStack Router search params validated by `transactionFiltersSchema`:

- `page`, `category_id`, `type`, `search`, `sort`, `sortDirection`
- Selecting "Sve" / "Svi" clears a filter (`undefined`), omits it from the URL, and does not apply a backend filter
- Changing category, type, search, sort, or sortDirection resets `page` to 1
- Changing only `page` preserves active filters

Query keys:

```text
['transactions', filters]           // list (filters mirror URL search params)
['transactions', 'detail', id]      // detail
```

Out-of-range pages are clamped server-side. Delete handles the last-item-on-page edge case by navigating to the last valid page when needed.

Mutations invalidate `['transactions']` and `['dashboard']` to keep list/detail data and dashboard aggregates synchronized.

---

### Categories API

Categories provide full CRUD functionality.

Operations:

- `getCategories()` — paginated list with optional name search for the management UI; unfiltered call still returns the full ordered list for transaction forms and filters
- `getCategory()` — single record for edit
- `createCategory()`
- `updateCategory()`
- `deleteCategory()`

All category Server Functions use `requireAuthMiddleware`. Inputs are validated with Zod at the server boundary.

List state is URL-driven via TanStack Router search params validated by `categorySearchSchema`:

- `page`, `search` (optional name filter)
- Changing search resets `page` to 1
- Changing only `page` preserves search
- Default `page=1` is omitted from the URL

Query keys:

```text
['categories']                      # full list (transaction forms and filters)
['categories', filters]             # paginated list (filters mirror URL search params)
['categories', 'detail', id]        # detail
```

Out-of-range pages are clamped server-side. Delete handles the last-item-on-page edge case by navigating to the last valid page when needed.

Duplicate names map to a safe domain error (`UNIQUE(user_id, name)`). Delete is blocked when transactions or budgets still reference the category (FK `ON DELETE NO ACTION`).

Mutations invalidate `['categories']`. Successful updates also invalidate `['transactions']` and `['dashboard']` so joined category name/color data stays consistent.

---

### Budgets API

Budgets are read-only in the current implementation.

Implemented operation:

- `getBudgets()` — current-month budget progress for the dashboard widget

Query key: `['dashboard', 'budgets']`

Budget CRUD Server Functions are not implemented. Navigation references a future `/budgets` page.

---

### Analytics API

Not implemented. No analytics Server Functions or routes exist yet.

When implemented, analytics should provide read-only aggregated financial data rather than raw transaction records.

---

### Query and Mutation Boundaries

The application follows these general rules.

#### Critical Server Data

Use:

```ts
await queryClient.ensureQueryData(...)
```

when the data is required for meaningful initial rendering.

#### Non-Critical Server Data

Use:

```ts
void queryClient.prefetchQuery(...)
```

when the data is independent and should begin loading without blocking critical SSR.

The corresponding component consumes the query with:

```ts
useSuspenseQuery(...)
```

inside an appropriate Suspense boundary.

#### User-Initiated Data

Queries that only make sense after explicit user interaction should not be eagerly prefetched.

Examples include:

- Search
- Filter changes
- Pagination
- On-demand details
- Export operations

These operations are initiated from the client when required.

---

### API Design Principles

The API layer follows these principles:

1. Server Functions are the server-side boundary.
2. Supabase is not accessed directly from client components.
3. Read operations use TanStack Query.
4. Mutations use TanStack Query mutations.
5. Query options are reusable across loaders and components.
6. Server Functions use typed inputs and outputs.
7. Client-side validation uses Zod.
8. Important validation is repeated on the server boundary.
9. Authentication is derived from the server-side session.
10. Authorization is enforced through `requireAuthMiddleware` and database RLS.
11. Server Functions return domain-level data rather than raw database responses.
12. Only affected queries are invalidated after mutations.
13. Critical and non-critical queries use different loading strategies based on rendering requirements.

## 12. High-Level Architecture

### Application Layers

Client

Server

Database

External Services

### Project Conventions

#### Folder Structure

The project follows a feature-based architecture.

```
src/
│
├── components/
│   └── ui/              # shared UI primitives (FormField, DatePicker, Sonner, …)
│
├── experiments/
│
├── features/
│   ├── auth/
│   │   └── middleware/
│   │       └── require-auth.middleware.ts
│   ├── categories/      # full CRUD
│   ├── dashboard/
│   └── transactions/    # full CRUD
│
├── integrations/        # Supabase, TanStack Query providers
│
├── lib/                 # shared utilities (format-currency, format-date, form-errors, route-errors)
│
└── routes/
    ├── _public/         # /, /login, /register
    └── _protected/      # /dashboard, /transactions/*, /categories/*
```

Imports use the `@/` path alias (maps to `src/`).

Global UI components live in `components/ui`. Business logic is organized by feature. Each feature owns its components, queries, server functions, schemas, and feature-specific utilities.

Reusable primitives introduced during Transactions work include:

- `FormField`, `form-field-error`, form error helpers (`lib/form-errors.ts`)
- `DatePicker`, `Toaster` (Sonner)
- `getRouteError()` (`lib/route-errors.ts`)
- Currency/date formatting (`lib/format-currency.ts`, `lib/format-date.ts`)
- Reusable transaction form fields and schema patterns (kept under `features/transactions/`)

Truly generic UI and utilities stay in shared locations; transaction-specific helpers stay in the transactions feature.

---

#### Naming Conventions

##### Server Functions

Server Functions use verb-based names.

Examples:

- getDashboardSummary
- getTransactions
- createTransaction
- updateTransaction
- deleteTransaction
- upsertBudget

---

##### Query Options

TanStack Query uses shared query option factories.

Examples:

- dashboardSummaryQuery()
- monthlyTrendQuery()
- recentTransactionsQuery()
- budgetsQuery()
- transactionsQuery()
- transactionQuery()
- categoriesQuery()
- currentUserQuery()

The same query options object is reused by:

- ensureQueryData()
- prefetchQuery()
- useSuspenseQuery()

---

##### File Naming

All files use kebab-case.

Examples

- dashboard-summary.query.ts
- get-dashboard-summary.ts
- create-transaction.ts
- transaction-form.tsx

---

#### Project Principles

- Feature-first architecture
- Shared UI components only inside `components/ui`
- Business logic belongs to the corresponding feature
- Shared utilities are placed inside `lib`
- No duplicated query logic
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

Mutation path:

```text
TanStack Form + Zod
  ↓
TanStack Query Mutation
  ↓
Server Function (+ requireAuthMiddleware)
  ↓
PostgreSQL / RLS
  ↓
Query invalidation (affected namespaces only)
  ↓
UI (toast, navigation)
```

## 13. Rendering Strategy

### Rendering Model

The application uses TanStack Start with server-side rendering and progressive rendering.

Routes and React components can participate in SSR while also executing client-side after hydration.

The application does not use a Next.js-style `"use client"` directive to classify components.

Rendering strategy is determined primarily by:

- Route requirements
- Data criticality
- Query loading strategy
- Suspense boundaries
- Code splitting requirements

The application prioritizes delivering meaningful content as early as possible while allowing independent content to resolve progressively.

---

### SSR Pages

Pages that benefit from SEO, fast initial content delivery or server-rendered application state use Server-Side Rendering.

Examples include:

- Landing page
- Login
- Register
- Dashboard
- Transactions (list, create, edit)

Route loaders are used to prepare critical server data before the route renders.

Critical data may be loaded using:

```ts
await queryClient.ensureQueryData(queryOptions())
```

The loader blocks only on data required for meaningful initial rendering.

---

### Client Pages

The application does not treat routes as exclusively server-rendered or exclusively client-rendered.

After SSR and hydration, the same React application continues execution on the client.

Client-side rendering is used for:

- Interactive UI
- Forms
- Filters
- Search
- Pagination
- Modals
- Drawers
- User interactions
- Client-side state updates

Data remains managed through TanStack Query rather than manually fetching data inside individual components.

---

### Critical Data Rendering

Critical data is data required for meaningful initial rendering of a page.

Examples:

- Authenticated user/session
- Dashboard summary
- Initial transaction list
- Required page configuration

Critical queries are awaited in the Route Loader:

```ts
await queryClient.ensureQueryData(criticalQuery())
```

This ensures that the required query data is available before the route continues rendering.

Critical queries should be limited to the minimum data required for the initial page experience.

The goal is to avoid blocking SSR on secondary widgets or independent data.

---

### Non-Critical Data Rendering

Non-critical data is data that improves the page but is not required for the initial meaningful rendering.

Examples:

- Charts
- Recent activity
- Secondary statistics
- Additional analytics widgets

Independent non-critical queries are started as early as possible in the Route Loader:

```ts
void queryClient.prefetchQuery(nonCriticalQuery())
```

The loader does not await these queries.

The corresponding component consumes the same query through:

```ts
useSuspenseQuery(nonCriticalQuery())
```

This allows the query to begin before the critical loader work has completed.

Experiment 001 demonstrated that starting independent non-critical queries before awaiting critical data reduced total loading time by approximately one second under identical artificial latency.

---

### Suspense Boundaries

Independent non-critical widgets use separate React Suspense boundaries.

Example:

```tsx
<Suspense fallback={<MonthlyTrendSkeleton />}>
  <MonthlyTrend />
</Suspense>

<Suspense fallback={<RecentTransactionsSkeleton />}>
  <RecentTransactions />
</Suspense>
```

Each independent boundary allows its content to reveal when its data becomes available.

A single large Suspense boundary should not unnecessarily group unrelated widgets because this would cause faster content to wait for slower content.

Suspense boundaries are therefore placed around logical UI sections rather than around the entire page whenever progressive rendering provides a meaningful UX improvement.

---

### Streaming

The application uses TanStack Start's SSR and streaming capabilities to progressively deliver content that becomes available after critical rendering.

The intended rendering flow for a dashboard-like page is:

```text
Route Loader
    │
    ├── Start non-critical queries
    │
    └── Await critical query
            │
            ▼
       Initial Render
            │
            ├── Dashboard Summary
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

The application does not intentionally block the initial page render on independent non-critical queries.

The exact server streaming and hydration behaviour is delegated to TanStack Start and TanStack Query.

---

### Code Splitting Strategy

Routes are code-split according to TanStack Start's route-based architecture.

Feature-specific components should remain colocated with their feature and should not be eagerly imported into unrelated routes.

Heavy or secondary UI should be loaded only when required.

Potential candidates for lazy loading include:

- Large charts
- Advanced analytics components
- Rich editors
- Large modal content
- Feature-specific secondary components

Code splitting should be introduced where it provides measurable benefit rather than applied indiscriminately.

Bundle size and loading behaviour will be evaluated using the project's performance measurements.

---

### Search Params Strategy

URL search parameters are used for state that should be:

- Shareable
- Bookmarkable
- Navigable through browser history
- Represented in the URL

Examples:

- Search
- Sorting
- Filtering
- Pagination
- Selected category
- Date range

TanStack Router search parameters are the source of truth for these values.

Example:

```text
/transactions?search=food&category=groceries&sort=date&page=2
```

Components derive their query state from the route search parameters.

Changes to search parameters should update the URL rather than maintaining a second independent client-side state representation.

This allows navigation, refreshes and direct links to preserve the current page state.

---

### Rendering Decision Rules

The application follows these general rules:

1. SSR is preferred for initial page content where it provides meaningful value.
2. Critical data is awaited in the Route Loader.
3. Independent non-critical data is prefetched without awaiting.
4. Non-critical data is consumed through `useSuspenseQuery()`.
5. Independent widgets use independent Suspense boundaries.
6. SSR should not be blocked by secondary widgets unnecessarily.
7. URL-relevant state is stored in TanStack Router search parameters.
8. Client UI state remains local unless there is a demonstrated need for shared state.
9. Code splitting is introduced based on measurable performance impact.
10. Rendering optimizations should be validated through experiments and measurements rather than assumptions.

---

### Rendering Strategy Example

The preferred pattern for a dashboard with one critical widget and multiple independent secondary widgets is:

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

The critical component reads its query normally:

```ts
const { data } = useSuspenseQuery(dashboardSummaryQuery())
```

Independent widgets use their own Suspense boundaries:

```tsx
<Suspense fallback={<MonthlyTrendSkeleton />}>
  <MonthlyTrend />
</Suspense>

<Suspense fallback={<RecentTransactionsSkeleton />}>
  <RecentTransactions />
</Suspense>
```

This pattern is the preferred rendering strategy established by Experiment 001 for pages containing independent critical and non-critical data.

## 14. Data Fetching Strategy

### Data Fetching Architecture

The application uses TanStack Query as the primary server-state management and data-fetching layer.

TanStack Start Route Loaders coordinate server-side data fetching, while reusable TanStack Query option factories define how individual queries are executed and cached.

The general data flow is:

Route Loader / Component
↓
Query Options
↓
TanStack Query
↓
Server Function
↓
Database / Supabase

The same query options are reused across Route Loaders and React components to ensure that all parts of the application reference the same Query Cache entry.

---

### Query Options

Each server-side query is defined through a reusable `queryOptions()` factory.

Example:

```ts
export function transactionsQuery(filters: TransactionFilters) {
  return queryOptions({
    queryKey: ['transactions', filters] as const,
    queryFn: () => getTransactions({ data: filters }),
  })
}
```

List queries include URL-derived `filters` in the query key. Detail queries use `['transactions', 'detail', transactionId]`.

Query option factories are the single source of truth for:

- Query keys
- Query functions
- Query configuration
- Query-specific caching behaviour

The same query options may be passed to:

- `ensureQueryData()`
- `prefetchQuery()`
- `useQuery()`
- `useSuspenseQuery()`

Query keys must uniquely identify the data represented by the query.

---

### Route Loader Data Fetching

Route Loaders are responsible for orchestrating data that should begin loading during route navigation.

The loader determines which queries are:

- Critical
- Non-critical
- Not required until user interaction

The loader should not manually return server data as component props when the same data is already managed by TanStack Query.

Instead, the loader populates or starts the Query Cache and components consume the query through TanStack Query hooks.

Example:

```ts
loader: async ({ context }) => {
  void context.queryClient.prefetchQuery(nonCriticalQuery())

  await context.queryClient.ensureQueryData(criticalQuery())
}
```

---

### Critical Queries

Critical queries contain data required for meaningful initial rendering.

Examples:

- Authenticated user/session
- Dashboard summary
- Initial transaction list
- Required page configuration

Critical queries are awaited using:

```ts
await queryClient.ensureQueryData(criticalQuery())
```

The loader continues only after the critical query has been resolved or an appropriate error has been produced.

Critical queries should be kept to the minimum necessary for the initial page experience.

The goal is to avoid turning every page dependency into a blocking request.

---

### Non-Critical Queries

Non-critical queries provide additional content that is useful but not required for the initial meaningful render.

Examples:

- Charts
- Recent transactions
- Secondary statistics
- Analytics widgets
- Recommendations

Independent non-critical queries should be started as early as possible:

```ts
void queryClient.prefetchQuery(nonCriticalQuery())
```

The promise is intentionally not awaited or returned from the loader.

This allows the query to start while critical data is still loading.

The corresponding component consumes the same query using:

```ts
useSuspenseQuery(nonCriticalQuery())
```

This pattern was validated by Experiment 001.

The Early Prefetch strategy reduced total page completion time by approximately one second compared with the Late Prefetch strategy under identical artificial latency.

---

### Component Data Fetching

Components do not directly call Server Functions for normal server-state fetching.

Instead, components consume data through TanStack Query.

The appropriate hook depends on whether the query should participate in SSR and Suspense.

---

### useSuspenseQuery

`useSuspenseQuery()` is the preferred hook for data that participates in SSR and progressive rendering.

Example (dashboard summary — critical, loader-awaited):

```ts
const { data } = useSuspenseQuery(dashboardSummaryQuery())
```

Example (transaction list — URL-driven, loader-awaited but consumed with `useQuery()` for `keepPreviousData` during filter transitions):

```ts
const search = useSearch({ from: '/_protected/transactions/' })
const { data } = useQuery({
  ...transactionsQuery(search),
  placeholderData: keepPreviousData,
})
```

If a suspense query is not already available in the Query Cache, the component suspends until the query resolves.

`useSuspenseQuery()` is preferred for:

- SSR-rendered dashboard widgets prefetched in the route loader
- Critical page data consumed by components behind Suspense boundaries

`useQuery()` is used when client-side fetching behavior is intentionally different (e.g. transaction list with placeholder data during filter changes).

---

### useQuery

`useQuery()` is used when a query does not need to execute during SSR.

Examples include:

- User-initiated searches
- Optional client-only data
- Data that is not required for the initial render
- Certain interactive UI states

In the TanStack Router Query integration, `useQuery()` does not execute the query on the server and instead fetches on the client after hydration.

Therefore, `useQuery()` should not be used for data that must be available during SSR.

For SSR and streaming use cases, `useSuspenseQuery()` is preferred.

---

### Query Cache

TanStack Query's Query Cache is the shared source of truth for server state within the application.

A query is identified by its `queryKey`.

Example:

```ts
queryKey: ['transactions', filters]
```

Queries with different parameters use different query keys.

Example (transactions list — filters mirror URL search params):

```ts
queryKey: [
  'transactions',
  {
    page,
    category_id,
    type,
    search,
    sort,
    sortDirection,
  },
]
```

The Query Cache provides:

- Request deduplication
- Cached data
- Query state
- Staleness tracking
- Background refetching
- SSR hydration
- Query invalidation

The application should avoid creating multiple independent cache representations of the same server data.

---

### staleTime

`staleTime` determines how long cached query data is considered fresh.

The default TanStack Query `staleTime` is `0`, meaning queries are immediately considered stale.

This can cause a query that was fetched during SSR to refetch after hydration.

For SSR applications, the application should configure an appropriate non-zero `staleTime` where immediate refetching is unnecessary.

Experiment 001 used:

```ts
staleTime: 60 * 1000
```

as the experimental value.

This prevented immediate background refetches from interfering with the experiment.

The final application default should be chosen according to data freshness requirements rather than applying one value blindly to every query.

Frequently changing data may use a shorter `staleTime`.

Relatively stable data may use a longer `staleTime`.

Queries that must always be refreshed can use a lower value or explicit invalidation/refetching.

---

### gcTime

`gcTime` controls how long inactive queries remain in the Query Cache before garbage collection.

`gcTime` is different from `staleTime`.

`staleTime` answers:

> How long is this data considered fresh?

`gcTime` answers:

> How long should inactive cached data remain available?

The application should not use `gcTime` as a replacement for `staleTime`.

The default server-side garbage-collection behaviour should be preserved unless there is a demonstrated reason to change it.

The application should avoid setting server-side `gcTime` to `0`, as this can interfere with SSR hydration.

---

### SSR Hydration

TanStack Start uses TanStack Router's Query integration to coordinate Query Cache dehydration, hydration and streaming between the server and client.

The application does not manually implement Query Cache dehydration and hydration for normal Route Loader usage.

The intended flow is:

Server
↓
Route Loader
↓
QueryClient
↓
Query Cache
↓
SSR
↓
Dehydration / Streaming
↓
Browser
↓
Hydrated Query Cache

The same query options used on the server are used by the client components.

This allows components to consume server-fetched data without creating a second independent data-fetching mechanism.

TanStack Router's Query integration provides automatic SSR dehydration/hydration and streaming of queries that resolve during the initial server render.

---

### Query Invalidation

Mutations invalidate only the queries affected by the changed data.

Example:

Creating a transaction may invalidate:

```text
transactions
dashboard
```

Prefix invalidation covers list/detail transaction queries and all dashboard widgets (`summary`, `recent-transactions`, `monthly-trend`, `budgets`).

The application should avoid globally invalidating all queries after every mutation.

Invalidation should be based on actual data dependencies.

Example:

```ts
await Promise.all([
  queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
])
```

Related aggregate queries should be invalidated when the mutation changes the data they represent.

---

### Dependent Queries

Queries that are truly dependent on another query should not be forced into parallel execution.

Example:

```text
Get User
   ↓
Get User-specific Account
   ↓
Get Account-specific Data
```

If query B requires a value returned by query A, query B cannot start correctly before query A provides that value.

The application should distinguish between:

- True data dependencies
- Accidental request waterfalls

Independent queries should be parallelized.

Dependent queries should preserve their dependency chain.

The Early Prefetch strategy applies only to independent queries.

---

### URL-Driven Queries

Queries affected by URL state must include the relevant search parameters in their query key.

Example:

```ts
queryKey: [
  'transactions',
  {
    page,
    category_id,
    type,
    search,
    sort,
    sortDirection,
  },
]
```

TanStack Router search parameters are the source of truth for:

- Search
- Filtering
- Sorting
- Pagination
- Date ranges
- Selected categories

This prevents multiple independent representations of the same URL-driven state.

When search parameters change, TanStack Query receives a new query key and can resolve the corresponding cache entry.

---

### Pagination

Standard pagination is used for the transactions list.

Pagination state (`page`) is stored in TanStack Router search params. The list query key includes the full filters object (not `page` alone):

```ts
queryKey: ['transactions', { page, category_id, type, search, sort, sortDirection }]
```

Each distinct filter/page combination has its own Query Cache entry.

Server-side pagination returns `page`, `pageSize`, `total`, and `totalPages`. Out-of-range pages are clamped in `getTransactions()`. Deleting the last item on a page navigates to the last valid page.

---

### Infinite Queries

Infinite queries should only be used where the UX requires continuous or incremental loading.

Potential examples include:

- Activity feeds
- Long transaction histories
- Infinite scrolling lists

The application should not use infinite queries simply because a dataset is large.

For standard table-based transaction management, URL-driven pagination is preferred because it provides:

- Shareable URLs
- Browser history support
- Predictable navigation
- Direct access to a specific page

---

### Error Handling

Query errors are handled through TanStack Query and route/component boundaries.

The application distinguishes:

- **Loading / empty / success** — Suspense for prefetched widgets; inline states for transaction list
- **Zod validation errors** — route search param validation, form field errors
- **Server/domain errors** — thrown by Server Functions, surfaced via route `errorComponent` or mutation toasts
- **Route error boundaries** — shared `getRouteError()` helper; implemented on transaction routes and dashboard widgets

Suspense handles pending states for `useSuspenseQuery()`. Transaction list query errors may be handled at both route and component level when using `useQuery()`.

Server Functions throw meaningful errors at the server boundary rather than returning custom `{ success, error }` wrappers.

---

### Query Prefetching Rules

The application follows these rules for prefetching.

#### Route Loader Prefetch

Use for data known to be required by the upcoming route.

```ts
void queryClient.prefetchQuery(queryOptions())
```

#### Critical Route Data

Use:

```ts
await queryClient.ensureQueryData(queryOptions())
```

when the route should not render meaningfully without the data.

#### Component-Level Prefetch

May be used when a component knows that a descendant or subsequent interaction will require additional data.

Route-level prefetching is preferred when the dependency is already known at route load time because it can avoid request waterfalls earlier in the lifecycle.

#### Event-Based Prefetch

May be used when user interaction provides a strong signal that data will soon be required.

Examples:

- Hovering a details link
- Focusing a control
- Opening a navigation menu

---

### Data Fetching Decision Rules

The application follows these general rules:

1. Define server-state queries using reusable `queryOptions()` factories.
2. Use Route Loaders to orchestrate server-side query execution.
3. Use `ensureQueryData()` for critical data required for initial rendering.
4. Use non-awaited `prefetchQuery()` for independent non-critical data.
5. Start independent non-critical queries before awaiting critical data when doing so provides earlier parallel execution.
6. Use `useSuspenseQuery()` for SSR and streaming-compatible component data.
7. Use `useQuery()` for data that intentionally starts on the client.
8. Use TanStack Query as the single cache for server state.
9. Configure `staleTime` according to data freshness requirements.
10. Treat `gcTime` separately from data freshness.
11. Rely on TanStack Start / Router Query integration for SSR hydration and streaming.
12. Invalidate only queries affected by mutations.
13. Include URL search parameters in query keys when they affect returned data.
14. Parallelize independent queries.
15. Preserve ordering for genuinely dependent queries.
16. Prefer measurable performance improvements over speculative prefetching.
17. Validate data-fetching optimizations through experiments and performance measurements.

## 15. State Management

### State Management Philosophy

The application avoids introducing a global client-state management library unless a concrete requirement cannot be solved using the existing state-management mechanisms.

Each type of state should have a clearly defined source of truth.

The application follows this model:

```text
Server State
    ↓
TanStack Query

URL State
    ↓
TanStack Router Search Params

Form State
    ↓
TanStack Form

Form Validation
    ↓
Zod

Local UI State
    ↓
React State
```

The application does not initially use a dedicated global client-state library such as Redux or Zustand.

A shared client-state solution may be introduced later only if a real application requirement cannot be appropriately handled by the existing mechanisms.

---

### Server State

Server state is data that originates from the backend or database and may be shared across multiple components or routes.

TanStack Query is the single source of truth for server state.

Examples include:

- Current user
- Transactions
- Categories
- Budgets
- Dashboard statistics
- Analytics data

The application should not duplicate server state into local React state.

Avoid:

```ts
const search = useSearch({ from: '/_protected/transactions/' })
const { data } = useQuery(transactionsQuery(search))
const [transactions, setTransactions] = useState(data)
```

Instead, components should consume the TanStack Query data directly.

```ts
const search = useSearch({ from: '/_protected/transactions/' })
const { data: transactions } = useQuery(transactionsQuery(search))
```

This avoids synchronization problems between local state and the Query Cache.

---

### URL State

State that should be:

- Shareable
- Bookmarkable
- Preserved by page refresh
- Navigable through browser history
- Represented in the URL

is managed through TanStack Router search parameters.

Examples:

- Search terms
- Filters
- Sorting
- Pagination
- Date ranges
- Selected categories

Example:

```text
/transactions?search=food&category=groceries&sort=date&page=2
```

The URL is the source of truth for these values.

Components should derive their state from the route search parameters rather than maintaining a second independent representation.

When URL state affects server data, the relevant parameters must also be included in the TanStack Query key.

---

### Form State

Form state is managed through TanStack Form.

Implemented forms:

- Transaction create (`/transactions/new`)
- Transaction edit (`/transactions/$transactionId/edit`)

Planned forms (not implemented):

- Category management
- Budget management
- Profile settings

The general flow is:

```text
TanStack Form
    ↓
Zod Validation
    ↓
Mutation
    ↓
Server Function
```

Form state should remain separate from server state.

A form should not copy existing Query data into a global store simply to edit it.

Instead, the form initializes its local values from the query data and manages the editing state independently until submission.

After a successful mutation, affected Query Cache entries are invalidated or updated.

---

### Form Validation

Zod is used as the schema and validation layer for forms.

Validation is performed on the client for immediate user feedback.

Important validation rules are also enforced on the server because client-side validation cannot be trusted as a security boundary.

The same domain-oriented validation rules should be reused where practical to avoid inconsistent validation behaviour.

---

### Local UI State

State that belongs only to a specific component or small UI subtree is managed with React state.

Examples:

- Modal open/closed state
- Drawer state
- Accordion state
- Tabs
- Temporary UI toggles
- Local interaction state
- Animation state

Example:

```ts
const [isOpen, setIsOpen] = useState(false)
```

Local UI state should remain local when there is no requirement for other parts of the application to access it.

---

### Shared Client State

The application does not initially use a global client-state management library.

Before introducing shared client state, the following alternatives should be considered:

1. TanStack Query for server state
2. TanStack Router search params for URL state
3. TanStack Form for form state
4. React local state for component-specific UI state
5. Derived state from existing sources of truth

A dedicated shared client-state solution should only be introduced when state genuinely needs to be shared across unrelated parts of the client application and cannot reasonably belong to one of the existing categories.

This decision may be revisited during implementation if a concrete requirement appears.

---

### Derived State

Derived state should be calculated from existing sources of truth rather than stored separately.

For example, the user's balance should not be stored as an independent client-side state value if it can be derived from transaction data.

Avoid:

```ts
const [balance, setBalance] = useState(0)
```

when the value can be derived from existing server data.

Prefer:

```ts
const balance = calculateBalance(transactions)
```

or obtain the calculated aggregate from the server when doing so is more appropriate for performance or consistency.

Duplicating derived state creates additional synchronization requirements and increases the possibility of stale values.

---

### State Synchronization

The application minimizes manual state synchronization.

The preferred approach is to have one source of truth for each category of state.

Examples:

```text
Server data
    ↓
TanStack Query

Search/filter/pagination
    ↓
URL

Form values
    ↓
TanStack Form

Modal visibility
    ↓
React state
```

When server data changes because of a mutation, TanStack Query invalidation or cache updates are used rather than manually synchronizing multiple React state variables.

---

### State Persistence

State should only be persisted when there is a clear product requirement.

Persistence mechanisms depend on the type of state.

Examples:

- Server state → database
- Shareable navigation state → URL
- Authentication/session state → authentication/session mechanism
- Temporary UI state → React state

Local storage or other browser persistence mechanisms should not be introduced as a general-purpose state-management solution.

Persistent client state should be added only for specific requirements where persistence genuinely improves the user experience.

---

### State Ownership

Every state value should have an identifiable owner.

The following questions should be considered when introducing new state:

1. Does this data come from the server?
   - Use TanStack Query.

2. Does it need to be represented in the URL?
   - Use TanStack Router search params.

3. Is it temporary form input?
   - Use TanStack Form.

4. Is it purely local UI state?
   - Use React state.

5. Is it derived from another source of truth?
   - Calculate it rather than storing it.

6. Does it genuinely need to be shared globally?
   - First verify that the previous mechanisms cannot solve the requirement.

This prevents unnecessary state duplication and reduces synchronization complexity.

---

### State Management Decision Rules

The application follows these general rules:

1. TanStack Query is the source of truth for server state.
2. Server state is not duplicated into React state without a specific reason.
3. TanStack Router search parameters are the source of truth for URL state.
4. TanStack Form owns form state.
5. Zod provides form and input validation.
6. React state manages local UI state.
7. Derived state should be calculated rather than duplicated.
8. Mutations update server state through Server Functions and synchronize affected Query Cache entries through invalidation or cache updates.
9. The application does not initially use a global client-state management library.
10. A shared client-state solution may be introduced later only when a concrete requirement cannot be solved with the existing mechanisms.
11. State should have one clearly identifiable source of truth.
12. State persistence should be introduced only where there is a specific product requirement.

## 16. Performance Strategy

### SSR

### Suspense

### Lazy Loading

### Code Splitting

### startTransition

### React.memo

### Virtualization

---

## 17. UX Strategy

### Navigation

### Forms

### Loading States

### Empty States

### Error States

### Responsive Design

### Accessibility

---

## 18. Testing Strategy

### Functional Testing

### Lighthouse

### React Profiler

### Bundle Analyzer

### Network Analysis

### UX Testing

---

## 19. Measurements

### Lighthouse

### Core Web Vitals

### Bundle Size

### Network Requests

### React Render Time

### User Task Completion Time

---

## 20. Decision Log

| Date | Decision | Reason |

---

## 21. Project Roadmap

Sprint 0

Sprint 1

Sprint 2

Sprint 3

Sprint 4

---

## Open Questions
