# Experiment 001

## Environment

- TanStack Start
- TanStack Query
- React Suspense
- Artificial Server Function delays
- staleTime: 1 minute

---

## Measured Results

| Strategy | Dashboard Visible | Chart Visible | Transactions Visible | Full Completion |
|----------|------------------:|--------------:|---------------------:|----------------:|
| Version 1 | ~3.5s | ~3.5s | ~3.5s | ~3.5s |
| Version 2 | ~1.0s | ~2.5s | ~3.5s | ~4.5s |
| Version 3 | ~1.0s | ~2.5s | ~3.5s | ~3.5s |

During development an intermediate "Late Prefetch" strategy was also evaluated.

It showed identical behaviour to Version 2 and therefore was not selected as the final rendering strategy.

---

## Observations

- `ensureQueryData()` executes queries in parallel when awaited together.
- `useSuspenseQuery()` reused hydrated queries without duplicate Server Function execution.
- Using `staleTime: 1 minute` prevented immediate background refetches after hydration.
- Starting independent `prefetchQuery()` calls before awaiting the critical query reduced overall completion time by approximately one second.
