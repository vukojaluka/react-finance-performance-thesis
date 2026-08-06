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

Artificial delays:

- Dashboard Summary — 1000ms
- Expense Chart — 2500ms
- Recent Transactions — 3500ms

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

Chart and Transactions start only when rendered through `useSuspenseQuery()`.

Characteristics:

- dashboard visible earlier
- progressive rendering
- non-critical queries begin after loader completion

---

### Version 3 (Discarded) — Late Prefetch

```ts
await ensureQueryData(summary)

void prefetchQuery(chart)
void prefetchQuery(transactions)
```

Characteristics:

- non-blocking prefetch
- however query execution still begins after the critical query finishes

Measured result:

No meaningful improvement compared to Version 2.

Note:

This intermediate implementation was evaluated during the experiment but was not selected for the final application architecture because it produced no measurable improvement over Version 2.

---

### Version 3 — Early Prefetch

```ts
void prefetchQuery(chart)
void prefetchQuery(transactions)

await ensureQueryData(summary)
```

Characteristics:

- all Server Functions begin immediately
- only critical query blocks SSR
- non-critical queries execute in parallel while critical content loads

Measured result:

Approximately one second faster total page completion under identical artificial latency.

---

## Measurements

Collected:

- Server Function execution count
- Server Function execution order
- Loader duration
- Browser Network waterfall
- React Suspense reveal order
- Duplicate Server Function executions
- User perceived loading

---

## Results

| Strategy | Initial Content | Total Completion | Notes |
|----------|----------------|-----------------|-------|
| Version 1 | Slow | ~3.5s | Blocking SSR |
| Version 2 | Fast | ~4.5s | Progressive rendering |
| Version 3 | Fast | ~3.5s | Early Prefetch |

An additional Late Prefetch strategy was evaluated during the experiment but was excluded from the final architecture because it behaved identically to Version 2.

---

## Conclusion

Version 1 provides the simplest implementation but blocks SSR until every query finishes.

Version 2 significantly improves perceived performance by rendering critical content first while progressively revealing secondary widgets.

An intermediate Late Prefetch strategy was also evaluated but produced no measurable improvement over Version 2.

The final Early Prefetch strategy produced the best overall result.

Starting independent non-critical queries before awaiting the critical query reduced total loading time by approximately one second while preserving progressive rendering and avoiding duplicate Server Function executions.

This rendering strategy was selected for the final application architecture.

---

## Status

Completed

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
