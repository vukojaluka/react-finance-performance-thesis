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

| Column | Type | Nullable | Default | Description |
|---------|------|----------|---------|-------------|
| id | UUID | No | - | References auth.users.id |
| first_name | TEXT | No | - | User first name |
| last_name | TEXT | No | - | User last name |
| created_at | TIMESTAMPTZ | No | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | NOW() | Last update timestamp |

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

| Column | Type | Nullable | Default | Description |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Transaction identifier |
| user_id | UUID | No | - | Profile owner |
| category_id | UUID | No | - | Transaction category |
| title | TEXT | No | - | Transaction title |
| amount | NUMERIC(12,2) | No | - | Transaction amount |
| type | transaction_type | No | - | Income or expense |
| transaction_date | DATE | No | CURRENT_DATE | Transaction date |
| note | TEXT | Yes | NULL | Optional note |
| created_at | TIMESTAMPTZ | No | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | NOW() | Last update timestamp |

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

| Column | Type | Nullable | Default | Description |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Category identifier |
| user_id | UUID | No | - | Profile owner |
| name | TEXT | No | - | Category name |
| color | TEXT | No | - | Color used in charts and dashboard |
| created_at | TIMESTAMPTZ | No | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | NOW() | Last update timestamp |

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

| Column | Type | Nullable | Default | Description |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Budget identifier |
| user_id | UUID | No | - | Profile owner |
| category_id | UUID | No | - | Budget category |
| amount | NUMERIC(12,2) | No | - | Budget amount |
| month | SMALLINT | No | - | Month (1-12) |
| year | SMALLINT | No | - | Year |
| created_at | TIMESTAMPTZ | No | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | NOW() | Last update timestamp |

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
- `updated_at` will be automatically maintained using a PostgreSQL trigger

---

### Row Level Security (RLS)

All application tables use PostgreSQL Row Level Security.

Policies ensure that authenticated users can only:

- Read their own data
- Create their own data
- Update their own data
- Delete their own data

---

### Seed Data

Development seed scripts will generate:

- Default transaction categories
- Demo budgets
- Demo transactions

Seed data will be used during development, testing and performance measurements.

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

Main Features

Rendering Strategy

Performance Notes

---

### Transactions

Purpose

Main Features

Rendering Strategy

Performance Notes

---

### Analytics

Purpose

Main Features

Rendering Strategy

Performance Notes

---

### Settings

Purpose

Main Features

Rendering Strategy

Performance Notes

---

## 10. Features

### Authentication

Description

Business Value

Thesis Value

Priority

---

### Dashboard

Description

Business Value

Thesis Value

Priority

---

### Transactions

Description

Business Value

Thesis Value

Priority

---

### Analytics

Description

Business Value

Thesis Value

Priority

---

### Categories

Description

Business Value

Thesis Value

Priority

---

### Budgets

Description

Business Value

Thesis Value

Priority

---

### Settings

Description

Business Value

Thesis Value

Priority

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
└── transactions/
    ├── server/
    │   ├── get-transactions.ts
    │   ├── get-transaction.ts
    │   ├── create-transaction.ts
    │   ├── update-transaction.ts
    │   └── delete-transaction.ts
```

Server Functions return typed domain data rather than exposing raw database responses.

---

### Naming Conventions

Read operations use the `get` prefix:

- `getDashboardSummary()`
- `getExpenseChart()`
- `getRecentTransactions()`
- `getTransactions()`
- `getTransaction()`
- `getCategories()`
- `getBudgets()`

Mutation operations use:

- `create...`
- `update...`
- `delete...`

Examples:

- `createTransaction()`
- `updateTransaction()`
- `deleteTransaction()`
- `createCategory()`
- `updateCategory()`
- `deleteCategory()`
- `createBudget()`
- `updateBudget()`
- `deleteBudget()`

The `fetch` prefix is not used for Server Function naming.

---

### Query Pattern

Read operations use TanStack Query.

Each feature defines reusable query option factories using `queryOptions()`.

Example:

```ts
export function transactionsQuery() {
  return queryOptions({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
  })
}
```

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

Example affected queries after creating a transaction may include:

- `transactions`
- `dashboard-summary`
- `expense-chart`

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

Authentication is handled through the application's authentication provider.

Server Functions determine the authenticated user from the server-side session rather than accepting a client-provided `userId` as the source of truth.

Business operations are performed in the context of the authenticated user.

The authentication implementation and session handling are defined separately from individual feature Server Functions.

---

### Authorization

Authorization is enforced at the server and database layers.

The application uses database-level Row Level Security (RLS) to ensure that users can only access records they are authorized to access.

The general security model is:

Server Function
↓
Authenticated User
↓
Supabase
↓
Row Level Security
↓
User-owned Data

Client-provided identifiers must never be trusted to determine ownership of protected resources.

The final RLS policies will be defined during Supabase database implementation.

---

### Error Handling

Server Functions return typed data for successful operations.

Expected failures are represented using appropriate application errors, such as:

- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Database errors

TanStack Query is responsible for exposing query and mutation errors to the UI.

The UI provides appropriate loading, empty and error states rather than requiring every Server Function response to use a custom `{ success, error }` wrapper.

---

### Response Design

Server Functions return application-level typed data rather than raw Supabase responses.

Example:

```ts
return {
  id,
  amount,
  type,
  description,
  category,
  transactionDate,
}
```

Database-specific response objects should not unnecessarily leak into the client application.

This keeps the client-side domain model decoupled from the database implementation.

---

### Authentication API

Authentication-related Server Functions may include:

- `getCurrentUser()`
- `login()`
- `register()`
- `logout()`

Authentication functionality is kept separate from business-domain operations.

---

### Dashboard API

Dashboard Server Functions provide aggregated data required by dashboard widgets.

Initial operations include:

- `getDashboardSummary()`
- `getExpenseChart()`
- `getRecentTransactions()`

Dashboard queries may use different rendering priorities.

Critical dashboard data may use `ensureQueryData()` in the Route Loader.

Independent non-critical widgets may use non-awaited `prefetchQuery()` and `useSuspenseQuery()`.

---

### Transactions API

Transactions provide full CRUD functionality.

Operations:

- `getTransactions()`
- `getTransaction()`
- `createTransaction()`
- `updateTransaction()`
- `deleteTransaction()`

Transactions are owned by the authenticated user.

Queries may support:

- Search
- Filtering
- Sorting
- Pagination

Query parameters are represented through TanStack Router URL search parameters where appropriate.

---

### Categories API

Categories provide CRUD functionality for user-defined transaction categories.

Operations:

- `getCategories()`
- `getCategory()`
- `createCategory()`
- `updateCategory()`
- `deleteCategory()`

Categories are owned by the authenticated user.

Categories may be referenced by transactions and budgets.

---

### Budgets API

Budgets provide CRUD functionality for category-based monthly budgets.

Operations:

- `getBudgets()`
- `getBudget()`
- `createBudget()`
- `updateBudget()`
- `deleteBudget()`

Budgets are associated with the authenticated user and a transaction category.

---

### Analytics API

Analytics provides read-only aggregated financial data.

Potential operations include:

- `getExpenseBreakdown()`
- `getIncomeExpenseTrend()`
- `getCategorySpending()`

The exact analytics operations will be defined together with the Analytics page requirements.

Analytics operations should return aggregated domain data rather than raw transaction records whenever possible.

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
10. Authorization is enforced through server checks and database RLS.
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
│   └── ui/
│
├── experiments/
│
├── features/
│   ├── analytics/
│   ├── auth/
│   ├── budgets/
│   ├── categories/
│   ├── dashboard/
│   ├── settings/
│   └── transactions/
│
├── integrations/
│
├── lib/
│   ├── constants/
│   ├── hooks/
│   ├── utils/
│   └── validation/
│
└── routes/
```

Global components are stored inside `components/ui`.

Business logic is organized by feature.

Each feature owns its own components, queries, server functions, schemas and utilities.

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
- transactionsQuery()
- categoriesQuery()
- analyticsQuery()

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

---

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
- Transactions
- Analytics

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
<Suspense fallback={<ChartSkeleton />}>
  <ExpenseChart />
</Suspense>

<Suspense fallback={<TransactionsSkeleton />}>
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
            ├── Chart Suspense
            │
            └── Transactions Suspense
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
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(expenseChartQuery())
    void context.queryClient.prefetchQuery(recentTransactionsQuery())

    await context.queryClient.ensureQueryData(
      dashboardSummaryQuery(),
    )
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
<Suspense fallback={<ChartSkeleton />}>
  <ExpenseChart />
</Suspense>

<Suspense fallback={<TransactionsSkeleton />}>
  <RecentTransactions />
</Suspense>
```

This pattern is the preferred rendering strategy established by Experiment 001 for pages containing independent critical and non-critical data.

## 14. Data Fetching Strategy

### Server Functions

### TanStack Query

### Cache Strategy

### Prefetching

### Revalidation

---

## 15. State Management

### Server State

### Client State

### URL State

### Form State

---

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
