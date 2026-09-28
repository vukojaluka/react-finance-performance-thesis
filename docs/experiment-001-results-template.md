# Experiment 001 — Results Template

Blank workbook for formal Experiment 1 measurements.

**Instructions:**

1. Complete metadata before any samples.
2. Pass the preflight checklist in [`experiment-001-measurement-protocol.md`](./experiment-001-measurement-protocol.md) Section 9.
3. Enter one row per **valid tool sample**. Lighthouse, Network, Performance, and React Profiler rows with similar numbers are **not** the same page load.
4. Summarize medians only after all valid samples for a variant/profile/tool are complete.
5. Leave result cells blank or write `N/A` with reason — do not invent values.
6. Do not copy exploratory values from [`measurements.md`](./measurements.md) or from [`experiments.md`](./experiments.md) into this template.
7. Do not copy pilot / preliminary measurement values into this template. That n=3 Lighthouse and Network set lives only on branch `origin/cursor/experiment-001-optimization-results-c674` (commit `0e1accdf8392547b63420e2e40c37e2a3fee102f`) and is summarized in [`experiment-001-results-audit.md`](./experiment-001-results-audit.md). It is not the final dataset.
8. Follow [`measurements/experiment-001/final-measurement-checklist.md`](./measurements/experiment-001/final-measurement-checklist.md) while collecting. Track each required sample in [`measurements/experiment-001/final-measurement-tracker.md`](./measurements/experiment-001/final-measurement-tracker.md). Store files under `docs/measurements/experiment-001/profile-m/` or `profile-d/`, then `variant-v1|v2|v3|v3b/<tool>/<SAMPLE-ID>/`. Network evidence for a final sample is `network.har` plus `notes.md`.

---

## 0. Measurement identity

| Concept                | Meaning                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| Formal measurement run | One cold navigation of one variant under one device profile              |
| Tool evidence          | Lighthouse, Network, Performance, or React Profiler observation of a run |

**Sample counts (per variant per profile):** Lighthouse n=10; Network n=10; Performance n=3; React Profiler n=3.

Do not treat `M-LH-V1-01` and `M-NW-V1-01` as the same page load. Analyze each tool under its own protocol.

**INP:** always `N/A`. Load-only navigation experiment; do not invent an INP value.

**TTI:** informational only if present in Lighthouse JSON (`audits.interactive` or equivalent). Do not enter TTI in median or pairwise tables.

**Primary vs diagnostic:** Lighthouse and Network are primary. Performance and React Profiler are diagnostic.

---

## 1. Session metadata

| Field                                            | Value                                                 |
| ------------------------------------------------ | ----------------------------------------------------- |
| Experimenter                                     |                                                       |
| Date started                                     |                                                       |
| Date completed                                   |                                                       |
| Git commit SHA                                   |                                                       |
| package-lock.json SHA-256                        |                                                       |
| Branch                                           |                                                       |
| Node.js version                                  |                                                       |
| npm version                                      |                                                       |
| Chrome version                                   |                                                       |
| OS + version                                     |                                                       |
| Machine model                                    |                                                       |
| CPU model                                        |                                                       |
| RAM (GB)                                         |                                                       |
| Display resolution + scaling                     |                                                       |
| Server command (session type P)                  | `npm run preview -- --port 3000 --strictPort`         |
| Build command (session type P)                   | `npm run build`                                       |
| Profiling server (session type R)                | `npm run preview:profile -- --port 3000 --strictPort` |
| Profiling build used for Profiler only? (Y/N)    |                                                       |
| Profiling build notes                            |                                                       |
| DevTools custom network profile M (exact values) |                                                       |
| DevTools custom network profile D (exact values) |                                                       |
| Prerequisites P1–P9 complete? (Y/N)              |                                                       |
| Protocol version                                 | experiment-001-measurement-protocol.md                |
| Artifact root path                               | `docs/measurements/experiment-001/`                   |

---

## 2. Validity checklist (per session)

| Check                                                           | M profile | D profile |
| --------------------------------------------------------------- | --------- | --------- |
| Incognito, extensions off                                       | ☐         | ☐         |
| Network: Disable cache (Network samples only)                   | ☐         | ☐         |
| Lighthouse: no extra DevTools throttling                        | ☐         | ☐         |
| Throttling preset/custom profile recorded                       | ☐         | ☐         |
| Viewport matches profile                                        | ☐         | ☐         |
| Production build (not `dev`) for Lighthouse/Network/Performance | ☐         | ☐         |
| Profiling build only for React Profiler                         | ☐         | ☐         |
| Devtools stripped in production build                           | ☐         | ☐         |
| Preview process kept warm (not restarted per sample)            | ☐         | ☐         |
| Latin square session ID (S1–S4)                                 | ☐         | ☐         |

Fixed Latin square (do not randomize unless the protocol is amended):

| Session | Variant order      |
| ------- | ------------------ |
| S1      | V1 → V2 → V3 → V3B |
| S2      | V2 → V3 → V3B → V1 |
| S3      | V3 → V3B → V1 → V2 |
| S4      | V3B → V1 → V2 → V3 |

---

## 3. Fixture and delay manifest

Methodology constants from the implementation. These are not measured results.

| Widget              | Component                  | Visible title       | Query key                                   | Server function         | Delay (ms) | Mock fixture                                                               |
| ------------------- | -------------------------- | ------------------- | ------------------------------------------- | ----------------------- | ---------: | -------------------------------------------------------------------------- |
| Dashboard summary   | `DashboardSummaryWidget`   | Dashboard Summary   | `['experiment-001', 'dashboard-summary']`   | `getDashboardSummary`   |       1000 | inline in `src/experiments/experiment-001/server/get-dashboard-summary.ts` |
| Expense chart       | `ExpenseChartWidget`       | Monthly Trend       | `['experiment-001', 'expense-chart']`       | `getExpenseChart`       |       2500 | inline 6-point series in `get-expense-chart.ts`                            |
| Recent transactions | `RecentTransactionsWidget` | Recent Transactions | `['experiment-001', 'recent-transactions']` | `getRecentTransactions` |       3500 | inline 5 rows in `get-recent-transactions.ts`                              |
| Budgets             | `BudgetsWidget`            | Budgets             | `['experiment-001', 'budgets']`             | `getExperimentBudgets`  |       3000 | inline 3 budgets in `get-budgets.ts`                                       |

Delays are fixed `setTimeout` sleeps with no jitter. The same delays apply to V1, V2, V3, and V3B and do not change between device profiles.

---

## 4. Milestone reference (ms from navigation start)

| ID  | Name                        | `data-exp-milestone`                      | User Timing mark  |
| --- | --------------------------- | ----------------------------------------- | ----------------- |
| A   | Dashboard visible           | `shell`                                   | `exp-milestone-A` |
| B   | Critical content visible    | `summary`                                 | `exp-milestone-B` |
| C   | Chart visible               | `chart`                                   | `exp-milestone-C` |
| D   | Recent transactions visible | `transactions`                            | `exp-milestone-D` |
| E   | Budgets visible             | `budgets`                                 | `exp-milestone-E` |
| F   | Fully completed Dashboard   | B+C+D+E (root `data-exp-complete="true"`) | `exp-milestone-F` |

Primary milestone times: copy User Timing from **Network** samples (n=10) after that navigation. Performance traces (n=3) are diagnostic corroboration only.

---

## 5. Raw samples — Lighthouse (primary)

Each row is an independent Lighthouse Navigation audit. INP is N/A. Optional TTI from JSON belongs in session notes, not in these cells.

### 5.1 Profile M (Mobile)

#### V1 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| M-LH-V1-01 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-02 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-03 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-04 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-05 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-06 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-07 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-08 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-09 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V1-10 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |

#### V2 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| M-LH-V2-01 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-02 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-03 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-04 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-05 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-06 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-07 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-08 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-09 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V2-10 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |

#### V3 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| M-LH-V3-01 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-02 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-03 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-04 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-05 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-06 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-07 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-08 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-09 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3-10 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |

#### V3B (expected n = 10)

| Run         | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ----------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| M-LH-V3B-01 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-02 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-03 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-04 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-05 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-06 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-07 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-08 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-09 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| M-LH-V3B-10 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |

### 5.2 Profile D (Desktop)

#### V1 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| D-LH-V1-01 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-02 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-03 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-04 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-05 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-06 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-07 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-08 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-09 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V1-10 |         |                 | V1      |       |          |          |             |     |         |          | N/A |        |               |

#### V2 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| D-LH-V2-01 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-02 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-03 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-04 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-05 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-06 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-07 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-08 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-09 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V2-10 |         |                 | V2      |       |          |          |             |     |         |          | N/A |        |               |

#### V3 (expected n = 10)

| Run        | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ---------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| D-LH-V3-01 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-02 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-03 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-04 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-05 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-06 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-07 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-08 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-09 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3-10 |         |                 | V3      |       |          |          |             |     |         |          | N/A |        |               |

#### V3B (expected n = 10)

| Run         | Session | Variant order # | Variant | Score | FCP (ms) | LCP (ms) | LCP element | CLS | SI (ms) | TBT (ms) | INP | Valid? | Artifact path |
| ----------- | ------- | --------------- | ------- | ----: | -------: | -------: | ----------- | --: | ------: | -------: | --- | ------ | ------------- |
| D-LH-V3B-01 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-02 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-03 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-04 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-05 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-06 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-07 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-08 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-09 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |
| D-LH-V3B-10 |         |                 | V3B     |       |          |          |             |     |         |          | N/A |        |               |

---

## 6. Raw samples — Network (primary)

Each row is an independent Network recording. Record milestones B–F from **this** navigation’s User Timing marks. SF RPC = browser-visible Server Function requests only. If zero, note “dehydrated/streamed” in N/A notes.

### 6.1 Profile M (Mobile)

#### V1 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| M-NW-V1-01 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-02 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-03 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-04 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-05 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-06 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-07 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-08 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-09 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V1-10 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V2 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| M-NW-V2-01 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-02 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-03 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-04 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-05 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-06 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-07 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-08 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-09 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V2-10 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V3 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| M-NW-V3-01 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-02 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-03 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-04 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-05 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-06 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-07 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-08 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-09 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3-10 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V3B (expected n = 10)

| Run         | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ----------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| M-NW-V3B-01 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-02 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-03 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-04 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-05 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-06 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-07 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-08 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-09 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| M-NW-V3B-10 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

### 6.2 Profile D (Desktop)

#### V1 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| D-NW-V1-01 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-02 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-03 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-04 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-05 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-06 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-07 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-08 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-09 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V1-10 | V1      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V2 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| D-NW-V2-01 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-02 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-03 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-04 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-05 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-06 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-07 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-08 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-09 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V2-10 | V2      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V3 (expected n = 10)

| Run        | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ---------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| D-NW-V3-01 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-02 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-03 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-04 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-05 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-06 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-07 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-08 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-09 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3-10 | V3      |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

#### V3B (expected n = 10)

| Run         | Variant | Total requests | Doc start (ms) | Doc end (ms) | Static assets | SF RPC count | Duplicate SF? | B (ms) | C (ms) | D (ms) | E (ms) | F (ms) | N/A notes | HAR path | Valid? |
| ----------- | ------- | -------------: | -------------: | -----------: | ------------: | -----------: | ------------- | -----: | -----: | -----: | -----: | -----: | --------- | -------- | ------ |
| D-NW-V3B-01 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-02 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-03 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-04 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-05 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-06 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-07 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-08 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-09 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |
| D-NW-V3B-10 | V3B     |                |                |              |               |              |               |        |        |        |        |        |           |          |        |

---

## 7. Raw samples — Performance (diagnostic)

Independent traces. Do not treat these FCP/LCP values as the primary Lighthouse results.

### 7.1 Profile M (Mobile)

#### V1 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| M-PF-V1-01 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V1-02 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V1-03 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V2 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| M-PF-V2-01 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V2-02 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V2-03 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V3 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| M-PF-V3-01 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V3-02 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V3-03 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V3B (expected n = 3)

| Run         | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ----------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| M-PF-V3B-01 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V3B-02 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| M-PF-V3B-03 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

### 7.2 Profile D (Desktop)

#### V1 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| D-PF-V1-01 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V1-02 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V1-03 | V1      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V2 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| D-PF-V2-01 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V2-02 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V2-03 | V2      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V3 (expected n = 3)

| Run        | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ---------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| D-PF-V3-01 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V3-02 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V3-03 | V3      |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

#### V3B (expected n = 3)

| Run         | Variant | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Scripting (ms) | Rendering (ms) | Painting (ms) | Long tasks (n) | Max long task (ms) |   A |   B |   C |   D |   E |   F | Trace path | Valid? |
| ----------- | ------- | -------: | --------: | -------: | -------: | -------------: | -------------: | ------------: | -------------: | -----------------: | --: | --: | --: | --: | --: | --: | ---------- | ------ |
| D-PF-V3B-01 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V3B-02 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |
| D-PF-V3B-03 | V3B     |          |           |          |          |                |                |               |                |                    |     |     |     |     |     |     |            |        |

---

## 8. Raw samples — React DevTools Profiler (diagnostic)

Use session type R (`build:profile` / `preview:profile`) only. Do not copy Lighthouse or Network values from this build into Sections 5–6.

### 8.1 Profile M (Mobile)

#### V1 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| M-RP-V1-01 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V1-02 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V1-03 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V2 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| M-RP-V2-01 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V2-02 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V2-03 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V3 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| M-RP-V3-01 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V3-02 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V3-03 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V3B (expected n = 3)

| Run         | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ----------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| M-RP-V3B-01 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V3B-02 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| M-RP-V3B-03 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

### 8.2 Profile D (Desktop)

#### V1 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| D-RP-V1-01 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V1-02 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V1-03 | V1      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V2 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| D-RP-V2-01 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V2-02 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V2-03 | V2      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V3 (expected n = 3)

| Run        | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ---------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| D-RP-V3-01 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V3-02 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V3-03 | V3      |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

#### V3B (expected n = 3)

| Run         | Variant | Commit count | Max commit (ms) | Top component | Top duration (ms) | Summary widget (ms) | Expense chart (ms) | Transactions (ms) | Budgets (ms) | actualDuration (root) | baseDuration (root) | Duplicate renders? | Export path | Valid? |
| ----------- | ------- | -----------: | --------------: | ------------- | ----------------: | ------------------: | -----------------: | ----------------: | -----------: | --------------------: | ------------------: | ------------------ | ----------- | ------ |
| D-RP-V3B-01 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V3B-02 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |
| D-RP-V3B-03 | V3B     |              |                 |               |                   |                     |                    |                   |              |                       |                     |                    |             |        |

**actualDuration / baseDuration:** export from Profiler JSON if the UI does not display them. Write `N/A — standard production build` if the profiling build was not used.

---

## 9. Excluded samples log

| Run ID | Tool | Profile | Variant | Reason excluded | Replaced by |
| ------ | ---- | ------- | ------- | --------------- | ----------- |
|        |      |         |         |                 |             |

---

## 10. Summary tables — Profile M (Mobile)

Fill after the expected valid samples exist. **Median** is the primary thesis value. Dispersion: Q1, Q3, IQR (plus min, max, sample SD in the appendix). Mean is optional and must not replace the median. Do not report p-values.

### 10.1 Lighthouse medians (expected n = 10)

| Variant |   n | Score median | FCP median | LCP median | CLS median | SI median | TBT median |
| ------- | --: | -----------: | ---------: | ---------: | ---------: | --------: | ---------: |
| V1      |     |              |            |            |            |           |            |
| V2      |     |              |            |            |            |           |            |
| V3      |     |              |            |            |            |           |            |
| V3B     |     |              |            |            |            |           |            |

### 10.2 Milestone medians (ms) — Network-sample User Timing (expected n = 10)

| Variant |   n | B median | C median | D median | E median | F median |
| ------- | --: | -------: | -------: | -------: | -------: | -------: |
| V1      |     |          |          |          |          |          |
| V2      |     |          |          |          |          |          |
| V3      |     |          |          |          |          |          |
| V3B     |     |          |          |          |          |          |

### 10.3 Dispersion (optional appendix) — example for milestone F

Repeat this table for each primary metric reported in the thesis (at least FCP, LCP, CLS, Score, and milestones B–F).

| Variant | F Q1 | F Q3 | F IQR | F min | F max | F sample SD |
| ------- | ---: | ---: | ----: | ----: | ----: | ----------: |
| V1      |      |      |       |       |       |             |
| V2      |      |      |       |       |       |             |
| V3      |      |      |       |       |       |             |
| V3B     |      |      |       |       |       |             |

### 10.4 Profiler medians (diagnostic, expected n = 3)

| Variant |   n | Commits median | Max commit median | Top component (mode) |
| ------- | --: | -------------: | ----------------: | -------------------- |
| V1      |     |                |                   |                      |
| V2      |     |                |                   |                      |
| V3      |     |                |                   |                      |
| V3B     |     |                |                   |                      |

---

## 11. Summary tables — Profile D (Desktop)

### 11.1 Lighthouse medians (expected n = 10)

| Variant |   n | Score median | FCP median | LCP median | CLS median | SI median | TBT median |
| ------- | --: | -----------: | ---------: | ---------: | ---------: | --------: | ---------: |
| V1      |     |              |            |            |            |           |            |
| V2      |     |              |            |            |            |           |            |
| V3      |     |              |            |            |            |           |            |
| V3B     |     |              |            |            |            |           |            |

### 11.2 Milestone medians (ms) (expected n = 10)

| Variant |   n | B median | C median | D median | E median | F median |
| ------- | --: | -------: | -------: | -------: | -------: | -------: |
| V1      |     |          |          |          |          |          |
| V2      |     |          |          |          |          |          |
| V3      |     |          |          |          |          |          |
| V3B     |     |          |          |          |          |          |

### 11.3 Dispersion (optional appendix) — milestone F

| Variant | F Q1 | F Q3 | F IQR | F min | F max | F sample SD |
| ------- | ---: | ---: | ----: | ----: | ----: | ----------: |
| V1      |      |      |       |       |       |             |
| V2      |      |      |       |       |       |             |
| V3      |      |      |       |       |       |             |
| V3B     |      |      |       |       |       |             |

### 11.4 Profiler medians (diagnostic, expected n = 3)

| Variant |   n | Commits median | Max commit median | Top component (mode) |
| ------- | --: | -------------: | ----------------: | -------------------- |
| V1      |     |                |                   |                      |
| V2      |     |                |                   |                      |
| V3      |     |                |                   |                      |
| V3B     |     |                |                   |                      |

---

## 12. Pairwise comparison — V3B vs V3 (numeric table only)

Formulas (leave cells blank until medians exist):

- Δ median = V3B median − V3 median
- Relative change (%) = ((V3B median − V3 median) / V3 median) × 100
- Negative values mean V3B is faster

Do not interpret these numbers as statistical significance. Hypothesis evaluation is Section 13.

### 12.1 Profile M

| Metric      | V3B median | V3 median | Δ median | Relative change (%) |
| ----------- | ---------: | --------: | -------: | ------------------: |
| Milestone B |            |           |          |                     |
| Milestone C |            |           |          |                     |
| Milestone D |            |           |          |                     |
| Milestone E |            |           |          |                     |
| Milestone F |            |           |          |                     |
| LCP         |            |           |          |                     |
| FCP         |            |           |          |                     |

### 12.2 Profile D

| Metric      | V3B median | V3 median | Δ median | Relative change (%) |
| ----------- | ---------: | --------: | -------: | ------------------: |
| Milestone B |            |           |          |                     |
| Milestone C |            |           |          |                     |
| Milestone D |            |           |          |                     |
| Milestone E |            |           |          |                     |
| Milestone F |            |           |          |                     |
| LCP         |            |           |          |                     |
| FCP         |            |           |          |                     |

---

## 13. Hypothesis evaluation

| ID  | Hypothesis                                 | Result (supported / refuted / inconclusive) | Evidence (table §) |
| --- | ------------------------------------------ | ------------------------------------------- | ------------------ |
| H1  | Critical summary blocks SSR appropriately  |                                             |                    |
| H2  | Non-critical widgets do not block SSR      |                                             |                    |
| H3  | V3B faster total completion than V3        |                                             | §12                |
| H4  | No duplicate Server Functions on cold load |                                             | §6 SF RPC          |
| H5  | V1 vs V2 critical vs complete trade-off    |                                             | §10–11             |

---

## 14. Conclusions (draft for thesis)

Fill only after formal samples exist. Do not paste exploratory timings here as if they were measured in this workbook.

### 14.1 Profile M (Mobile)

**Primary findings (Lighthouse + Network milestones):**

**Diagnostic notes (Performance + Profiler):**

### 14.2 Profile D (Desktop)

**Primary findings:**

**Diagnostic notes:**

### 14.3 Limitations encountered

| Limitation | Impact on results |
| ---------- | ----------------- |
|            |                   |

### 14.4 Relation to exploratory `measurements.md`

Compare after formal medians exist. The left column is historical exploratory claims, not values from this workbook.

| Exploratory claim                | Formal result agrees? (Y/N/Partial) | Notes |
| -------------------------------- | ----------------------------------- | ----- |
| V2 ~1.0 s dashboard visible      |                                     |       |
| V3B ~3.5 s full completion       |                                     |       |
| V3 identical to V2               |                                     |       |
| ~1 s V3B gain over late prefetch |                                     |       |

---

## 15. Sign-off

| Role        | Name | Date |
| ----------- | ---- | ---- |
| Measured by |      |      |
| Reviewed by |      |      |
