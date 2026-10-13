# Experiment 001 — Measured Results (session 2026-09-24)

Filled summary for the automated cloud-agent measurement session.
Full protocol: [`experiment-001-measurement-protocol.md`](./experiment-001-measurement-protocol.md).
Blank workbook: [`experiment-001-results-template.md`](./experiment-001-results-template.md).
Narrative + tables: [`optimization.md`](./optimization.md#measurements).

## Metadata

| Field | Value |
| --- | --- |
| Commit | `643de696b06169326dfdaefe8e391ea965b5d9f4` |
| Build | production `dist` via `npm run build` |
| Preview | `npm run preview -- --port 3000 --strictPort` |
| Chrome | 148.0.7778.96 headless |
| Node | v22.14.0 |
| n (LH / NW) | 3 per variant × profile |
| Artifacts | `docs/measurements/experiment-001/` |

## Aggregate Lighthouse (mean)

| Profile | Variant | Score | FCP | LCP | SI | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| M | V1 | 78 | 3449 | 3449 | 6879 | 43 | 0 |
| M | V2 | 85 | 3058 | 3058 | 5127 | 33 | 0 |
| M | V3 | 87 | 2807 | 2807 | 5108 | 51 | 0 |
| M | V3B | 85 | 3208 | 3208 | 4362 | 36 | 0 |
| D | V1 | 93 | 768 | 781 | 2591 | 0 | 0 |
| D | V2 | 94 | 758 | 758 | 2288 | 0 | 0 |
| D | V3 | 94 | 787 | 800 | 2304 | 0 | 0 |
| D | V3B | 95 | 820 | 880 | 1890 | 0 | 0 |

## Aggregate milestone F (mean ms)

| Profile | V1 | V2 | V3 | V3B |
| --- | ---: | ---: | ---: | ---: |
| M throttled | 6338 | 7370 | 7384 | 6347 |
| D throttled | 4113 | 5113 | 5114 | 4107 |
| Unthrottled | 3695 | 4694 | 4696 | 3696 |

## Decision

Adopt **V3B Early Prefetch** for the production Dashboard.
