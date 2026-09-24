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

Formal Experiment 001 measurements for TanStack Query loader strategies on
`/experiments/experiment-001`. Protocol:
[`experiment-001-measurement-protocol.md`](./experiment-001-measurement-protocol.md).
Raw samples: [`measurements/experiment-001/`](./measurements/experiment-001/).

Exploratory development timings in [`measurements.md`](./measurements.md) are
not formal thesis evidence.

### Session metadata

| Field | Value |
| --- | --- |
| Date | 2026-09-24 |
| Commit | `643de69` (`test/performance-experiment-001`) |
| Build | `npm run build` + `npm run preview -- --port 3000 --strictPort` |
| Node | v22.14.0 |
| Chrome | 148.0.7778.96 (headless) |
| Host | Linux x86_64, 4 vCPU, 16 GiB RAM |
| Sample size | **n = 3** Lighthouse + Network per variant × profile (protocol target is n = 10; reduced for this automated session) |
| Variants | V1 Blocking SSR, V2 Suspense Baseline, V3 Late Prefetch, V3B Early Prefetch |
| Artificial delays | Summary 1000 ms, Chart 2500 ms, Budgets 3000 ms, Transactions 3500 ms |

### Tools

| Tool | Role | What was collected |
| --- | --- | --- |
| Lighthouse Navigation | Primary | Performance score, FCP, LCP, CLS, Speed Index, TBT |
| Chrome DevTools Network (Puppeteer/CDP) | Primary | Request counts, Server Function visibility, User Timing milestones A–F |
| Unthrottled cold navigation | Diagnostic | Milestone completion under artificial delays only |

Profiles match the protocol:

- **M (Mobile):** simulated Slow 4G — 150 ms RTT, 1638 Kbps, CPU 4×
- **D (Desktop):** simulated Dense 4G — 40 ms RTT, 10240 Kbps, CPU 1×

### Lighthouse results (mean of n = 3)

#### Profile M — Mobile

| Variant | Score | FCP (ms) | LCP (ms) | SI (ms) | TBT (ms) | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| V1 Blocking SSR | 78 | 3449 | 3449 | **6879** | 43 | 0 |
| V2 Suspense Baseline | 85 | 3058 | 3058 | 5127 | 33 | 0 |
| V3 Late Prefetch | 87 | 2807 | 2807 | 5108 | 51 | 0 |
| **V3B Early Prefetch** | 85 | 3208 | 3208 | **4362** | 36 | 0 |

#### Profile D — Desktop

| Variant | Score | FCP (ms) | LCP (ms) | SI (ms) | TBT (ms) | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| V1 Blocking SSR | 93 | 768 | 781 | **2591** | 0 | 0 |
| V2 Suspense Baseline | 94 | 758 | 758 | 2288 | 0 | 0 |
| V3 Late Prefetch | 94 | 787 | 800 | 2304 | 0 | 0 |
| **V3B Early Prefetch** | **95** | 820 | 880 | **1890** | 0 | 0 |

**Speed Index** is the clearest Lighthouse signal for progressive dashboard
completion. V3B is fastest on both profiles (Mobile −2517 ms vs V1; Desktop
−701 ms vs V1). V2 and V3 are nearly identical on SI, confirming late prefetch
does not beat the Suspense baseline.

FCP/LCP on this route are often the same element (critical summary / shell) and
do not alone distinguish progressive secondary widgets; SI does.

### Network and milestone results

#### Completion time (mean milestone F, ms from navigation start)

| Variant | Mobile (throttled) | Desktop (throttled) | Unthrottled |
| --- | ---: | ---: | ---: |
| V1 | 6338 | 4113 | 3695 |
| V2 | 7370 | 5113 | 4694 |
| V3 | 7384 | 5114 | 4696 |
| **V3B** | **6347** | **4107** | **3696** |

Observed pattern (matches Experiment 001 hypothesis):

- **V1 and V3B** finish together (~3.5–4.1 s unthrottled / desktop), because all
  Server Functions start in parallel. V1 blocks SSR on the slowest query; V3B
  only blocks on the critical summary while non-critical work continues.
- **V2 and V3** finish ~1 s later (~4.7 / 5.1 s), because non-critical work
  starts only after the critical summary resolves (waterfall).
- Browser-visible Server Function RPC count was **0–1** per navigation. With
  TanStack Router SSR Query dehydration, widget data is mostly delivered in the
  SSR/streamed document rather than as separate client RPCs. Per-query Network
  waterfall rows are therefore often **N/A**; milestones and Lighthouse SI are
  the reliable comparative signals.

Client User Timing marks A–E often collapse to the same timestamp once JS
hydrates and the milestone observer runs against an already-complete DOM. They
remain useful for **total completion (F)** comparisons, not for fine-grained
progressive paint order. Progressive paint is evidenced by **Speed Index**.

### Interpretation for the production Dashboard

| Strategy | Early critical content | Total completion | Progressive paint (SI) | Selected? |
| --- | --- | --- | --- | --- |
| V1 | No (blocks on slowest) | Fast | Worst | No |
| V2 | Yes | Slow (+~1 s) | Better | No |
| V3 | Yes | Slow (+~1 s) | ≈ V2 | No |
| **V3B** | Yes | Fast (≈ V1) | **Best** | **Yes** |

Selected production pattern (also documented below): start non-critical
`prefetchQuery()` calls immediately, await only critical `ensureQueryData()`,
consume with `useSuspenseQuery()`, wrap non-critical widgets in independent
Suspense boundaries.

### Limitations

- Sample size n = 3 (protocol target n = 10). Means are indicative; widen before
  final thesis tables if variance matters.
- `vite preview` is production-equivalent for bundle/SSR behavior, not Netlify
  cold-start latency.
- Headless Chrome on a cloud VM; absolute ms values are host-specific.
- React DevTools Profiler (profiling build) was not part of this session.

---

# Rendering Optimization Pattern

For dashboard-style pages containing multiple independent widgets:

1. Start every independent non-critical query immediately using non-awaited `prefetchQuery()`.

2. Await only the critical query using `ensureQueryData()`.

3. Consume all queries using `useSuspenseQuery()`.

4. Wrap each non-critical widget in an independent React Suspense boundary.

This pattern minimizes request waterfalls, preserves progressive rendering and
reduced total loading time during Experiment 001 (V3B Early Prefetch).

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
