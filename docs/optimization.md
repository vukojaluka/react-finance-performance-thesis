# Performance Optimizations

## Rendering

- SSR
- Streaming
- Suspense
- Code Splitting

---

## Data Fetching

- Server Functions
- TanStack Query
- ensureQueryData
- prefetchQuery
- useSuspenseQuery

---

## React

- startTransition
- React.memo
- Lazy Loading

---

## User Experience

- Skeletons
- Optimistic UI
- Progressive Rendering

---

## Bundle Optimization

- Route Code Splitting
- Component Lazy Loading

---

## Measurements

TODO

---

# Rendering Optimization Pattern

For dashboard-style pages containing multiple independent widgets:

1. Start every independent non-critical query immediately using non-awaited `prefetchQuery()`.

2. Await only the critical query using `ensureQueryData()`.

3. Consume all queries using `useSuspenseQuery()`.

4. Wrap each non-critical widget in an independent React Suspense boundary.

This pattern minimizes request waterfalls, preserves progressive rendering and reduced total loading time during Experiment 001.

---

# Query Classification

The application classifies queries into three categories.

---

## Critical Queries

Required for meaningful initial rendering.

Examples:

- Dashboard Summary
- User Session
- User Profile

Strategy:

- await `ensureQueryData()`

---

## Non-Critical Queries

Independent widgets that improve the user experience but are not required for the first meaningful paint.

Examples:

- Charts
- Recent Transactions
- Analytics Widgets

Strategy:

- `void queryClient.prefetchQuery()`
- `useSuspenseQuery()`
- React Suspense

---

## User Initiated Queries

Executed only after explicit user interaction.

Examples:

- Search
- Filters
- Pagination
- Export

Strategy:

- `useQuery()`
- `useMutation()`
