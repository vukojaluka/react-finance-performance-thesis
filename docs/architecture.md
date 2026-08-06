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

### Authentication

### Dashboard

### Transactions

### Categories

### Budgets

### Analytics

---

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

### SSR Pages

### Client Pages

### Suspense Boundaries

### Code Splitting Strategy

### Search Params Strategy

---

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
