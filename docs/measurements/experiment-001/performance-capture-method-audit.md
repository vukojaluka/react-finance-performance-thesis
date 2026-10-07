# Experiment 001 — Performance capture-method audit

Audit date: 2026-09-30. This note reads the 24 stored Performance traces. It does not rerun the experiment, add measurements, change raw files, remove samples, or rank variants.

Performance has three samples per variant per profile. There is no Performance S4–S10. The later-session cohort is S2–S3 (16 traces). The index-01 cohort is S1 (8 traces).

## Finding

S1 and S2–S3 are not the same capture method.

| | S1 (8 traces) | S2–S3 (16 traces) |
| --- | --- | --- |
| `metadata.source` | `DevTools` | `CDP Tracing` |
| `metadata.startTime` | 2026-09-29 | 2026-09-30 |
| Origin | `localhost:4173` | `localhost:3000` |
| Build SHA in the trace | not stored | `8c8df0b3266b32b841735126151e9b1b1b2b94ba` |
| Viewport scale | not stored (`hostDPR` 1 is the host display) | Mobile dSF 1.75, Desktop dSF 1 |
| Hashed assets `index-*.js`, `experiment-001-*.js`, `styles-*.css` | `index-DpZHokkx.js`, `experiment-001-DlC2EC7t.js`, `styles-DslO3BOs.css` | `index-CEwLIwJ0.js`, `experiment-001-CEFKlWVG.js`, `styles-BkK_oYmA.css` |

S2 and S3 use the same three hashed names. The other asset stems match across the two cohorts. The S1 build output is therefore not the artifact identified by the SHA stored on the CDP traces. The S1 commit is not verifiable from the trace.

Network throttle matches the protocol on all 24 traces: Mobile 204750 bytes/s and 150 ms; Desktop 1280000 bytes/s and 40 ms. Mobile CPU throttle is 4 on all 12 Mobile traces. Desktop `cpuThrottling` is absent on all 12 Desktop traces.

Each S1 renderer main thread evaluates Chrome extension scripts. Each CDP trace has none. The extension script URLs are:

- `fmkadmapgofadopljbjfkapdkoienihi`, including `react_devtools_backend_compact.js`
- `gighmmpiobklfepjocnamgkkbiglidom`, including `adblock-functions.js`
- `bhlhnicpbhignbdhedgjhgdocnmhomnp`, including `js/global-shortcut.js`

After navigation start, each S1 trace has 22 or 23 `EvaluateScript` events whose URL is `chrome-extension://`. Their inclusive durations are about 26 ms on Desktop and about 109–118 ms on Mobile. Page `EvaluateScript` counts still match by variant: 3 on V1 and 10 on V2, V3, and V3B, in both cohorts.

`M-PF-V1-01` and `D-PF-V1-01` record 52 page requests and do not record `favicon.svg`. The other 22 traces record 53 page requests, including `favicon.svg`. No trace records a `chrome-extension://` network request.

## Affected samples

All eight index-01 Performance traces:

`M-PF-V1-01`, `M-PF-V2-01`, `M-PF-V3-01`, `M-PF-V3B-01`, `D-PF-V1-01`, `D-PF-V2-01`, `D-PF-V3-01`, `D-PF-V3B-01`.

The 16 S2–S3 traces stay the CDP cohort. No sample is removed.

## Affected metrics

Readings below are taken from the stored traces to judge comparability. They are not a new measurement series and they do not fill any missing value.

### A–F milestone timings — report with a methodological caveat

Every trace has exactly one `exp-milestone-A` through `exp-milestone-F` on the renderer thread. The mark `startTime` is the same User Timing field in both cohorts. S1 values sit in the same band as the two CDP traces of the same variant, except Mobile V3B milestone F: S1 is 4111.4 ms and the CDP traces are 4241.3 ms and 4223.3 ms.

Use the 24 traces as diagnostic corroboration of the Network milestone series. State that S1 is a different day, port, asset hash, and extension-injected page. Do not substitute these n=3 traces for the Network milestone series.

### FCP and LCP — report with a methodological caveat

Both cohorts expose `firstContentfulPaint` and `largestContentfulPaint::Candidate`. Mobile S1 is within about 35 ms of the CDP pair for the same variant. Desktop S1 is about 530–560 ms later than both CDP traces on every variant (for example Desktop V1: 4212.8 ms versus 3653.5 ms and 3652.4 ms).

Keep the values in the dataset. Do not pool Desktop S1 with S2–S3 as one capture method when interpreting trace FCP or LCP. Lighthouse remains the primary FCP and LCP series.

### Scripting time — exclude from comparative interpretation

An inclusive sum of main-thread `EvaluateScript` durations is much larger on S1 (Desktop about 28–31 ms, Mobile about 115–131 ms) than on CDP (Desktop about 3–10 ms, Mobile about 12–20 ms). That gap is the extension scripts.

A union of main-thread scripting events (`EvaluateScript`, `FunctionCall`, `EventDispatch`, `TimerFire`, `RunMicrotasks`, `FireAnimationFrame`) runs the other way: S1 is smaller (Desktop about 119–123 ms versus about 165–236 ms; Mobile about 503–540 ms versus about 672–1064 ms). Page-only `EvaluateScript` durations are also smaller on S1.

The two definitions do not agree in direction. Do not publish one scripting total for n=3, and do not compare variants on scripting time across this split.

### Rendering time — exclude from comparative interpretation

The union of main-thread `Layout`, `UpdateLayoutTree`, and `RecalculateStyles` after navigation start is about half as long on S1 as on the CDP traces (Desktop about 16–18 ms versus about 33–50 ms; Mobile about 75–81 ms versus about 119–155 ms). Do not compare variants on rendering time across this split.

### Painting time — exclude from comparative interpretation

The union of main-thread `Paint` after navigation start is shorter on S1 (Desktop about 1.1–1.3 ms versus about 4.1–5.3 ms; Mobile about 3.7–4.9 ms versus about 15–24 ms). CDP traces also contain more `Paint` events. Do not compare variants on painting time across this split.

### Long tasks — exclude from comparative interpretation

A long task here is a renderer-main `RunTask` longer than 50 ms.

After navigation start, every Desktop S1 trace has zero long tasks. Every Desktop CDP trace has one (about 51–91 ms). Each S1 trace also has one pre-navigation `RunTask` longer than 50 ms (Desktop about 61–66 ms; Mobile about 153–279 ms). A count that includes that pre-navigation task is why a whole-trace Desktop S1 count is 1. That task is not the in-navigation long task on the CDP traces.

Mobile traces in both cohorts have in-navigation long tasks. S1 maxima are lower (about 159–194 ms) than CDP maxima (about 210–304 ms). Do not compare long-task counts or maxima across this split.

### Last network activity → milestone F — exclude from comparative interpretation

The gap is milestone F `startTime` minus the end of the last page `ResourceFinish`. It changes sign and size between cohorts. Examples: Desktop V2 is −6.2 ms on S1 and −60.4 / −51.3 ms on CDP; Mobile V2 is +3.3 ms on S1 and −204.0 / −98.8 ms on CDP; Mobile V1 is +429.9 ms on S1 and +220.2 / +217.3 ms on CDP. Do not compare variants on this gap across the 24 traces, and do not impute a replacement.

## Dataset usability

The Performance dataset remains usable for descriptive analysis.

Use milestones A–F, with the S1 caveat above, as diagnostic corroboration. Report trace FCP and LCP with the same caveat, and do not treat Desktop S1 FCP/LCP as the same capture method as S2–S3. Do not use scripting time, rendering time, painting time, long tasks, or the last-network-activity → F gap for comparative interpretation across S1 and S2–S3.

All 24 traces stay in the dataset. This note does not rank variants.
