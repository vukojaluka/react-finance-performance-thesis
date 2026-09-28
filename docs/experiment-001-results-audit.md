# Experiment 001 — Measurement Results Audit

Audit and consolidation of **already collected** Experiment 001 evidence. This document does **not** add new measurements, does **not** change the measurement protocol, and does **not** compute final thesis statistics (median, Q1/Q3, IQR, SD, pairwise V3B vs V3).

Raw artifacts are the source of truth. Values that cannot be traced to a readable artifact are marked missing / N/A.

---

## A. Audit status

| Field                                               | Value                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| Audit date/time                                     | 2026-09-28 (local, CEST)                                              |
| Current git branch                                  | `test/performance-experiment-001`                                     |
| Current HEAD                                        | `643de696b06169326dfdaefe8e391ea965b5d9f4`                            |
| Tracking remote                                     | `origin/test/performance-experiment-001`                              |
| Working tree `docs/measurements/experiment-001/`    | **Absent**                                                            |
| Working tree `docs/experiment-001-results.md`       | **Absent**                                                            |
| Working tree `scripts/measure-experiment-001.mjs`   | **Absent** (empty `scripts/` directory)                               |
| Results workbook on current branch                  | `docs/experiment-001-results-template.md` — blank (no measured cells) |
| Current `docs/experiments.md` status line           | Formal measurements not started                                       |
| Current `docs/optimization.md` Measurements section | `TODO`                                                                |

### Where the measurements actually live

All raw Lighthouse/Network JSON, the session summary, the unthrottled extra series, the measurement harness, and the filled `docs/experiment-001-results.md` / `docs/optimization.md` tables exist **only** on:

| Field          | Value                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Branch         | `origin/cursor/experiment-001-optimization-results-c674`                  |
| Commit         | `0e1accdf8392547b63420e2e40c37e2a3fee102f` (2026-09-24)                   |
| Parent         | `643de69` (same as current HEAD)                                          |
| Commit subject | `docs: Record Experiment 001 Lighthouse and Network optimization results` |

That commit is **one commit ahead** of the current experiment branch. It was not merged into `test/performance-experiment-001` at audit time.

### Session metadata recorded in those artifacts

From `docs/measurements/experiment-001/raw/summary.json` on the results branch:

| Field                                        | Value                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Started                                      | `2026-09-24T06:12:00.126Z`                                                                                       |
| Finished                                     | `2026-09-24T06:18:32.404Z`                                                                                       |
| Commit recorded in summary                   | `643de69`                                                                                                        |
| Build (as documented)                        | production `dist` via `npm run build`                                                                            |
| Preview (as documented)                      | `npm run preview -- --port 3000 --strictPort`                                                                    |
| Base URL                                     | `http://127.0.0.1:3000/experiments/experiment-001`                                                               |
| Chrome                                       | 148.0.7778.96 **headless** (`/usr/local/bin/google-chrome`)                                                      |
| Lighthouse                                   | 12.8.2 (from LHR `lighthouseVersion`)                                                                            |
| Node                                         | v22.14.0 (from `docs/experiment-001-results.md` on that branch)                                                  |
| Host (from `optimization.md` on that branch) | Linux x86_64, 4 vCPU, 16 GiB RAM                                                                                 |
| Harness n                                    | `LH_RUNS=3`, `NW_RUNS=3` (explicitly reduced vs protocol n=10)                                                   |
| Order                                        | Nested loops: profile M then D; variants `v1 → v2 → v3 → v3b`; 3 consecutive repeats. **Not** Latin square S1–S4 |

Lighthouse `fetchTime` values span `2026-09-24T06:12:05Z` … `2026-09-24T06:15:57Z` (Mobile block, then Desktop block).

---

## B. Measurement inventory

Protocol requirements (unchanged):

| Tool           | Tier       | Expected per variant × profile |
| -------------- | ---------- | -----------------------------: |
| Lighthouse     | Primary    |                             10 |
| Network        | Primary    |                             10 |
| Performance    | Diagnostic |                              3 |
| React Profiler | Diagnostic |                              3 |

**Expected primary total:** 4 variants × 2 profiles × (10 + 10) = **160**.  
**Expected diagnostic total:** 4 × 2 × (3 + 3) = **48**.

### Counting rules used in this audit

| Bucket                  | Meaning                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Artifact-backed         | Readable JSON on the results branch; URL/variant/profile/tool identity checks passed           |
| Protocol-complete       | Would count toward the formal n=10 Incognito / Latin-square / HTML+JSON dataset on this branch |
| Extra / out of protocol | Collected, but profile or metric is not part of the protocol matrix                            |
| Missing                 | Required by the protocol, no artifact                                                          |

The n=3 Lighthouse and Network (M/D) samples are **artifact-backed** and internally consistent, but they are **not protocol-complete**: reduced n, headless cloud Chrome instead of Incognito, no Latin square, Lighthouse HTML not stored, artifacts not present on the current branch.

### Inventory matrix

| Profile       | Variant |                  Tool | Artifact-backed | Protocol-complete |            Expected | Missing vs protocol | Notes                       |
| ------------- | ------- | --------------------: | --------------: | ----------------: | ------------------: | ------------------- | --------------------------- |
| Mobile        | V1      |            Lighthouse |               3 |                 0 |                  10 | 7                   | JSON on results branch only |
| Mobile        | V2      |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V3      |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V3B     |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V1      |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V2      |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V3      |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V3B     |            Lighthouse |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V1      |               Network |               3 |                 0 |                  10 | 7                   | Custom JSON, not HAR        |
| Mobile        | V2      |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V3      |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V3B     |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V1      |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V2      |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V3      |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Desktop       | V3B     |               Network |               3 |                 0 |                  10 | 7                   |                             |
| Mobile        | V1      |           Performance |               0 |                 0 |                   3 | 3                   | No traces anywhere          |
| Mobile        | V2      |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Mobile        | V3      |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Mobile        | V3B     |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V1      |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V2      |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V3      |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V3B     |           Performance |               0 |                 0 |                   3 | 3                   |                             |
| Mobile        | V1      |        React Profiler |               0 |                 0 |                   3 | 3                   | No profiler JSON            |
| Mobile        | V2      |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Mobile        | V3      |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Mobile        | V3B     |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V1      |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V2      |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V3      |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| Desktop       | V3B     |        React Profiler |               0 |                 0 |                   3 | 3                   |                             |
| _Unthrottled_ | V1–V3B  | Network (profile `U`) |        12 extra |               n/a | 0 (not in protocol) | n/a                 | See §C/F                    |

**Totals**

| Set                                                |                                                                                         Count |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------: |
| Artifact-backed primary (M/D Lighthouse + Network) |                                                                                            48 |
| Protocol-complete primary on current branch        |                                                                                             0 |
| Extra unthrottled Network JSON                     |                                                                                            12 |
| Performance traces                                 |                                                                                             0 |
| React Profiler exports                             |                                                                                             0 |
| Primary still required for protocol n=10           | 112 (56 Lighthouse + 56 Network) if the n=3 set is retained; **160** if that set is discarded |
| Diagnostic still required                          |                                                             48 (24 Performance + 24 Profiler) |

---

## C. Existing raw artifacts

### C.1 Current branch (`test/performance-experiment-001` @ `643de69`)

| Path                                          | Status                                                        |
| --------------------------------------------- | ------------------------------------------------------------- |
| `docs/measurements/experiment-001/`           | Missing                                                       |
| `docs/experiment-001-results.md`              | Missing                                                       |
| `scripts/measure-experiment-001.mjs`          | Missing                                                       |
| `scripts/measure-milestones-unthrottled.mjs`  | Missing                                                       |
| `docs/experiment-001-results-template.md`     | Present, **blank**                                            |
| `docs/experiment-001-measurement-protocol.md` | Present (not modified by this audit)                          |
| `docs/experiments.md`                         | Present; exploratory history only                             |
| `docs/measurements.md`                        | Present; exploratory `~3.5s` / `~4.5s` table — **not** formal |
| `docs/optimization.md`                        | Present; Measurements = `TODO`                                |
| `*.har`, Performance traces, Profiler JSON    | None in the repository                                        |

### C.2 Results branch (`origin/cursor/experiment-001-optimization-results-c674` @ `0e1accd`)

Paths below are relative to that commit. None of these files exist in the current working tree.

#### Lighthouse JSON (24) — no HTML in git

The harness wrote JSON + HTML; **only JSON was committed**.

| Run ID           | Git path                                                             |
| ---------------- | -------------------------------------------------------------------- |
| M-LH-V1-01 … 03  | `docs/measurements/experiment-001/lighthouse/M-LH-V1-0{1,2,3}.json`  |
| M-LH-V2-01 … 03  | `docs/measurements/experiment-001/lighthouse/M-LH-V2-0{1,2,3}.json`  |
| M-LH-V3-01 … 03  | `docs/measurements/experiment-001/lighthouse/M-LH-V3-0{1,2,3}.json`  |
| M-LH-V3B-01 … 03 | `docs/measurements/experiment-001/lighthouse/M-LH-V3B-0{1,2,3}.json` |
| D-LH-V1-01 … 03  | `docs/measurements/experiment-001/lighthouse/D-LH-V1-0{1,2,3}.json`  |
| D-LH-V2-01 … 03  | `docs/measurements/experiment-001/lighthouse/D-LH-V2-0{1,2,3}.json`  |
| D-LH-V3-01 … 03  | `docs/measurements/experiment-001/lighthouse/D-LH-V3-0{1,2,3}.json`  |
| D-LH-V3B-01 … 03 | `docs/measurements/experiment-001/lighthouse/D-LH-V3B-0{1,2,3}.json` |

#### Network JSON (24 protocol profiles + 12 extra)

Not HAR files. Puppeteer summaries from `scripts/measure-experiment-001.mjs` / `scripts/measure-milestones-unthrottled.mjs`.

| Run ID pattern         | Count | Git path prefix                             |
| ---------------------- | ----: | ------------------------------------------- |
| M-NW-V{1,2,3,3B}-01…03 |    12 | `docs/measurements/experiment-001/network/` |
| D-NW-V{1,2,3,3B}-01…03 |    12 | same                                        |
| U-NW-V{1,2,3,3B}-01…03 |    12 | same (unthrottled; **not** protocol M/D)    |

#### Aggregates and narrative (not a substitute for raw LHR)

| Path                                                               | Role                                               |
| ------------------------------------------------------------------ | -------------------------------------------------- |
| `docs/measurements/experiment-001/raw/summary.json`                | Harness aggregate of the 24 LH + 24 NW M/D samples |
| `docs/measurements/experiment-001/raw/unthrottled-milestones.json` | Aggregate of the 12 U-NW samples                   |
| `docs/experiment-001-results.md`                                   | Session means (uses arithmetic **mean**, n=3)      |
| `docs/optimization.md`                                             | Narrative + same means                             |
| `scripts/measure-experiment-001.mjs`                               | Lighthouse + throttled Network harness             |
| `scripts/measure-milestones-unthrottled.mjs`                       | Extra unthrottled Network harness                  |

`lighthouse`, `chrome-launcher`, and `puppeteer-core` are **not** listed in `package.json` on either branch. The harness was used in a cloud-agent environment with those tools available at runtime.

---

## D. Extracted measurements

Source for Lighthouse tables: raw LHR JSON (not the derived `summary.json` rounded copy).  
Source for Network tables: the per-run `*-NW-*.json` files.  
INP: **N/A** — Lighthouse 12.8.2 performance-only Navigation reports contain no `interaction-to-next-paint` audit (matches the load-only protocol rule).  
TTI: present in LHR (`audits.interactive`); informational only; not a primary claim.

### D.1 Lighthouse — Profile M (Mobile)

Identity checks for all 12: `gatherMode=navigation`, `formFactor=mobile`, viewport 412×823, `deviceScaleFactor=1.75`, `mobile=true`, Simulated Slow 4G (`rttMs=150`, `throughputKbps=1638.4`, CPU 4×), `requestedUrl` = `http://127.0.0.1:3000/experiments/experiment-001?variant=…`, no `runtimeError`.

LCP element on **all 12 Mobile samples**:  
`body > main.mx-auto > header.space-y-2 > p.text-muted-foreground`  
(nodeLabel: “TanStack Start rendering and TanStack Query integration proof of concept.”)

| Run         | Score | FCP (ms) | LCP (ms) | CLS | SI (ms) | TBT (ms) | TTI (ms, info) | INP |
| ----------- | ----: | -------: | -------: | --: | ------: | -------: | -------------: | --- |
| M-LH-V1-01  |    79 |     3381 |     3381 |   0 |    6880 |       58 |           4375 | N/A |
| M-LH-V1-02  |    78 |     3481 |     3481 |   0 |    6887 |       38 |           4467 | N/A |
| M-LH-V1-03  |    78 |     3485 |     3485 |   0 |    6870 |       32 |           4467 | N/A |
| M-LH-V2-01  |    84 |     3155 |     3155 |   0 |    5162 |       38 |           4300 | N/A |
| M-LH-V2-02  |    81 |     3464 |     3464 |   0 |    5215 |       41 |           4305 | N/A |
| M-LH-V2-03  |    90 |     2555 |     2555 |   0 |    5005 |       20 |           4048 | N/A |
| M-LH-V3-01  |    84 |     3156 |     3156 |   0 |    5159 |       39 |           4303 | N/A |
| M-LH-V3-02  |    88 |     2708 |     2708 |   0 |    5066 |       18 |           4201 | N/A |
| M-LH-V3-03  |    89 |     2557 |     2557 |   0 |    5100 |       94 |           4352 | N/A |
| M-LH-V3B-01 |    85 |     3156 |     3156 |   0 |    4353 |       56 |           4321 | N/A |
| M-LH-V3B-02 |    82 |     3463 |     3463 |   0 |    4403 |       16 |           4194 | N/A |
| M-LH-V3B-03 |    87 |     3006 |     3006 |   0 |    4330 |       35 |           4298 | N/A |

M-LH-V4…10 for every variant: **missing**.

### D.2 Lighthouse — Profile D (Desktop)

Identity checks for all 12: `formFactor=desktop`, viewport 1350×940, `deviceScaleFactor=1`, `mobile=false`, Simulated Dense 4G (`rttMs=40`, `throughputKbps=10240`, CPU 1×), experiment URL + matching `variant`, no `runtimeError`.

LCP element on **all 12 Desktop samples**: same header paragraph selector as Mobile.

| Run         | Score | FCP (ms) | LCP (ms) |   CLS | SI (ms) | TBT (ms) | TTI (ms, info) | INP |
| ----------- | ----: | -------: | -------: | ----: | ------: | -------: | -------------: | --- |
| D-LH-V1-01  |    93 |      792 |      832 | 0.022 |    2602 |        0 |            832 | N/A |
| D-LH-V1-02  |    93 |      746 |      746 | 0.022 |    2576 |        0 |            746 | N/A |
| D-LH-V1-03  |    93 |      766 |      766 | 0.022 |    2594 |        0 |            766 | N/A |
| D-LH-V2-01  |    94 |      772 |      772 | 0.012 |    2290 |        0 |            772 | N/A |
| D-LH-V2-02  |    94 |      774 |      774 | 0.013 |    2293 |        0 |            774 | N/A |
| D-LH-V2-03  |    94 |      728 |      728 | 0.012 |    2281 |        0 |            728 | N/A |
| D-LH-V3-01  |    94 |      793 |      813 | 0.013 |    2315 |        0 |            813 | N/A |
| D-LH-V3-02  |    94 |      773 |      773 | 0.013 |    2291 |        0 |            773 | N/A |
| D-LH-V3-03  |    94 |      795 |      815 | 0.013 |    2305 |        0 |            815 | N/A |
| D-LH-V3B-01 |    95 |      830 |      890 | 0.012 |    1900 |        0 |            890 | N/A |
| D-LH-V3B-02 |    95 |      833 |      893 | 0.013 |    1885 |        0 |            893 | N/A |
| D-LH-V3B-03 |    95 |      798 |      858 | 0.012 |    1885 |        0 |            858 | N/A |

D-LH-V4…10 for every variant: **missing**.

### D.3 Network — Profile M (primary protocol profile)

All 12: `displayedVariant` matches URL variant; `complete=true`; marks A–F present; `serverFunctionRequestCount=0` (no browser-visible RPC URLs). Per-query RPC times: **N/A — dehydrated/streamed** (protocol-allowed). Duplicate SF URLs: none.

**Caveat:** marks A–E (and often F vs C) are nearly identical on each throttled Network sample. The harness waits until `[data-exp-complete=true]` then reads User Timing. Under CPU 4× this observer appears to fire after the DOM is already complete, so B–E are **not reliable progressive-reveal times**. Milestone **F** is still a recorded completion timestamp for that navigation.

Doc start/end = `navigation.responseStart` / `responseEnd` (ms).

| Run         | Requests | Doc start | Doc end | Static | SF RPC | Dup SF |    B |    C |    D |    E |    F |
| ----------- | -------: | --------: | ------: | -----: | -----: | ------ | ---: | ---: | ---: | ---: | ---: |
| M-NW-V1-01  |       53 |      3509 |    3603 |     51 |      0 | no     | 6180 | 6342 | 6180 | 6180 | 6342 |
| M-NW-V1-02  |       52 |      3509 |    3605 |     51 |      0 | no     | 6182 | 6341 | 6182 | 6182 | 6341 |
| M-NW-V1-03  |       52 |      3508 |    3605 |     51 |      0 | no     | 6174 | 6329 | 6174 | 6174 | 6330 |
| M-NW-V2-01  |       52 |      4510 |    4608 |     51 |      0 | no     | 7212 | 7380 | 7212 | 7212 | 7380 |
| M-NW-V2-02  |       52 |      4511 |    4612 |     51 |      0 | no     | 7213 | 7383 | 7213 | 7213 | 7383 |
| M-NW-V2-03  |       52 |      4510 |    4608 |     51 |      0 | no     | 7162 | 7346 | 7162 | 7162 | 7346 |
| M-NW-V3-01  |       52 |      4510 |    4612 |     51 |      0 | no     | 7237 | 7399 | 7237 | 7237 | 7400 |
| M-NW-V3-02  |       52 |      4510 |    4610 |     51 |      0 | no     | 7213 | 7380 | 7213 | 7213 | 7380 |
| M-NW-V3-03  |       52 |      4510 |    4607 |     51 |      0 | no     | 7207 | 7372 | 7207 | 7207 | 7372 |
| M-NW-V3B-01 |       52 |      3508 |    3608 |     51 |      0 | no     | 6199 | 6360 | 6199 | 6199 | 6360 |
| M-NW-V3B-02 |       52 |      3507 |    3604 |     51 |      0 | no     | 6195 | 6360 | 6195 | 6195 | 6360 |
| M-NW-V3B-03 |       52 |      3506 |    3602 |     51 |      0 | no     | 6158 | 6321 | 6158 | 6158 | 6321 |

M-NW-04…10: **missing**.

### D.4 Network — Profile D

Same identity checks as Mobile. SF RPC = 0. Same A–E collapse caveat.

| Run         | Requests | Doc start | Doc end | Static | SF RPC | Dup SF |    B |    C |    D |    E |    F |
| ----------- | -------: | --------: | ------: | -----: | -----: | ------ | ---: | ---: | ---: | ---: | ---: |
| D-NW-V1-01  |       52 |      3509 |    3527 |     51 |      0 | no     | 4072 | 4114 | 4072 | 4072 | 4114 |
| D-NW-V1-02  |       52 |      3509 |    3526 |     51 |      0 | no     | 4071 | 4109 | 4071 | 4071 | 4109 |
| D-NW-V1-03  |       52 |      3510 |    3528 |     51 |      0 | no     | 4077 | 4117 | 4077 | 4077 | 4117 |
| D-NW-V2-01  |       52 |      4510 |    4529 |     51 |      0 | no     | 5067 | 5107 | 5067 | 5067 | 5107 |
| D-NW-V2-02  |       52 |      4510 |    4527 |     51 |      0 | no     | 5076 | 5114 | 5076 | 5076 | 5114 |
| D-NW-V2-03  |       52 |      4509 |    4526 |     51 |      0 | no     | 5079 | 5118 | 5079 | 5079 | 5118 |
| D-NW-V3-01  |       52 |      4510 |    4528 |     51 |      0 | no     | 5076 | 5117 | 5076 | 5076 | 5117 |
| D-NW-V3-02  |       52 |      4510 |    4528 |     51 |      0 | no     | 5075 | 5113 | 5075 | 5075 | 5113 |
| D-NW-V3-03  |       52 |      4508 |    4526 |     51 |      0 | no     | 5075 | 5113 | 5075 | 5075 | 5113 |
| D-NW-V3B-01 |       52 |      3508 |    3525 |     51 |      0 | no     | 4071 | 4109 | 4071 | 4071 | 4109 |
| D-NW-V3B-02 |       52 |      3506 |    3521 |     51 |      0 | no     | 4063 | 4101 | 4063 | 4063 | 4101 |
| D-NW-V3B-03 |       52 |      3506 |    3524 |     51 |      0 | no     | 4072 | 4110 | 4072 | 4072 | 4110 |

D-NW-04…10: **missing**.

### D.5 Lighthouse User Timing marks (same LHR files; independent of Network IDs)

These are **not** Chrome DevTools Performance-panel traces and **not** the protocol’s primary n=10 Network milestone series. They are User Timing entries inside the Lighthouse report. For V2/V3/V3B they show delay-like spacing; for V1 they cluster near ~3.7 s.

| Run         |    A |    B |    C |    D |    E |    F |
| ----------- | ---: | ---: | ---: | ---: | ---: | ---: |
| M-LH-V1-01  | 3703 | 3703 | 3752 | 3703 | 3703 | 3752 |
| M-LH-V1-02  | 3673 | 3673 | 3720 | 3673 | 3673 | 3720 |
| M-LH-V1-03  | 3670 | 3670 | 3715 | 3670 | 3670 | 3715 |
| M-LH-V2-01  | 1150 | 1150 | 3575 | 4516 | 4014 | 4516 |
| M-LH-V2-02  | 1146 | 1146 | 3563 | 4513 | 4011 | 4513 |
| M-LH-V2-03  | 1147 | 1147 | 3573 | 4516 | 4016 | 4516 |
| M-LH-V3-01  | 1145 | 1145 | 3571 | 4511 | 4012 | 4511 |
| M-LH-V3-02  | 1173 | 1173 | 3578 | 4514 | 4013 | 4514 |
| M-LH-V3-03  | 1146 | 1146 | 3593 | 4513 | 4011 | 4513 |
| M-LH-V3B-01 | 1151 | 1151 | 2574 | 3511 | 3008 | 3511 |
| M-LH-V3B-02 | 1158 | 1158 | 2572 | 3510 | 3007 | 3510 |
| M-LH-V3B-03 | 1150 | 1150 | 2570 | 3509 | 3008 | 3509 |
| D-LH-V1-01  | 3671 | 3671 | 3718 | 3671 | 3671 | 3718 |
| D-LH-V1-02  | 3666 | 3666 | 3713 | 3666 | 3666 | 3713 |
| D-LH-V1-03  | 3670 | 3670 | 3716 | 3670 | 3670 | 3716 |
| D-LH-V2-01  | 1149 | 1149 | 3567 | 4514 | 4012 | 4515 |
| D-LH-V2-02  | 1150 | 1150 | 3575 | 4513 | 4013 | 4513 |
| D-LH-V2-03  | 1186 | 1186 | 3560 | 4514 | 4011 | 4514 |
| D-LH-V3-01  | 1159 | 1159 | 3601 | 4515 | 4014 | 4515 |
| D-LH-V3-02  | 1146 | 1147 | 3570 | 4512 | 4011 | 4512 |
| D-LH-V3-03  | 1153 | 1153 | 3576 | 4513 | 4017 | 4514 |
| D-LH-V3B-01 | 1151 | 1151 | 2561 | 3509 | 3007 | 3509 |
| D-LH-V3B-02 | 1149 | 1149 | 2562 | 3507 | 3006 | 3508 |
| D-LH-V3B-03 | 1154 | 1155 | 2561 | 3508 | 3006 | 3508 |

### D.6 Extra unthrottled Network (profile `U`) — not a protocol device profile

Viewport 1350×940, no CPU/network throttle. Milestone **F** only (completion). SF “count” of 1 is a **false positive** (`/assets/createServerFn-*.js` script, not an RPC) — see §F.

| Run         | F (ms) |
| ----------- | -----: |
| U-NW-V1-01  |   3705 |
| U-NW-V1-02  |   3692 |
| U-NW-V1-03  |   3689 |
| U-NW-V2-01  |   4704 |
| U-NW-V2-02  |   4688 |
| U-NW-V2-03  |   4689 |
| U-NW-V3-01  |   4687 |
| U-NW-V3-02  |   4685 |
| U-NW-V3-03  |   4717 |
| U-NW-V3B-01 |   3689 |
| U-NW-V3B-02 |   3718 |
| U-NW-V3B-03 |   3682 |

### D.7 Performance (Chrome DevTools Performance panel)

**No artifacts.** Scripting / rendering / painting / long-task summaries from a Performance-panel trace: **N/A**.

### D.8 React DevTools Profiler

**No artifacts.** Commit count, commit durations, `actualDuration`, `baseDuration`, widget ranked times: **N/A**. The results-branch `optimization.md` states Profiler was not part of that session.

---

## E. Missing measurements

Required to satisfy the **current protocol** (n-counts unchanged):

### Lighthouse (7 additional valid samples per cell, if the existing 3 are kept)

- Mobile / V1 / Lighthouse: 3 artifact-backed samples found, **7 additional samples required**.
- Mobile / V2 / Lighthouse: 3 found, **7 additional required**.
- Mobile / V3 / Lighthouse: 3 found, **7 additional required**.
- Mobile / V3B / Lighthouse: 3 found, **7 additional required**.
- Desktop / V1 / Lighthouse: 3 found, **7 additional required**.
- Desktop / V2 / Lighthouse: 3 found, **7 additional required**.
- Desktop / V3 / Lighthouse: 3 found, **7 additional required**.
- Desktop / V3B / Lighthouse: 3 found, **7 additional required**.

Also missing for every existing Lighthouse run: committed **HTML** report (`*.html`). JSON exists on the results branch only.

If the headless n=3 set is **not** accepted into the formal dataset, each cell needs **10** new Incognito samples (80 Lighthouse total), not 7.

### Network (7 additional valid samples per cell, if the existing 3 are kept)

- Mobile / V1 / Network: 3 found, **7 additional required**.
- Mobile / V2 / Network: 3 found, **7 additional required**.
- Mobile / V3 / Network: 3 found, **7 additional required**.
- Mobile / V3B / Network: 3 found, **7 additional required**.
- Desktop / V1 / Network: 3 found, **7 additional required**.
- Desktop / V2 / Network: 3 found, **7 additional required**.
- Desktop / V3 / Network: 3 found, **7 additional required**.
- Desktop / V3B / Network: 3 found, **7 additional required**.

Also missing vs protocol artifact layout: **HAR** exports (only custom JSON exists).

If the n=3 set is discarded: **80** new Network samples.

### Performance (diagnostic)

- All 8 variant×profile cells: **0 found, 3 required** → **24 traces required**.

### React Profiler (diagnostic)

- All 8 cells: **0 found, 3 required** → **24 exports required** on `build:profile` / `preview:profile`.

### Other protocol items not found

- Latin-square session log (S1–S4) for a n=10 campaign.
- Incognito / Disable-cache / custom DevTools profile notes in the blank results template.
- Artifacts checked out on `test/performance-experiment-001`.

---

## F. Invalid / excluded / uncertain samples

No raw Lighthouse or M/D Network JSON failed basic identity checks (URL, variant label, profile throttling, readable file, milestones present / LHR without `runtimeError`). Exclusions below are **classification**, not silent drops of those 48 files.

| ID / set                                 | Bucket                                             | Reason                                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entire n=3 campaign                      | Uncertain for **protocol-complete** thesis dataset | Headless Chrome on a cloud VM; n=3 not n=10; variant order is blocked `v1→v2→v3→v3b`, not Latin square S1–S4; not on current branch                |
| All `*-LH-*.html`                        | Missing artifact                                   | Harness wrote HTML; git tree contains JSON only                                                                                                    |
| All Network samples                      | Uncertain as HAR-equivalent                        | Custom Puppeteer JSON, not protocol HAR                                                                                                            |
| M-NW-\* and D-NW-\* marks B–E            | Uncertain as progressive timing                    | Marks collapse to ~the same timestamp after `data-exp-complete`; F still recorded                                                                  |
| U-NW-V1-01 … U-NW-V3B-03 (12)            | Extra / out of protocol                            | Profile `U` (unthrottled) is not Mobile or Desktop                                                                                                 |
| U-NW-\* `serverFunctionRequestCount=1`   | Invalid SF metric                                  | URL is `/assets/createServerFn-8y_MtXT9.js` (script chunk). Filter in `measure-milestones-unthrottled.mjs` matches `createServerFn` in asset names |
| M/D Network SF count = 0                 | Not an error                                       | Consistent with SSR Query dehydration; record as N/A for per-query RPC rows                                                                        |
| `summary.json` `lcpElement` field        | Unusable                                           | Stores LCP _time_ display string (e.g. `3,160 ms`), not a selector. Selector taken from LHR in §D                                                  |
| `docs/measurements.md` exploratory table | Not formal                                         | Historical `~3.5s` / `~4.5s`; protocol forbids merging into the formal workbook                                                                    |
| Performance / Profiler                   | Missing                                            | No files to exclude                                                                                                                                |

---

## G. Cursor summary reconciliation

Headline figures previously seen:

| Claim                                   | Traced? | Exact source                                                                                                                                                           |
| --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile SI V3B ≈ 4362 ms                 | **Yes** | Mean of LHR Speed Index `M-LH-V3B-01…03` = (4353 + 4403 + 4330) / 3 = **4362**. Repeated in results-branch `docs/experiment-001-results.md` and `docs/optimization.md` |
| Mobile SI V1 ≈ 6879 ms                  | **Yes** | Mean of `M-LH-V1-01…03` = (6880 + 6887 + 6870) / 3 = **6879**                                                                                                          |
| Desktop SI V3B ≈ 1890 ms                | **Yes** | Mean of `D-LH-V3B-01…03` = (1900 + 1885 + 1885) / 3 = **1890**                                                                                                         |
| Desktop SI V1 ≈ 2591 ms                 | **Yes** | Mean of `D-LH-V1-01…03` = (2602 + 2576 + 2594) / 3 = **2591**                                                                                                          |
| Unthrottled completion V1 ≈ V3B ≈ 3.7 s | **Yes** | Mean milestone F of `U-NW-V1-*` = **3695** ms; `U-NW-V3B-*` = **3696** ms (`unthrottled-milestones.json`)                                                              |
| Unthrottled completion V2 ≈ V3 ≈ 4.7 s  | **Yes** | Mean F `U-NW-V2-*` = **4694** ms; `U-NW-V3-*` = **4696** ms                                                                                                            |

These are **arithmetic means of n=3**, not protocol medians of n=10. They are **not** copied into the formal results template by this audit.

Minor derived-table mismatch (not used as a headline): results-branch Mobile V3 TBT mean **51** vs LHR values (39, **18**, 94) whose mean rounds to **50**. `summary.json` stored M-LH-V3-02 TBT as 19.

No Cursor headline value in the list above is `Cursor summary value — source artifact not found`.

---

## H. Readiness assessment

1. **How many valid primary samples currently exist?**
   - On **this branch / working tree:** **0**.
   - **Artifact-backed** on `origin/cursor/experiment-001-optimization-results-c674`: **48** (24 Lighthouse + 24 Network M/D), with the session-level deviations in §F.
   - **Protocol-complete** (n=10, Incognito, Latin square, HTML+HAR layout): **0**.

2. **How many are required?**  
   **160** primary (80 Lighthouse + 80 Network).

3. **How many additional runs are required?**
   - If the n=3 set is retained after review: **112** primary (56 Lighthouse + 56 Network) **plus** **48** diagnostic (24 Performance + 24 Profiler).
   - If the n=3 set is rejected: **160** primary + **48** diagnostic.

4. **Are Performance measurements available?**  
   **No.**

5. **Are React Profiler measurements available?**  
   **No.**

6. **Can we start writing Chapter 4 with the current data?**  
   **No.** The formal protocol dataset is incomplete; artifacts are not even on the experiment branch; diagnostic tools are missing; n=3 means are not a substitute for the planned n=10 medians.

7. **What exact measurements remain before the formal dataset is complete?**
   1. Bring results-branch artifacts onto the experiment branch **or** re-collect on this machine (decision, not done in this audit).
   2. Lighthouse: 7 more valid Navigation audits per variant × Mobile/Desktop (**56**), or 80 if restarting; export JSON **and** HTML.
   3. Network: 7 more valid cold navigations per cell (**56**), or 80 if restarting; record User Timing + HAR.
   4. Performance: **3** traces per variant × profile (**24**).
   5. React Profiler: **3** per variant × profile on the profiling build (**24**).
   6. Fill `docs/experiment-001-results-template.md` from those artifacts only.
   7. Only then compute thesis medians / IQR / V3B vs V3 relative change.

---

## Decision (this audit)

Experiment 001 is **not complete**. A partial automated Lighthouse + Network campaign (n=3, headless) exists on another git branch and **does** support the previously quoted Speed Index and unthrottled ~3.7 s / ~4.7 s headlines. It does **not** satisfy the protocol’s n=10 primary plan or the diagnostic Performance/Profiler plan.

**Next step (no measurement in this task):** decide whether to merge/cherry-pick `0e1accd` onto `test/performance-experiment-001` so the JSON lives on the experiment branch, then run a separate preflight and the remaining protocol samples on the thesis machine.
