# Experiment 001 — Measurement Protocol

Formal measurement procedure for the first thesis performance experiment in MyFinance.

This document is the reproducible protocol for comparing TanStack Query loader strategies on the isolated Experiment 001 route. It does **not** contain measured results. Exploratory development-time values remain in [`measurements.md`](./measurements.md).

Related documents:

- [`experiments.md`](./experiments.md) — experiment background and strategy definitions
- [`measurements.md`](./measurements.md) — informal development measurements (not formal thesis evidence)
- [`experiment-001-results-template.md`](./experiment-001-results-template.md) — blank results workbook

---

## 1. Objective

Measure how four TanStack Query route-loader strategies affect Dashboard loading performance and perceived progressive rendering when using TanStack Start SSR, React Suspense, and Server Functions.

The comparison must be reproducible, controlled, and suitable for inclusion in a Master's thesis chapter on performance analysis.

---

## 2. Research question

How do blocking SSR, Suspense baseline loading, late prefetch, and early prefetch strategies differ in:

1. time to first meaningful Dashboard content,
2. time to reveal each independent widget,
3. total Dashboard completion time,
4. duplicate Server Function execution,
5. client rendering cost,

under identical artificial latency and a production-equivalent local build?

---

## 3. Hypothesis

Based on prior exploratory work documented in [`experiments.md`](./experiments.md) and [`measurements.md`](./measurements.md):

- **H1:** Critical Dashboard summary data should block SSR via `ensureQueryData()`.
- **H2:** Non-critical widgets should not block SSR.
- **H3:** Independent non-critical queries started before awaiting the critical query (V3B) reduce total completion time compared with late prefetch (V3) under identical artificial latency.
- **H4:** `useSuspenseQuery()` reuses hydrated or prefetched query state without duplicate Server Function execution on cold navigation.
- **H5:** V1 minimizes progressive rendering but maximizes time-to-first-content; V2 maximizes early critical content at the cost of later total completion.

Formal testing begins only after the implemented prerequisites in Section 6 pass an independent preflight review. Values in `measurements.md` are exploratory and must not be treated as formal thesis results.

---

## 4. Scope

### 4.1 In scope

- Isolated experiment route: `/experiments/experiment-001`
- Four loader variants: **V1**, **V2**, **V3**, **V3B**
- Four experiment widgets (names match the implementation):
  - Dashboard summary — `DashboardSummaryWidget` (critical)
  - Expense chart — `ExpenseChartWidget` (non-critical; visible card title is **Monthly Trend**)
  - Recent transactions — `RecentTransactionsWidget` (non-critical)
  - Budgets — `BudgetsWidget` (non-critical)
- Fixed artificial Server Function delays and deterministic mock data
- Production build served locally (`npm run build` + `npm run preview`)
- Cold-cache navigations only (primary cohort)
- Two device profiles: **Lighthouse Mobile** and **Lighthouse Desktop**
- Tools: Lighthouse, Chrome DevTools Network, Chrome DevTools Performance

### 4.2 Out of scope

- Real authenticated `/dashboard` with Supabase (reserved for later validation, not Experiment 1 primary evidence)
- `npm run dev` / Vite development mode for final thesis measurements
- Warm-cache or TanStack Query cache-behavior comparisons (Experiment 006)
- React `startTransition`, `useTransition`, `useDeferredValue`, `memo`, or other APIs not present in the current architecture
- Netlify deploy-preview measurements unless explicitly added as a secondary validation appendix

### 4.3 Production Dashboard reference

The production Dashboard at [`src/routes/_protected/dashboard.tsx`](../src/routes/_protected/dashboard.tsx) implements the **V3B Early Prefetch** pattern and is **not** the primary measurement surface for Experiment 1. It is documented here only as architectural context.

---

## 5. Terminology crosswalk

| Canonical label            | Loader behavior                                                 | URL variant | Notes                                                    |
| -------------------------- | --------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| **V1** — Blocking SSR      | `await Promise.all([ensureQueryData(...)])` for all widgets     | `v1`        | Blocks SSR until slowest query completes                 |
| **V2** — Suspense Baseline | `await ensureQueryData(summary)` only                           | `v2`        | Non-critical queries start at widget render              |
| **V3** — Late Prefetch     | `await ensureQueryData(summary)` then `void prefetchQuery(...)` | `v3`        | Starts non-critical prefetch only after summary resolves |
| **V3B** — Early Prefetch   | `void prefetchQuery(...)` then `await ensureQueryData(summary)` | `v3b`       | Selected for production Dashboard                        |

**Naming rule for thesis text:** use **V1 / V2 / V3 / V3B** in tables and analysis.

**Implemented URL selector:**

```text
/experiments/experiment-001?variant=v1
/experiments/experiment-001?variant=v2
/experiments/experiment-001?variant=v3
/experiments/experiment-001?variant=v3b
```

The `variant` search parameter is validated with Zod. Missing or invalid values deterministically select `v1`; there is no compile-time strategy selector. The visible label (`Active variant: <code data-exp-variant>`) is the parsed variant and must match the URL after validation (`v3b` stays `v3b`; unknown values display `v1`).

---

## 6. Prerequisites

Do **not** begin formal measurements until all items below are implemented and verified.

| ID  | Prerequisite                                                                             | Current state                                                                 |
| --- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| P1  | URL-based variant selector (`?variant=v1\|v2\|v3\|v3b`)                                  | **Complete** — URL is the source of truth; missing/invalid values select `v1` |
| P2  | V3 Late Prefetch loader branch                                                           | **Complete** — distinct from V3B ordering                                     |
| P3  | Budgets widget + mock server function + query                                            | **Complete** — experiment-only deterministic fixture                          |
| P4  | Fourth artificial delay in `EXPERIMENT_DELAYS`                                           | **Complete** — budgets use **3000 ms**                                        |
| P5  | Four-widget layout parity (summary, chart 2-col + transactions 1-col, budgets)           | **Complete**                                                                  |
| P6  | Deterministic milestone markers (`data-exp-milestone` attributes and `performance.mark`) | **Complete** — A–F use committed-DOM predicates                               |
| P7  | Benchmark logging policy                                                                 | **Complete** — off in standard production; opt-in for diagnostics             |
| P8  | Implementation preflight validation                                                      | **Complete** — smoke checks passed; measurement-day review remains separate   |

---

## 7. Experiment surface and queries

### 7.1 Route

| Property | Value                                   |
| -------- | --------------------------------------- |
| Path     | `/experiments/experiment-001`           |
| Auth     | None (public root child)                |
| Layout   | Minimal `<main>` — no protected sidebar |
| Supabase | Not used                                |

Implementation: [`src/routes/experiments/experiment-001.tsx`](../src/routes/experiments/experiment-001.tsx)

### 7.2 Query inventory

Each variant exercises the same four Server Functions. Query keys below are canonical for Experiment 001. Do not use the production Dashboard keys (`['dashboard', 'monthly-trend']`, etc.) or the stale experiment name `monthly-trend`.

| Widget (thesis)     | Component                  | Visible title       | Query key                                   | Server function         | Artificial delay (ms) | Classification                               |
| ------------------- | -------------------------- | ------------------- | ------------------------------------------- | ----------------------- | --------------------: | -------------------------------------------- |
| Dashboard summary   | `DashboardSummaryWidget`   | Dashboard Summary   | `['experiment-001', 'dashboard-summary']`   | `getDashboardSummary`   |                  1000 | Critical — `ensureQueryData` in all variants |
| Expense chart       | `ExpenseChartWidget`       | Monthly Trend       | `['experiment-001', 'expense-chart']`       | `getExpenseChart`       |                  2500 | Non-critical — Suspense                      |
| Recent transactions | `RecentTransactionsWidget` | Recent Transactions | `['experiment-001', 'recent-transactions']` | `getRecentTransactions` |                  3500 | Non-critical — Suspense                      |
| Budgets             | `BudgetsWidget`            | Budgets             | `['experiment-001', 'budgets']`             | `getExperimentBudgets`  |                  3000 | Non-critical — Suspense                      |

Configured delays: [`src/experiments/experiment-001/lib/experiment-config.ts`](../src/experiments/experiment-001/lib/experiment-config.ts) (`EXPERIMENT_DELAYS`).

**Latency model:** each Server Function awaits a fixed `setTimeout` (`sleep`) for the duration above. There is no random jitter. V1, V2, V3, and V3B use the same delays. Device profiles do not change Server Function sleep duration; they only change how Lighthouse or DevTools simulate network and CPU on the client.

Global Query default: `staleTime: 60_000` ms — [`src/integrations/tanstack-query/root-provider.tsx`](../src/integrations/tanstack-query/root-provider.tsx).

### 7.3 Loader strategies (canonical)

**V1 — Blocking SSR**

```ts
await Promise.all([
  queryClient.ensureQueryData(dashboardSummaryQuery()),
  queryClient.ensureQueryData(expenseChartQuery()),
  queryClient.ensureQueryData(recentTransactionsQuery()),
  queryClient.ensureQueryData(experimentBudgetsQuery()),
])
```

**V2 — Suspense Baseline**

```ts
await queryClient.ensureQueryData(dashboardSummaryQuery())
// chart, transactions, budgets: useSuspenseQuery at widget mount only
```

**V3 — Late Prefetch**

```ts
await queryClient.ensureQueryData(dashboardSummaryQuery())
void queryClient.prefetchQuery(expenseChartQuery())
void queryClient.prefetchQuery(recentTransactionsQuery())
void queryClient.prefetchQuery(experimentBudgetsQuery())
```

**V3B — Early Prefetch**

```ts
void queryClient.prefetchQuery(expenseChartQuery())
void queryClient.prefetchQuery(recentTransactionsQuery())
void queryClient.prefetchQuery(experimentBudgetsQuery())
await queryClient.ensureQueryData(dashboardSummaryQuery())
```

### 7.4 Browser-visible requests (cold navigation)

Expect on a cold hard navigation:

1. **Document** — `GET /experiments/experiment-001?variant=...` (SSR HTML + streamed dehydrated query data)
2. **Static assets** — JS chunks, CSS (`appCss`), fonts (`@fontsource-variable/inter`), favicon
3. **Server Function RPCs** — only if dehydration/cache miss causes client refetch; duplicate detection is a recorded metric

**Important limitation:** With TanStack Router SSR Query integration ([`src/router.tsx`](../src/router.tsx)), non-critical queries prefetched during SSR may **not** appear as separate Network requests. Their completion may be observable only via streamed HTML, Performance User Timing marks, or server logs — not via per-query Network waterfall rows.

Server-side-only observability (terminal during `vite preview`): `[experiment-001]` logs from [`experiment-logger.ts`](../src/experiments/experiment-001/lib/experiment-logger.ts).

Standard production benchmark builds disable these logs. For ordering diagnostics only, build with:

```bash
VITE_EXPERIMENT_001_LOGGING=true npm run build
npm run preview -- --port 3000 --strictPort
```

Do not use that diagnostic build for formal benchmark runs; rebuild with plain `npm run build`.

### 7.5 Requests that must NOT affect Experiment 1

The following exist on production `/dashboard` but are absent from the experiment route:

- `getCurrentUser` / auth guard
- Protected layout assets
- Router intent preload from sidebar links (experiment not in nav)

Disable link hover preloading during manual runs: do not hover navigation links before measuring.

---

## 8. Test environment

### 8.1 Hardware and OS

Record for every session:

| Field           | Requirement                             |
| --------------- | --------------------------------------- |
| Machine model   | Fixed for entire Experiment 1           |
| CPU             | Record model; close other applications  |
| RAM             | Record total                            |
| OS version      | Record exact version                    |
| Power mode      | Plugged in; prevent sleep during runs   |
| Display scaling | 100% recommended; record actual scaling |

### 8.2 Browser

| Field            | Requirement                                 |
| ---------------- | ------------------------------------------- |
| Browser          | Google Chrome (stable channel)              |
| Version          | Record full version string                  |
| Profile          | Incognito window                            |
| Extensions       | Disabled                                    |
| DevTools dock    | Undocked or consistent position across runs |
| Remote debugging | Off                                         |

### 8.3 Application server

| Step    | Command                                                             | Notes                                                                                    |
| ------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Install | `npm ci`                                                            | Use committed `package-lock.json`                                                        |
| Build   | `npm run build`                                                     | Production bundle; TanStack Devtools stripped by default (`removeDevtoolsOnBuild: true`) |
| Serve   | `npm run preview -- --port 3000 --strictPort`                       | TanStack Start `previewServerPlugin` serves SSR + server functions from `dist/server`    |
| Verify  | Open `http://127.0.0.1:3000/experiments/experiment-001?variant=v3b` | Must return SSR HTML, not SPA shell only                                                 |

**Do not use** `npm run dev` for formal thesis measurements.

**Netlify runtime note:** `vite preview` uses the built server bundle locally. It is production-equivalent for bundle and SSR behavior but not identical to Netlify Functions cold-start latency. Document this in thesis limitations.

### 8.4 Supabase

**Not required** for Experiment 1 (mock data only). Do not start local Supabase unless debugging unrelated issues.

### 8.5 Device profiles

Run the **complete measurement matrix twice**: once per profile.

#### Profile M — Lighthouse Mobile (primary)

| Setting            | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| Lighthouse mode    | Navigation                                                            |
| Device             | Mobile (default)                                                      |
| Viewport emulation | 412 × 823, `deviceScaleFactor: 1.75`, `mobile: true`                  |
| Throttling         | Simulated Slow 4G — RTT 150 ms, throughput 1638 Kbps, CPU slowdown 4× |
| Clear storage      | Enabled                                                               |
| Screen             | Host monitor; record host resolution                                  |

#### Profile D — Lighthouse Desktop (primary)

| Setting            | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| Lighthouse mode    | Navigation                                                             |
| Device             | Desktop                                                                |
| Viewport emulation | 1350 × 940, `deviceScaleFactor: 1`, `mobile: false`                    |
| Throttling         | Simulated Dense 4G — RTT 40 ms, throughput 10240 Kbps, CPU slowdown 1× |
| Clear storage      | Enabled                                                                |

#### Lighthouse throttling vs DevTools throttling

These are **not** the same mechanism. Do not apply DevTools Network or CPU throttling during a Lighthouse run (that double-counts delay). Lighthouse Navigation mode applies its own **simulated** throttling from the table above.

Chrome DevTools preset **names** are not numerically identical to Lighthouse simulation:

| Label in this protocol                 | Lighthouse (canonical for Profile M / D)          | Chrome DevTools stock preset (do not treat as identical)                                      |
| -------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Slow 4G (Profile M)                    | Simulated Slow 4G: 150 ms RTT, 1638 Kbps, CPU 4×  | “Slow 4G”: request-level throttle (~1.44 Mbps, ~562.5 ms applied latency / 150 ms target RTT) |
| Dense / Fast 4G-equivalent (Profile D) | Simulated Dense 4G: 40 ms RTT, 10240 Kbps, CPU 1× | “Fast 4G”: ~9 Mbps, 60 ms target RTT — **not** 40 ms / 10240 Kbps                             |

For **Network** and **Performance** samples, set viewport and CPU to the profile table, then use a **custom** DevTools network profile whose numeric targets match the Lighthouse row (Profile M: 1638 Kbps down, 150 ms latency; Profile D: 10240 Kbps down, 40 ms latency). If a custom profile cannot be created, record the exact stock preset name and its displayed numbers in the results template — do not silently substitute a different preset.

| Profile | DevTools viewport                                              | CPU throttle       | Network throttle                                  |
| ------- | -------------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| M       | 412 × 823, `deviceScaleFactor` 1.75 if the emulator exposes it | 4× slowdown        | Custom matching Lighthouse Slow 4G numbers above  |
| D       | 1350 × 940, `deviceScaleFactor` 1                              | No throttling (1×) | Custom matching Lighthouse Dense 4G numbers above |

### 8.6 Cache and process policy

**“Cold-cache”** in this experiment means **browser/client-side** cache state and the TanStack Query cache. It does **not** mean restarting the preview server before every run.

| Layer                           | Formal experiment policy                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Browser HTTP cache              | Cold — DevTools Network **Disable cache**; Empty Cache and Hard Reload; Lighthouse **Clear storage** enabled                                           |
| TanStack Query cache            | Cold — new document navigation per sample; do not reuse a tab that already loaded the experiment within `staleTime` (60 s)                             |
| Server application / mock state | Deterministic inline mocks; no per-user cache on these Server Functions                                                                                |
| Server **process**              | **Warm** — start `vite preview` once per production-build session; do **not** restart Node/preview between Lighthouse, Network, or Performance samples |
| Same built application          | All primary samples use the same `npm run build` output (`dist`) and the same git commit                                                               |
| Same payloads and delays        | Same mock JSON and same `EXPERIMENT_DELAYS` on every variant and both device profiles                                                                  |
| Service worker                  | None in project — verify Application panel shows no controlling SW                                                                                     |
| Warm-cache cohort               | **Not collected** in Experiment 1                                                                                                                      |

---

## 9. Preflight checklist

Complete once per measurement day (or after any build change). Do not record thesis metrics during preflight.

- [ ] `npm ci` succeeds
- [ ] `npm run build` succeeds without errors
- [ ] `npm run preview -- --port 3000 --strictPort` serves the app
- [ ] `/experiments/experiment-001?variant=v1` returns SSR content (View Source shows rendered experiment shell)
- [ ] Each variant URL renders the expected `variant` label (`v1`, `v2`, `v3`, `v3b`)
- [ ] V3 (late prefetch) and V3B (early prefetch) remain distinct loader branches
- [ ] Custom DevTools network profiles for M and D are created or exact stock-preset numbers are recorded
- [ ] TanStack Devtools panel is **not** visible in production build (stripped)
- [ ] Artificial delays produce expected ordering in server logs: summary 1 s, chart 2.5 s, budgets 3 s, transactions 3.5 s
- [ ] No duplicate Server Function log pairs on single cold navigation (V3B smoke test)
- [ ] Milestone markers (`data-exp-milestone` / User Timing) fire in Performance panel
- [ ] Record Chrome version, commit SHA, Node version in results template metadata

---

## 10. Metrics

### 10.1 Formal measurement run vs tool evidence

This protocol distinguishes two things that must not be collapsed:

**A. Formal measurement run**

One **cold navigation** of **one variant** under **one device profile**, on the production build (`dist`). Identity fields: variant URL, profile (M or D), cache policy (HTTP cache cold, Query cache cold, server process warm), and the tool used to observe that navigation.

**B. Tool evidence**

Evidence collected from a run using Lighthouse, Network, or Performance.

Lighthouse and the Performance panel introduce their own reloads and overhead. Therefore:

- Lighthouse runs are **independent** navigation samples.
- Network recordings are **independent** navigation samples.
- Performance recordings are **independent** navigation samples.

Do **not** imply that Lighthouse sample `M-LH-V1-01` and Network sample `M-NW-V1-01` are the same page load. Analyze each tool’s samples under that tool’s procedure and sample size.

| Tool        | Evidence tier  | Valid samples per variant per profile | Build                               |
| ----------- | -------------- | ------------------------------------: | ----------------------------------- |
| Lighthouse  | **Primary**    |                                    10 | `npm run build` / `npm run preview` |
| Network     | **Primary**    |                                    10 | same production preview             |
| Performance | **Diagnostic** |                                     3 | same production preview             |

Milestone User Timing (`exp-milestone-A` … `F`) is created by the page on every navigation. **Primary milestone times** are read from the **Network** samples (n=10) after that navigation completes (Console: `performance.getEntriesByName('exp-milestone-<id>', 'mark')`). Performance traces (n=3) **corroborate** marks and explain scripting/rendering; they are not a substitute for the n=10 Network milestone series.

### 10.2 Evidence tiers

| Tier                     | Tools               | Role in thesis                                              |
| ------------------------ | ------------------- | ----------------------------------------------------------- |
| **Primary quantitative** | Lighthouse, Network | Main comparative evidence; tables and charts                |
| **Diagnostic**           | Performance         | Explain mechanisms; support discussion, not headline scores |

Do not describe Performance traces as primary evidence. Thesis interpretation relies primarily on Lighthouse FCP, LCP, CLS, Performance Score, milestone timing (from Network samples), and Network evidence where browser-visible.

### 10.3 Lighthouse (primary)

Collect per **Lighthouse sample** (independent Navigation audit; not paired with a Network ID):

| Metric                          | Record                 | Role                                                                                                                                                                             |
| ------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance score               | 0–100                  | Primary summary                                                                                                                                                                  |
| First Contentful Paint (FCP)    | ms                     | Primary                                                                                                                                                                          |
| Largest Contentful Paint (LCP)  | ms                     | Primary                                                                                                                                                                          |
| LCP element                     | selector / description | Required — element differs by profile                                                                                                                                            |
| Cumulative Layout Shift (CLS)   | unitless               | Primary                                                                                                                                                                          |
| Speed Index                     | ms                     | Primary (Lighthouse scoring input)                                                                                                                                               |
| Total Blocking Time (TBT)       | ms                     | Secondary                                                                                                                                                                        |
| Time to Interactive (TTI)       | ms                     | **Informational only** (not in Lighthouse score since v10). Record from JSON if present; do not use as a primary claim.                                                          |
| Interaction to Next Paint (INP) | —                      | **N/A** — this is a load-only navigation experiment. Navigation-mode Lighthouse on this URL does not measure INP; no interaction script is in scope. Do not invent an INP value. |

Export: Lighthouse JSON + HTML report per run.

### 10.4 Network (primary)

Collect per **Network sample** (independent cold navigation; not paired with a Lighthouse ID):

| Field                                   | Record                              |
| --------------------------------------- | ----------------------------------- |
| Total request count                     | integer                             |
| Document request start                  | ms from navigation start            |
| Document response end (TTFB + download) | ms                                  |
| Static asset count                      | integer (JS, CSS, font, favicon)    |
| Server Function request count           | integer (browser-visible RPCs only) |
| Duplicate Server Function URLs          | list / count                        |
| Waterfall screenshot or HAR             | file path                           |
| Time to critical summary data           | ms — see milestone B                |
| Time to chart data                      | ms — milestone C                    |
| Time to transactions data               | ms — milestone D                    |
| Time to budgets data                    | ms — milestone E                    |
| Time to all dashboard data              | ms — milestone F                    |

**When per-query Network rows are absent:** record `N/A` for individual widget **RPC** times and still record milestone User Timing from that same Network navigation. If a mark is missing, note the method used in the results template. Performance-panel traces remain diagnostic corroboration (Section 10.6), not the primary n=10 milestone source.

### 10.5 Performance (diagnostic)

Collect per **Performance sample** (independent cold navigation; n=3 per variant per profile). These traces explain _why_ Lighthouse/Network/milestone differences occur. Do not treat Performance FCP/LCP as the primary reported values when Lighthouse values exist.

| Field                                              | Record                      |
| -------------------------------------------------- | --------------------------- |
| Navigation Start                                   | ms (origin)                 |
| DOMContentLoaded                                   | ms from navigation          |
| Load event end                                     | ms from navigation          |
| FCP (trace)                                        | ms                          |
| LCP (trace)                                        | ms                          |
| Scripting time (summary)                           | ms                          |
| Rendering time (summary)                           | ms                          |
| Painting time (summary)                            | ms                          |
| Long tasks                                         | count and max duration (ms) |
| User Timing: `exp-milestone-A` … `exp-milestone-F` | ms from navigation          |
| Gap: last network activity → milestone F           | ms                          |
| Screenshots at A, B, C, D, E, F                    | optional file paths         |

Recording procedure: Performance panel → enable Screenshots → CPU and Network throttling per profile → **Record and reload** → stop after milestone F + 2 s idle.

---

## 11. Milestone definitions

Milestones must be triggered by **deterministic DOM or User Timing conditions**, not visual judgment.

Implementation (P6): the shell and each resolved widget set `data-exp-milestone="<name>"` on stable root elements. An experiment-only DOM observer evaluates the predicates below after **committed** DOM and creates each `performance.mark('exp-milestone-<id>')` **at most once** per observer lifecycle (marks are cleared if the observer effect re-runs). Marks do **not** depend on `EXPERIMENT_DELAYS` or any other fixed timeout.

Stable attribute names: `shell`, `summary`, `chart`, `transactions`, `budgets`. Stable mark names: `exp-milestone-A` … `exp-milestone-F`. The shell root changes `data-exp-complete` from `false` to `true` only when F is satisfied.

| ID    | Name                        | Predicate (all must hold)                                                                                                                                                 |
| ----- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | Dashboard visible           | `document.querySelector('[data-exp-milestone="shell"]')` exists **and** experiment header text visible (`h1` contains `Experiment 001`) **and** variant label matches URL |
| **B** | Critical content visible    | `[data-exp-milestone="summary"]` exists **and** all four KPI values rendered (non-skeleton numeric content) **and** no summary error state                                |
| **C** | Chart visible               | `[data-exp-milestone="chart"]` exists **and** chart SVG/canvas present with ≥ 6 data points **and** chart fallback/skeleton absent                                        |
| **D** | Recent transactions visible | `[data-exp-milestone="transactions"]` exists **and** exactly 5 transaction rows rendered (or explicit empty-state message) **and** transactions fallback absent           |
| **E** | Budgets visible             | `[data-exp-milestone="budgets"]` exists **and** ≥ 1 budget row with progress indicator (or explicit empty-state message) **and** budgets fallback absent                  |
| **F** | Fully completed Dashboard   | Milestones B, C, D, E all satisfied simultaneously **and** no widget error boundaries active **and** no Suspense fallbacks visible                                        |

**Timing rule:** milestone time = `performance.getEntriesByName('exp-milestone-<id>', 'mark')[0].startTime` relative to navigation start, recorded on the **Network** sample (primary, n=10). If a mark is missing on that navigation, exclude the sample or document a fallback method (Performance-trace screenshot + DOM predicate) in the results template.

The current widgets do not emit `data-exp-widget-error` because mocks are deterministic and the experiment route does not mount production `CatchBoundary` widgets. A thrown render error is an invalid sample.

**LCP mapping (informational):** Profile M often marks LCP on summary KPI or header; Profile D may mark chart or summary depending on layout. Always record LCP element separately from milestone B.

---

## 12. Measurement matrix

Record the fields below for **each variant × device profile**, using the sample counts in Section 10.1. Each tool column is a **separate series of navigations**, not one shared page load.

| Variant | Lighthouse (M / D)                         | Network (M / D)                                       | Performance (M / D)                                       |
| ------- | ------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| **V1**  | Score, FCP, LCP, LCP element, CLS, SI, TBT | Request count, doc timing, milestones B–F, duplicates | Nav timing, long tasks, marks A–F, scripting/render/paint |
| **V2**  | Same                                       | Same + note deferred query start vs V1                | Same + Suspense gap between B and C                       |
| **V3**  | Same                                       | Same + prefetch starts after summary complete         | Same + compare C/D/E spacing vs V3B                       |
| **V3B** | Same                                       | Same + prefetch starts before summary await           | Same + compare parallel network/script overlap            |

### 12.1 Primary comparison focus

| Comparison | Primary metrics                                          | Expected direction (hypothesis)                             |
| ---------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| V1 vs V2   | Milestone B (earlier in V2), milestone F (earlier in V1) | V2 faster critical; V1 faster complete                      |
| V2 vs V3   | Milestones C, D, E, F                                    | V3 ≤ V2 on non-critical milestones                          |
| V3 vs V3B  | Milestones C, D, E, F                                    | V3B < V3 on total completion (~1 s under artificial delays) |
| V3B vs V1  | Milestone B vs F trade-off                               | V3B preserves progressive B with near-V1 F                  |

---

## 13. Measurement procedure

All formal samples use one production preview. Do not restart that process between Lighthouse, Network, and Performance samples.

| Session type       | Server                                        | Tools                            | Purpose                                    |
| ------------------ | --------------------------------------------- | -------------------------------- | ------------------------------------------ |
| **P** — production | `npm run preview -- --port 3000 --strictPort` | Lighthouse, Network, Performance | Primary evidence + Performance diagnostics |

### 13.1 Session setup (once per session)

1. Close unrelated applications.
2. Open Chrome Incognito.
3. Start the production preview. Keep that process **warm** for the rest of the session.
4. DevTools → Network → **Disable cache** + **Preserve log** when collecting Network samples. Do **not** leave DevTools throttling on during Lighthouse.
5. Set viewport per active profile (Section 8.5).
6. Record metadata in the results template (Section 16).

### 13.2 Variant order (counterbalanced)

Use a fixed Latin square across sessions to reduce order bias. Do not replace this with a randomized order unless a new methodological note is added to this protocol.

| Session | Variant order      |
| ------- | ------------------ |
| S1      | V1 → V2 → V3 → V3B |
| S2      | V2 → V3 → V3B → V1 |
| S3      | V3 → V3B → V1 → V2 |
| S4      | V3B → V1 → V2 → V3 |

Repeat the square until the **per-tool** sample counts in Section 13.5 are met. Latin square order applies to variant sequence inside a session; it does not bind Lighthouse ID `…-01` to Network ID `…-01`.

Between variants: close the tab, open a new Incognito tab (or clear site data), confirm cold HTTP cache and cold Query cache. Do **not** restart the preview process.

### 13.3 Collection procedure (independent samples)

This is **session ordering**, not a single synchronized page load.

**Session type P (production build)**

1. One discarded warm-up navigation per session (any variant; do not record).
2. **Lighthouse block:** walk the Latin square repeatedly, taking **one** Navigation audit per variant per pass, until n=10 valid audits exist per variant. Each audit is its own cold navigation with Lighthouse Clear storage and **Lighthouse** simulated throttling only.
3. **Network block:** walk the Latin square repeatedly, taking **one** Network recording per variant per pass, until n=10 valid recordings exist per variant. Each recording is its own Empty Cache and Hard Reload with **DevTools** viewport/CPU/network settings from Section 8.5. After milestone F, copy User Timing marks from the Console. Export HAR.
4. **Performance block (diagnostic):** walk the Latin square until n=3 valid Record-and-reload traces exist per variant. Do not treat these IDs as matching Lighthouse or Network rows.

**Do not** run Lighthouse with DevTools throttling also enabled.

### 13.4 Valid sample criteria

A **sample** (one tool, one navigation) is **valid** when:

- Correct variant URL loaded (`?variant=` matches the intended V1/V2/V3/V3B)
- Visible `data-exp-variant` label matches that variant
- Collected on the production build (`npm run build` / `npm run preview`)
- No build/devtools overlay interference
- No manual interaction during load (scroll/hover/click)
- Throttling and viewport match Section 8.5 **for that tool** (Lighthouse simulation vs DevTools custom profile)
- For Network samples: milestones A–F recorded, or the sample is excluded with a reason
- For Lighthouse samples: JSON/HTML exported; INP left as N/A

Invalid samples are excluded and repeated. Do not replace valid samples. Do not require Lighthouse and Network samples to share a navigation.

### 13.5 Repetitions

| Tool        | Valid samples per variant per profile | Warm-up                          |
| ----------- | ------------------------------------: | -------------------------------- |
| Lighthouse  |                                    10 | 1 per type-P session (discarded) |
| Network     |                                    10 | included in type-P warm-up       |
| Performance |                                     3 | 1 per type-P session (discarded) |

**Total primary samples per profile:** 4 variants × 10 = **40 Lighthouse** + **40 Network** → **80 primary samples per profile**, **160** across M + D.

**Total diagnostic samples per profile:** 4 × 3 = **12 Performance** (**24** across M + D).

### 13.6 Statistical summary

For each metric and variant, report **descriptive** statistics only. This experiment does **not** plan inferential tests (no p-values, no significance testing, no confidence intervals unless a later protocol amendment adds them).

| Statistic                         | Use in thesis                                          |
| --------------------------------- | ------------------------------------------------------ |
| **Median**                        | Primary reported value                                 |
| Q1, Q3, IQR                       | Dispersion                                             |
| Min, max                          | Appendix / footnote                                    |
| Sample standard deviation (n ≥ 2) | Appendix                                               |
| Mean                              | Optional; do not use as primary if distribution skewed |

**V3B vs V3 pairwise (hypothesis H3 support is evaluated in a separate results-template section, not in the pairwise numeric table):**

- Δ median = V3B median − V3 median
- Relative change (%) = ((V3B median − V3 median) / V3 median) × 100
- Negative values mean V3B is faster

Compute these for milestones C, D, E, F and for Lighthouse LCP/FCP (and other primary metrics as needed). Do not treat a negative Δ as a statistically significant result.

---

## 14. Data recording

### 14.1 Artifact storage

Store **per tool sample**, not a shared folder that implies one page load for all tools:

```text
docs/measurements/experiment-001/
  profile-m|profile-d/
    variant-v1|v2|v3|v3b/
      lighthouse/
        M-LH-V1-01/
          lighthouse.json
          lighthouse.html
      network/
        M-NW-V1-01/
          network.har
          notes.md              (User Timing marks, N/A reasons)
      performance/
        M-PF-V1-01/
          performance.json
```

### 14.2 Results workbook

Enter summarized values in [`experiment-001-results-template.md`](./experiment-001-results-template.md).

### 14.3 Git commit reference

Record full commit SHA and `package-lock.json` hash in metadata. All formal runs must use the same commit unless a prerequisite fix is committed — then restart affected variant block.

---

## 15. Threats to validity

| Threat                                      | Mitigation                                                                 | Residual risk                                      |
| ------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| Artificial latency vs real backend latency  | Fixed `sleep` only; no Supabase on the experiment route                    | Findings may not transfer to production DB latency |
| Local `vite preview` vs deployed Netlify    | Document environment; optional deploy-preview appendix                     | Cold-start and edge differences                    |
| Browser HTTP cache                          | Disable cache, Incognito, Lighthouse Clear storage                         | Low                                                |
| TanStack Query cache                        | New navigation per sample; avoid repeat within 60 s                        | Medium if protocol violated                        |
| Server process kept warm                    | Intentional; do not restart preview between samples                        | Low for these stateless mocks                      |
| Streaming SSR observability                 | Per-query Network RPC rows may be N/A; record User Timing                  | Medium                                             |
| Lighthouse simulation                       | Fixed M/D presets; never combine with DevTools throttle                    | Scaling imprecision vs real devices                |
| DevTools vs Lighthouse throttle mismatch    | Custom DevTools profiles matching Lighthouse numbers; record actual values | Medium if a stock preset is used instead           |
| CPU thermal throttling                      | Plugged in; rest between sessions                                          | Medium on laptops                                  |
| Background OS / browser processes           | Minimize; record anomalies                                                 | Medium                                             |
| Order effects                               | Latin square S1–S4                                                         | Low                                                |
| Different LCP elements on Mobile vs Desktop | Record LCP element per Lighthouse sample; compare within profile only      | Medium                                             |
| Limited diagnostic sample size              | Performance n=3; do not weigh those traces as primary n=10                 | Medium                                             |
| Prerequisite regression                     | Smoke checks + independent preflight after build changes                   | Low after preflight                                |
| Exploratory results contamination           | Do not merge `measurements.md` values into formal tables                   | Low if protocol followed                           |
| Router intent preload                       | Experiment route not in the production sidebar                             | Low                                                |

---

## 16. Rules for interpreting results

1. **Compare variants only within the same device profile** (M vs M, D vs D). Do not compare Mobile medians to Desktop medians directly.
2. **Primary claims** use Lighthouse + Network medians (including Network-sample milestone times). Performance traces support explanation only.
3. **INP is not reported** (load-only; no interaction script). **TTI is informational only** if present in Lighthouse JSON.
4. If Network shows zero Server Function RPCs, state that dehydration/streaming succeeded — this is evidence for H4, not missing data.
5. If V3 and V2 medians are close and their IQRs overlap, treat V3 as not improving over V2 for that metric. That is a descriptive judgment, not a statistical significance test.
6. V3B improvements on milestone F with preserved milestone B would support selecting early prefetch for production (already implemented on `/dashboard`). Confirm with formal medians before restating exploratory ~1 s claims.
7. Discrepancies between Lighthouse LCP and milestone B must be explained via LCP element identification.
8. Values from [`measurements.md`](./measurements.md) (~3.5 s, ~1.0 s, etc.) are **historical exploratory** — cite separately from formal results. Do not copy them into the results template.
9. Do not overstate generalizability: this is a local production-preview experiment with artificial latency on an isolated route.

---

## 17. Status

| Item                | State                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| Protocol document   | Measurement procedure unchanged                                                  |
| Prerequisites P1–P8 | Implemented                                                                      |
| Formal measurements | Complete: 184 samples in `docs/measurements/experiment-001/`                     |
| Results             | Use [`experiment-001-results-template.md`](./experiment-001-results-template.md) |

---

## 18. Next step

Formal measurements for this protocol are complete. Summarized values belong in the results template.

Do not add `startTransition`, `memo`, or other excluded React APIs.
