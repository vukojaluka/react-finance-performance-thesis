# Experiments

This document contains implementation experiments performed during the development of the application.

Each experiment evaluates a specific rendering strategy, data fetching strategy or performance optimization used throughout the project.

The goal is to validate architectural decisions using measurable results instead of assumptions.

---

# Experiment Template

## Goal

Describe what is being tested.

---

## Background

Why is this experiment important?

---

## Hypothesis

Expected outcome before implementation.

---

## Implementation

Describe how the experiment is implemented.

---

## Measurements

Metrics to collect.

- Lighthouse
- Core Web Vitals
- React Profiler
- Network Waterfall
- Bundle Size
- User Experience

---

## Results

Measured values.

---

## Conclusion

Was the hypothesis correct?

---

# Experiment 001

## Title

TanStack Query Rendering Strategies

## Goal

Evaluate different Route Loader rendering strategies using TanStack Query and React Suspense.

Determine how critical and non-critical queries should be started in order to minimize perceived loading time while avoiding duplicate Server Function execution.

---

## Background

TanStack Query allows Route Loaders to populate the Query Cache before hydration using `ensureQueryData()` or `prefetchQuery()`.

React Suspense can then consume the same query using `useSuspenseQuery()`.

This experiment evaluates four different strategies for combining those APIs.

---

## Hypothesis

- Critical data should block SSR.
- Non-critical data should not block SSR.
- Independent non-critical queries should be started as early as possible.
- `useSuspenseQuery()` should reuse existing query state instead of executing duplicate Server Functions.

---

## Implementation

Location:

`src/experiments/experiment-001`

The isolated route selects its strategy from the URL:

- `/experiments/experiment-001?variant=v1`
- `/experiments/experiment-001?variant=v2`
- `/experiments/experiment-001?variant=v3`
- `/experiments/experiment-001?variant=v3b`

Canonical thesis labels: **V1 / V2 / V3 / V3B**. Missing or invalid `variant` values deterministically select **V1**. The visible page label (`Active variant`) is the parsed variant.

This route is a public, unauthenticated child of the root route. It does **not** use the protected layout or Supabase. The production Dashboard at `/dashboard` is a separate surface: it implements the **V3B Early Prefetch** pattern with live `['dashboard', …]` queries (including `['dashboard', 'monthly-trend']`) and is **not** the Experiment 001 measurement target.

Artificial delays (fixed `setTimeout`, no jitter; identical for V1/V2/V3/V3B; not varied by device profile):

- Dashboard Summary — 1000ms — `getDashboardSummary`
- Expense Chart — 2500ms — `getExpenseChart` (visible card title: **Monthly Trend**)
- Budgets — 3000ms — `getExperimentBudgets`
- Recent Transactions — 3500ms — `getRecentTransactions`

Canonical query keys:

- Summary: `['experiment-001', 'dashboard-summary']` — `DashboardSummaryWidget`
- Chart: `['experiment-001', 'expense-chart']` — `ExpenseChartWidget`
- Transactions: `['experiment-001', 'recent-transactions']` — `RecentTransactionsWidget`
- Budgets: `['experiment-001', 'budgets']` — `BudgetsWidget`

Do not use the stale experiment key `monthly-trend`. That name remains only on the production Dashboard query `['dashboard', 'monthly-trend']`.

All queries use:

- `staleTime: 1 minute`

to eliminate automatic refetches after hydration.

---

## Rendering Strategies

### Version 1 — Blocking SSR

```ts
await Promise.all([
  ensureQueryData(summary),
  ensureQueryData(chart),
  ensureQueryData(transactions),
  ensureQueryData(budgets),
])
```

Characteristics:

- blocks SSR
- all queries execute in parallel
- no Suspense fallbacks

---

### Version 2 — Suspense Baseline

```ts
await ensureQueryData(summary)
```

Chart, Transactions and Budgets start only when rendered through `useSuspenseQuery()`.

Characteristics:

- dashboard visible earlier
- progressive rendering
- non-critical queries begin after loader completion

---

### Version 3 — Late Prefetch (not selected for production)

```ts
await ensureQueryData(summary)

void prefetchQuery(chart)
void prefetchQuery(transactions)
void prefetchQuery(budgets)
```

Characteristics:

- non-blocking prefetch
- however query execution still begins after the critical query finishes

Measured result (exploratory development observation, not a formal thesis measurement):

No meaningful improvement compared to Version 2.

Note:

This intermediate implementation was evaluated during exploratory development but was not selected for the final application architecture because it produced no measurable improvement over Version 2. It remains available on the isolated experiment route for the formal comparison.

---

### Version 3B — Early Prefetch

```ts
void prefetchQuery(chart)
void prefetchQuery(transactions)
void prefetchQuery(budgets)

await ensureQueryData(summary)
```

Characteristics:

- all Server Functions begin immediately
- only critical query blocks SSR
- non-critical queries execute in parallel while critical content loads

Measured result (exploratory development observation, not a formal thesis measurement):

Approximately one second faster total page completion under identical artificial latency.

---

## Measurements

Exploratory development observations remain in [`measurements.md`](./measurements.md).

Formal collection follows [`experiment-001-measurement-protocol.md`](./experiment-001-measurement-protocol.md).
A first formal session (2026-09-24, commit `643de69`, **n = 3** per variant × profile) is recorded in:

- [`optimization.md`](./optimization.md#measurements) — narrative + tables
- [`experiment-001-results.md`](./experiment-001-results.md) — aggregate workbook
- [`measurements/experiment-001/`](./measurements/experiment-001/) — Lighthouse JSON + Network samples

Protocol target remains n = 10; the recorded session used n = 3 for automation. Widen samples before final thesis tables if needed.

Formal protocol (summary only — the protocol document is authoritative):

- Primary evidence: Lighthouse and Network (User Timing milestones)
- Diagnostic evidence: Performance and React DevTools Profiler (profiling build)
- Device profiles: Lighthouse Mobile (M) and Lighthouse Desktop (D)
- Cold client caches; warm preview process
- INP is N/A (load-only); TTI is informational only

---

## Results

Exploratory (development-time):

| Strategy   | Initial Content | Total Completion | Notes                 |
| ---------- | --------------- | ---------------- | --------------------- |
| Version 1  | Slow            | ~3.5s            | Blocking SSR          |
| Version 2  | Fast            | ~4.5s            | Progressive rendering |
| Version 3  | Fast            | ~4.5s            | Late Prefetch ≈ V2    |
| Version 3B | Fast            | ~3.5s            | Early Prefetch        |

Formal session headline (means, n = 3):

| Metric | V1 | V2 | V3 | V3B |
| --- | ---: | ---: | ---: | ---: |
| Lighthouse SI Mobile (ms) | 6879 | 5127 | 5108 | **4362** |
| Lighthouse SI Desktop (ms) | 2591 | 2288 | 2304 | **1890** |
| Unthrottled milestone F (ms) | 3695 | 4694 | 4696 | **3696** |
| Lighthouse score Desktop | 93 | 94 | 94 | **95** |

V3 matched V2 on completion and Speed Index. V3B matched V1 on total completion while winning Speed Index on both profiles.

---

## Conclusion

Version 1 provides the simplest implementation but blocks SSR until every query finishes and has the worst Speed Index.

Version 2 improves progressive paint (better SI) by revealing critical content first, but total completion is ~1 s slower because non-critical queries start late.

Late Prefetch (V3) produced no meaningful improvement over Version 2.

Early Prefetch (V3B) produced the best overall result: V1-like total completion with the best Speed Index (Mobile and Desktop).

Starting independent non-critical queries before awaiting the critical query removes the non-critical waterfall while preserving progressive rendering. Under SSR Query dehydration, separate browser Server Function RPCs were largely absent; SI and milestone F are the reliable comparative signals.

This rendering strategy remains selected for the production Dashboard (`/dashboard`).

---

## Status

Formal measurement session recorded (n = 3). Optional follow-up: expand to protocol n = 10 and add Performance / React Profiler diagnostics.

---

# Experiment 002

## Title

Blocking SSR vs Streaming SSR

Status

Planned

---

# Experiment 003

## Title

ensureQueryData vs prefetchQuery

Status

Planned

---

# Experiment 004

## Title

Route Code Splitting

Status

Planned

---

# Experiment 005

## Title

Suspense Boundary Placement

Status

Planned

---

# Experiment 006

## Title

TanStack Query Cache Behaviour

Status

Planned

---

# Experiment 007

## Title

React startTransition

Status

Planned

---

# Experiment 008

## Title

Transaction List Virtualization

Status

Planned

---

# Experiment 009

## Title

Bundle Size Analysis

Status

Planned

---

# Experiment 010

## Title

Lighthouse Performance Comparison

Status

Planned
