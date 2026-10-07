# Experiment 001 — Final statistical analysis

Processing date: 2026-09-30.

This report is the descriptive numerical basis for thesis Chapter 4.4 and 4.5. It is not the thesis chapter. It does not rerun measurements, change raw artifacts, remove samples, test hypotheses, calculate p-values, or rank variants.

## 1. Scope and dataset

Source tree: `docs/measurements/experiment-001/`.

Processed artifacts:

- 80 Lighthouse JSON files, including `profile-d/variant-v1/lighthouse/D-LH-V1-01 .json` (space before the extension). HTML companions were not used as a second sample.
- 80 Network HAR files. User Timing milestones were read only from the paired `.notes.md` files.
- 24 Performance trace JSON files.

Sample files parsed: **184**. Expected: **184**. Parse failures: **0**.

Each tool remains its own series of navigations. A shared sample index does not mean a shared page load.

Metric roles follow protocol sections 10 and 13.6:

- Primary quantitative evidence: Lighthouse and Network, including Network User Timing milestones.
- Secondary Lighthouse metric: TBT.
- Informational Lighthouse metric: TTI.
- Diagnostic evidence: Performance traces, n=3, with the capture-method caveat in `performance-capture-method-audit.md`.
- Supplementary network size: transferred bytes and resource bytes.

## 2. Sample counts

| Profile | Variant | Lighthouse n | Network HAR n | Network milestone n | Performance n |
| --- | --- | ---: | ---: | ---: | ---: |
| Mobile | V1 | 10 | 10 | 9 | 3 |
| Mobile | V2 | 10 | 10 | 9 | 3 |
| Mobile | V3 | 10 | 10 | 9 | 3 |
| Mobile | V3B | 10 | 10 | 9 | 3 |
| Desktop | V1 | 10 | 10 | 9 | 3 |
| Desktop | V2 | 10 | 10 | 9 | 3 |
| Desktop | V3 | 10 | 10 | 9 | 3 |
| Desktop | V3B | 10 | 10 | 9 | 3 |
| **Total** |  | **80** | **80** | **72** | **24** |

Lighthouse and Network HAR groups keep n=10, including every index-01 sample. Network milestones use the 72 stored notes (n=9 per profile × variant). The eight index-01 notes are absent, so those eight milestone values are not in the milestone tables. The eight HAR files remain in every HAR statistic. Performance keeps n=3 per profile × variant.

Notes absent:

- `D-NW-V1-01`
- `D-NW-V2-01`
- `D-NW-V3-01`
- `D-NW-V3B-01`
- `M-NW-V1-01`
- `M-NW-V2-01`
- `M-NW-V3-01`
- `M-NW-V3B-01`

## 3. Statistical methodology

For each profile × variant × metric, the statistics are n, median, Q1, Q3, IQR, minimum, maximum, sample standard deviation, and mean. The median is the primary summary. The mean is auxiliary.

Quartiles use the inclusive linear method (`statistics.quantiles`, `n=4`, `method="inclusive"`): the position is `1 + (n − 1) p` on the sorted sample, with linear interpolation. IQR is Q3 − Q1. The median is the ordinary sample median, which matches the 50% inclusive quartile. The standard deviation uses divisor n − 1.

Presentation rounding is half-up and is applied only after the statistic is computed. Milliseconds and scores are shown to 1 decimal place. CLS is shown to 4 decimal places. Relative change is shown to 1 decimal place. The JSON export keeps the unrounded values.

No sample was removed, winsorized, or replaced. Tukey fences are reported in section 9 as flags only. A flag is a value outside Q1 − 1.5 IQR and Q3 + 1.5 IQR. When IQR is 0, any value that differs from the group median is flagged. Flagged observations stay inside n.

V3B versus V3, for each profile separately:

- Δ median = V3B median − V3 median
- Relative change (%) = (Δ median / V3 median) × 100
- A negative relative change is a lower measured value for V3B.
- When the V3 median is 0, relative change is not defined.

Field definitions used in this processing:

- Lighthouse performance score: `categories.performance.score × 100`.
- Lighthouse FCP, LCP, Speed Index, TBT, CLS, and TTI: audit `numericValue` in milliseconds, except CLS, which is unitless.
- INP: numeric audit value present in 0 of 80 files.
- Lighthouse LCP element: `largest-contentful-paint-element` present in 0 of 80 files. No element name was inferred. Trace LCP node names are not used as that element.
- Network request count: HAR entry count.
- Static asset count: entries under `/assets/` plus `favicon.svg`.
- Duplicate URL count: distinct request URLs that occur more than once.
- Browser-visible Server Function RPC count: the notes field where a notes file exists, and the HAR count of URLs outside the document, `/assets/`, and `favicon.svg` where notes are absent. Both sources are 0.
- Document request start: document entry `startedDateTime` minus HAR page `startedDateTime`, in milliseconds.
- Document duration: document entry HAR `time`.
- Document response end: document request start + document duration.
- Network DOMContentLoaded and load: `pageTimings.onContentLoad` and `pageTimings.onLoad`.
- Network milestones: notes `startTime` for `exp-milestone-A` through `exp-milestone-F`. Missing notes were not reconstructed from Lighthouse or Performance traces.
- Performance times are milliseconds after the single main-frame `navigationStart` whose URL contains `/experiments/experiment-001`. Navigation start is that zero point.
- Trace FCP: `firstContentfulPaint` with that navigation id.
- Trace LCP: the latest `largestContentfulPaint::Candidate` with that navigation id.
- Trace DOMContentLoaded: the `domContentLoadedEventStart` on that frame immediately preceding `MarkDOMContent`. An earlier start, about 0–8 ms after navigation start, is stored in the JSON and is not the reported DCL. See section 7.
- Trace load event end: `loadEventEnd` on that frame. The dataset audit’s Load column matches `loadEventStart`. The gap between those two events is under 1 ms on every trace.
- Trace milestones: User Timing `startTime` on `exp-milestone-A` through `exp-milestone-F`. Each trace has exactly one of each mark.

## 4. Lighthouse descriptive statistics

All Lighthouse groups are n=10, including the four Desktop S1 samples with the screen-emulation mismatch and the four Mobile S1 samples collected with screen emulation disabled. INP has no numeric value. The LCP element audit is absent.

#### Performance score

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Performance score | 10 | 78.0 | 78.0 | 78.0 | 0.0 | 70.0 | 78.0 | 2.5 | 77.2 |
| Mobile | V2 | Performance score | 10 | 79.0 | 77.5 | 82.8 | 5.3 | 74.0 | 90.0 | 5.0 | 80.2 |
| Mobile | V3 | Performance score | 10 | 79.0 | 78.3 | 83.5 | 5.3 | 75.0 | 86.0 | 3.4 | 80.4 |
| Mobile | V3B | Performance score | 10 | 81.5 | 80.3 | 85.0 | 4.8 | 77.0 | 91.0 | 4.0 | 82.8 |
| Desktop | V1 | Performance score | 10 | 93.0 | 92.0 | 93.0 | 1.0 | 92.0 | 93.0 | 0.5 | 92.6 |
| Desktop | V2 | Performance score | 10 | 94.0 | 94.0 | 94.0 | 0.0 | 93.0 | 96.0 | 0.8 | 94.0 |
| Desktop | V3 | Performance score | 10 | 94.0 | 94.0 | 94.0 | 0.0 | 93.0 | 95.0 | 0.7 | 94.0 |
| Desktop | V3B | Performance score | 10 | 95.5 | 95.0 | 96.0 | 1.0 | 95.0 | 98.0 | 0.9 | 95.7 |

#### FCP (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | FCP (ms) | 10 | 3481.8 | 3476.1 | 3486.1 | 10.0 | 3474.0 | 3939.3 | 145.2 | 3526.3 |
| Mobile | V2 | FCP (ms) | 10 | 3613.1 | 3269.5 | 3651.7 | 382.2 | 2557.5 | 3915.8 | 415.0 | 3452.4 |
| Mobile | V3 | FCP (ms) | 10 | 3598.7 | 3195.4 | 3616.5 | 421.2 | 3005.4 | 3764.9 | 267.7 | 3451.0 |
| Mobile | V3B | FCP (ms) | 10 | 3561.1 | 3154.7 | 3615.1 | 460.4 | 2564.9 | 3769.3 | 366.0 | 3376.4 |
| Desktop | V1 | FCP (ms) | 10 | 788.6 | 780.6 | 847.3 | 66.6 | 656.7 | 857.9 | 60.0 | 796.6 |
| Desktop | V2 | FCP (ms) | 10 | 810.9 | 792.2 | 813.0 | 20.8 | 569.4 | 825.7 | 78.0 | 777.0 |
| Desktop | V3 | FCP (ms) | 10 | 805.2 | 740.7 | 820.2 | 79.5 | 658.0 | 829.9 | 66.6 | 773.8 |
| Desktop | V3B | FCP (ms) | 10 | 802.8 | 791.2 | 826.7 | 35.5 | 285.0 | 844.8 | 167.6 | 752.8 |

#### LCP (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | LCP (ms) | 10 | 3481.8 | 3476.1 | 3486.1 | 10.0 | 3474.0 | 4420.3 | 297.3 | 3574.4 |
| Mobile | V2 | LCP (ms) | 10 | 3613.1 | 3269.5 | 3764.2 | 494.7 | 2557.5 | 4215.8 | 497.9 | 3527.4 |
| Mobile | V3 | LCP (ms) | 10 | 3609.2 | 3195.4 | 3739.4 | 544.0 | 3005.4 | 4064.9 | 338.0 | 3511.0 |
| Mobile | V3B | LCP (ms) | 10 | 3561.1 | 3154.7 | 3615.1 | 460.4 | 2564.9 | 4069.3 | 411.2 | 3406.4 |
| Desktop | V1 | LCP (ms) | 10 | 828.6 | 805.6 | 947.3 | 141.6 | 656.7 | 957.9 | 97.3 | 852.6 |
| Desktop | V2 | LCP (ms) | 10 | 851.2 | 812.2 | 853.5 | 41.2 | 569.4 | 891.3 | 95.3 | 809.0 |
| Desktop | V3 | LCP (ms) | 10 | 825.2 | 740.7 | 860.2 | 119.5 | 658.0 | 889.9 | 83.9 | 799.8 |
| Desktop | V3B | LCP (ms) | 10 | 832.8 | 811.2 | 881.7 | 70.5 | 285.0 | 904.8 | 183.3 | 784.8 |

#### Speed Index (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Speed Index (ms) | 10 | 6902.9 | 6880.2 | 6919.8 | 39.6 | 6876.9 | 7577.0 | 215.3 | 6966.9 |
| Mobile | V2 | Speed Index (ms) | 10 | 5255.5 | 5185.8 | 5349.9 | 164.1 | 5073.5 | 5485.3 | 121.3 | 5265.4 |
| Mobile | V3 | Speed Index (ms) | 10 | 5236.0 | 5184.5 | 5268.0 | 83.5 | 5136.6 | 5470.3 | 93.9 | 5243.1 |
| Mobile | V3B | Speed Index (ms) | 10 | 4428.2 | 4364.1 | 4437.5 | 73.3 | 4262.7 | 4718.6 | 119.8 | 4424.7 |
| Desktop | V1 | Speed Index (ms) | 10 | 2621.0 | 2610.4 | 2639.4 | 29.0 | 2591.9 | 2652.5 | 18.8 | 2623.7 |
| Desktop | V2 | Speed Index (ms) | 10 | 2314.3 | 2307.7 | 2317.8 | 10.1 | 2111.2 | 2332.6 | 65.2 | 2294.0 |
| Desktop | V3 | Speed Index (ms) | 10 | 2317.9 | 2294.5 | 2320.2 | 25.7 | 2132.1 | 2329.2 | 59.7 | 2293.2 |
| Desktop | V3B | Speed Index (ms) | 10 | 1901.7 | 1887.0 | 1908.4 | 21.3 | 1709.6 | 1915.4 | 61.5 | 1880.4 |

#### TBT (ms)

Role: secondary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | TBT (ms) | 10 | 34.0 | 33.0 | 36.5 | 3.5 | 12.0 | 42.0 | 8.0 | 33.0 |
| Mobile | V2 | TBT (ms) | 10 | 39.5 | 38.0 | 49.3 | 11.3 | 24.0 | 58.5 | 10.5 | 42.0 |
| Mobile | V3 | TBT (ms) | 10 | 39.5 | 38.3 | 42.0 | 3.8 | 22.0 | 68.0 | 12.1 | 40.6 |
| Mobile | V3B | TBT (ms) | 10 | 35.9 | 29.0 | 39.8 | 10.8 | 17.0 | 65.7 | 13.3 | 35.4 |
| Desktop | V1 | TBT (ms) | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop | V2 | TBT (ms) | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop | V3 | TBT (ms) | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop | V3B | TBT (ms) | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |

#### CLS

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | CLS | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile | V2 | CLS | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile | V3 | CLS | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile | V3B | CLS | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Desktop | V1 | CLS | 10 | 0.0218 | 0.0218 | 0.0218 | 0.0000 | 0.0000 | 0.0218 | 0.0069 | 0.0196 |
| Desktop | V2 | CLS | 10 | 0.0134 | 0.0124 | 0.0134 | 0.0010 | 0.0102 | 0.0134 | 0.0011 | 0.0128 |
| Desktop | V3 | CLS | 10 | 0.0134 | 0.0134 | 0.0134 | 0.0000 | 0.0102 | 0.0134 | 0.0011 | 0.0129 |
| Desktop | V3B | CLS | 10 | 0.0134 | 0.0134 | 0.0134 | 0.0000 | 0.0095 | 0.0134 | 0.0013 | 0.0129 |

#### TTI (ms)

Role: informational.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | TTI (ms) | 10 | 4465.3 | 4461.3 | 4468.9 | 7.6 | 4451.3 | 4470.6 | 6.3 | 4464.0 |
| Mobile | V2 | TTI (ms) | 10 | 4302.3 | 4297.5 | 4306.9 | 9.4 | 4295.8 | 4365.0 | 20.8 | 4308.8 |
| Mobile | V3 | TTI (ms) | 10 | 4297.2 | 4287.5 | 4304.2 | 16.7 | 4154.1 | 4305.5 | 58.8 | 4271.0 |
| Mobile | V3B | TTI (ms) | 10 | 4303.6 | 4293.8 | 4305.8 | 12.0 | 4181.4 | 4316.2 | 39.4 | 4290.6 |
| Desktop | V1 | TTI (ms) | 10 | 828.6 | 805.6 | 947.3 | 141.6 | 656.7 | 957.9 | 97.3 | 852.6 |
| Desktop | V2 | TTI (ms) | 10 | 851.2 | 812.2 | 853.5 | 41.2 | 569.4 | 891.3 | 95.3 | 809.0 |
| Desktop | V3 | TTI (ms) | 10 | 825.2 | 740.7 | 860.2 | 119.5 | 658.0 | 889.9 | 83.9 | 799.8 |
| Desktop | V3B | TTI (ms) | 10 | 832.8 | 811.2 | 881.7 | 70.5 | 285.0 | 904.8 | 183.3 | 784.8 |

Desktop TBT is 0 on all 40 Desktop samples. Mobile CLS is 0 on all 40 Mobile samples.

TTI is informational. It is summarized above and is omitted from the V3B versus V3 comparison.

## 5. Network descriptive statistics

HAR metrics use n=10 in every profile × variant group. Viewport, CPU throttle, and network throttle are not stored in the HAR.

Request count is 53 on all 80 HAR files. Static asset count is 52 on all 80. Duplicate URL count is 0 on all 80. Browser-visible Server Function RPC count is 0 on all 80. No HAR entry falls outside the document, `/assets/`, and `favicon.svg`. The 72 notes files record the same RPC count and `Duplicate Server Function URLs: none`. That zero is the browser-visible row count. The notes state that query work is streamed inside the document response.

Document request start is −1, 0, or 1 ms on all 80 HAR files (minimum -1.0 ms, maximum 1.0 ms). A value of −1 ms is a one-millisecond clock step between the page timestamp and the document entry.

#### Request count

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile | V2 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile | V3 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile | V3B | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop | V1 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop | V2 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop | V3 | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop | V3B | Request count | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |

#### Static asset count

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Mobile | V2 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Mobile | V3 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Mobile | V3B | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Desktop | V1 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Desktop | V2 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Desktop | V3 | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |
| Desktop | V3B | Static asset count | 10 | 52 | 52 | 52 | 0 | 52 | 52 | 0 | 52 |

#### Duplicate URL count

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V2 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V3 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V3B | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V1 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V2 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V3 | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V3B | Duplicate URL count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

#### Browser-visible Server Function RPC count

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V2 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V3 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Mobile | V3B | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V1 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V2 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V3 | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Desktop | V3B | Browser-visible Server Function RPC count | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

#### Transferred bytes

Role: supplementary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Transferred bytes | 10 | 440,074 | 440,074 | 440,074 | 0 | 438,137 | 440,074 | 612.5 | 439,880.3 |
| Mobile | V2 | Transferred bytes | 10 | 444,502 | 444,502 | 444,502 | 0 | 442,565 | 444,502 | 612.5 | 444,308.3 |
| Mobile | V3 | Transferred bytes | 10 | 444,736 | 444,736 | 444,736 | 0 | 442,799 | 444,736 | 612.5 | 444,542.3 |
| Mobile | V3B | Transferred bytes | 10 | 444,738 | 444,738 | 444,738 | 0 | 442,801 | 444,738 | 612.5 | 444,544.3 |
| Desktop | V1 | Transferred bytes | 10 | 440,074 | 440,074 | 440,074 | 0 | 438,137 | 440,074 | 612.5 | 439,880.3 |
| Desktop | V2 | Transferred bytes | 10 | 444,502 | 444,502 | 444,502 | 0 | 442,565 | 444,502 | 612.5 | 444,308.3 |
| Desktop | V3 | Transferred bytes | 10 | 444,736 | 444,736 | 444,736 | 0 | 442,799 | 444,736 | 612.5 | 444,542.3 |
| Desktop | V3B | Transferred bytes | 10 | 444,738 | 444,738 | 444,738 | 0 | 442,801 | 444,738 | 612.5 | 444,544.3 |

#### Resource bytes

Role: supplementary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Resource bytes | 10 | 1,213,247 | 1,213,247 | 1,213,247 | 0 | 1,200,119 | 1,213,247 | 4,151.4 | 1,211,934.2 |
| Mobile | V2 | Resource bytes | 10 | 1,217,627 | 1,217,627 | 1,217,627 | 0 | 1,204,499 | 1,217,627 | 4,151.4 | 1,216,314.2 |
| Mobile | V3 | Resource bytes | 10 | 1,217,861 | 1,217,861 | 1,217,861 | 0 | 1,204,733 | 1,217,861 | 4,151.4 | 1,216,548.2 |
| Mobile | V3B | Resource bytes | 10 | 1,217,863 | 1,217,863 | 1,217,863 | 0 | 1,204,735 | 1,217,863 | 4,151.4 | 1,216,550.2 |
| Desktop | V1 | Resource bytes | 10 | 1,213,247 | 1,213,247 | 1,213,247 | 0 | 1,200,119 | 1,213,247 | 4,151.4 | 1,211,934.2 |
| Desktop | V2 | Resource bytes | 10 | 1,217,627 | 1,217,627 | 1,217,627 | 0 | 1,204,499 | 1,217,627 | 4,151.4 | 1,216,314.2 |
| Desktop | V3 | Resource bytes | 10 | 1,217,861 | 1,217,861 | 1,217,861 | 0 | 1,204,733 | 1,217,861 | 4,151.4 | 1,216,548.2 |
| Desktop | V3B | Resource bytes | 10 | 1,217,863 | 1,217,863 | 1,217,863 | 0 | 1,204,735 | 1,217,863 | 4,151.4 | 1,216,550.2 |

#### Document request start (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Document request start (ms) | 10 | 0.5 | 0.0 | 1.0 | 1.0 | -1.0 | 1.0 | 0.7 | 0.4 |
| Mobile | V2 | Document request start (ms) | 10 | 1.0 | 0.3 | 1.0 | 0.8 | -1.0 | 1.0 | 0.7 | 0.6 |
| Mobile | V3 | Document request start (ms) | 10 | 0.0 | 0.0 | 0.0 | 0.0 | -1.0 | 1.0 | 0.6 | 0.1 |
| Mobile | V3B | Document request start (ms) | 10 | 0.0 | 0.0 | 1.0 | 1.0 | -1.0 | 1.0 | 0.7 | 0.3 |
| Desktop | V1 | Document request start (ms) | 10 | 0.5 | 0.0 | 1.0 | 1.0 | 0.0 | 1.0 | 0.5 | 0.5 |
| Desktop | V2 | Document request start (ms) | 10 | 0.0 | 0.0 | 1.0 | 1.0 | -1.0 | 1.0 | 0.7 | 0.3 |
| Desktop | V3 | Document request start (ms) | 10 | 0.0 | 0.0 | 1.0 | 1.0 | 0.0 | 1.0 | 0.5 | 0.4 |
| Desktop | V3B | Document request start (ms) | 10 | 1.0 | 0.0 | 1.0 | 1.0 | -1.0 | 1.0 | 0.7 | 0.5 |

#### Document duration (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Document duration (ms) | 10 | 3609.7 | 3607.4 | 3612.2 | 4.8 | 3605.5 | 3625.2 | 6.8 | 3611.7 |
| Mobile | V2 | Document duration (ms) | 10 | 4521.1 | 4517.2 | 4522.9 | 5.7 | 4514.6 | 4526.5 | 4.1 | 4520.6 |
| Mobile | V3 | Document duration (ms) | 10 | 4520.1 | 4518.4 | 4521.5 | 3.0 | 4516.0 | 4529.5 | 3.6 | 4520.7 |
| Mobile | V3B | Document duration (ms) | 10 | 3523.7 | 3519.0 | 3530.8 | 11.8 | 3512.4 | 3534.7 | 7.8 | 3524.3 |
| Desktop | V1 | Document duration (ms) | 10 | 3524.8 | 3524.2 | 3525.7 | 1.6 | 3522.4 | 3538.9 | 4.6 | 3526.1 |
| Desktop | V2 | Document duration (ms) | 10 | 4509.6 | 4509.0 | 4511.0 | 2.0 | 4507.2 | 4518.4 | 3.1 | 4510.5 |
| Desktop | V3 | Document duration (ms) | 10 | 4509.9 | 4509.3 | 4511.2 | 1.9 | 4507.7 | 4525.4 | 5.0 | 4511.5 |
| Desktop | V3B | Document duration (ms) | 10 | 3507.1 | 3506.4 | 3508.4 | 2.0 | 3506.2 | 3518.9 | 3.8 | 3508.4 |

#### Document response end (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Document response end (ms) | 10 | 3610.2 | 3607.6 | 3613.2 | 5.5 | 3605.5 | 3624.2 | 6.7 | 3612.1 |
| Mobile | V2 | Document response end (ms) | 10 | 4522.1 | 4518.2 | 4523.4 | 5.2 | 4514.6 | 4527.0 | 3.9 | 4521.2 |
| Mobile | V3 | Document response end (ms) | 10 | 4520.1 | 4518.2 | 4522.1 | 3.9 | 4516.0 | 4529.5 | 3.8 | 4520.8 |
| Mobile | V3B | Document response end (ms) | 10 | 3523.7 | 3519.8 | 3530.8 | 11.0 | 3512.4 | 3535.7 | 7.7 | 3524.6 |
| Desktop | V1 | Document response end (ms) | 10 | 3525.1 | 3524.6 | 3526.4 | 1.8 | 3523.4 | 3538.9 | 4.5 | 3526.6 |
| Desktop | V2 | Document response end (ms) | 10 | 4510.6 | 4509.1 | 4511.1 | 2.0 | 4508.2 | 4517.4 | 2.7 | 4510.8 |
| Desktop | V3 | Document response end (ms) | 10 | 4510.3 | 4509.3 | 4511.9 | 2.6 | 4508.7 | 4525.4 | 4.9 | 4511.9 |
| Desktop | V3B | Document response end (ms) | 10 | 3507.9 | 3507.4 | 3509.2 | 1.8 | 3506.2 | 3517.9 | 3.4 | 3508.9 |

#### DOMContentLoaded (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | DOMContentLoaded (ms) | 10 | 4055.3 | 4053.4 | 4058.3 | 4.9 | 4047.3 | 4513.6 | 144.4 | 4105.3 |
| Mobile | V2 | DOMContentLoaded (ms) | 10 | 4527.6 | 4523.3 | 4529.7 | 6.3 | 4519.4 | 4532.6 | 4.1 | 4526.6 |
| Mobile | V3 | DOMContentLoaded (ms) | 10 | 4524.8 | 4524.2 | 4527.2 | 3.1 | 4522.0 | 4535.5 | 3.9 | 4526.0 |
| Mobile | V3B | DOMContentLoaded (ms) | 10 | 3527.0 | 3523.3 | 3534.8 | 11.5 | 3520.5 | 3540.4 | 7.1 | 3529.1 |
| Desktop | V1 | DOMContentLoaded (ms) | 10 | 3614.7 | 3613.1 | 3617.2 | 4.1 | 3608.1 | 3664.0 | 16.0 | 3619.3 |
| Desktop | V2 | DOMContentLoaded (ms) | 10 | 4511.6 | 4510.6 | 4513.0 | 2.4 | 4509.5 | 4521.8 | 3.6 | 4512.7 |
| Desktop | V3 | DOMContentLoaded (ms) | 10 | 4512.0 | 4511.5 | 4513.4 | 2.0 | 4509.3 | 4525.7 | 4.5 | 4513.3 |
| Desktop | V3B | DOMContentLoaded (ms) | 10 | 3509.3 | 3508.4 | 3510.6 | 2.2 | 3507.8 | 3519.1 | 3.3 | 3510.3 |

#### Load (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Load (ms) | 10 | 5997.9 | 5996.9 | 6003.4 | 6.5 | 5985.5 | 9353.8 | 1059.3 | 6339.8 |
| Mobile | V2 | Load (ms) | 10 | 4528.9 | 4524.4 | 4532.8 | 8.4 | 4520.4 | 7399.0 | 907.9 | 4815.1 |
| Mobile | V3 | Load (ms) | 10 | 4529.3 | 4525.4 | 4533.7 | 8.2 | 4523.5 | 7401.0 | 908.0 | 4816.9 |
| Mobile | V3B | Load (ms) | 10 | 3693.1 | 3684.6 | 3699.8 | 15.2 | 3678.9 | 7254.0 | 1126.6 | 4047.8 |
| Desktop | V1 | Load (ms) | 10 | 4019.4 | 4018.9 | 4020.4 | 1.5 | 4015.8 | 4073.5 | 17.3 | 4024.7 |
| Desktop | V2 | Load (ms) | 10 | 4512.9 | 4511.6 | 4514.3 | 2.7 | 4510.8 | 4527.1 | 4.8 | 4514.2 |
| Desktop | V3 | Load (ms) | 10 | 4513.3 | 4512.7 | 4514.9 | 2.2 | 4510.8 | 4529.6 | 5.4 | 4514.9 |
| Desktop | V3B | Load (ms) | 10 | 3510.4 | 3509.8 | 3511.6 | 1.8 | 3509.4 | 3522.2 | 3.8 | 3511.7 |

Transferred bytes and resource bytes are supplementary size descriptions. Index 01 is the minimum in every byte group. The other nine samples in each group share one byte total.

## 6. Network milestone statistics

Primary milestone times are the Network-sample User Timing marks. Each group below is n=9. Index 01 is absent from every group because the notes file was not stored. Those values were not filled from Performance traces.

Milestone names, from protocol section 11: A dashboard visible, B critical content visible, C chart visible, D recent transactions visible, E budgets visible, F fully completed dashboard.

#### Milestone A (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone A (ms) | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.6 | 6064.3 |
| Mobile | V2 | Milestone A (ms) | 9 | 3715.2 | 3708.1 | 3728.0 | 19.9 | 3705.1 | 3733.1 | 10.7 | 3718.3 |
| Mobile | V3 | Milestone A (ms) | 9 | 3711.6 | 3708.5 | 3715.4 | 6.9 | 3701.1 | 3762.3 | 18.6 | 3717.1 |
| Mobile | V3B | Milestone A (ms) | 9 | 3739.4 | 3735.9 | 3755.1 | 19.2 | 3727.7 | 3771.8 | 14.2 | 3746.0 |
| Desktop | V1 | Milestone A (ms) | 9 | 4035.4 | 4034.8 | 4037.7 | 2.9 | 4032.2 | 4042.3 | 3.2 | 4036.7 |
| Desktop | V2 | Milestone A (ms) | 9 | 1591.4 | 1588.6 | 1596.5 | 7.9 | 1586.6 | 1601.1 | 5.1 | 1592.6 |
| Desktop | V3 | Milestone A (ms) | 9 | 1596.2 | 1591.3 | 1600.1 | 8.8 | 1590.3 | 1602.9 | 5.0 | 1596.0 |
| Desktop | V3B | Milestone A (ms) | 9 | 1591.4 | 1590.1 | 1596.3 | 6.2 | 1589.9 | 1598.3 | 3.3 | 1592.9 |

#### Milestone B (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone B (ms) | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.6 | 6064.4 |
| Mobile | V2 | Milestone B (ms) | 9 | 3715.2 | 3708.7 | 3728.2 | 19.5 | 3705.2 | 3733.1 | 10.7 | 3718.6 |
| Mobile | V3 | Milestone B (ms) | 9 | 3711.7 | 3708.7 | 3715.4 | 6.7 | 3701.1 | 3763.0 | 18.7 | 3717.3 |
| Mobile | V3B | Milestone B (ms) | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop | V1 | Milestone B (ms) | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.2 | 4042.3 | 3.2 | 4036.8 |
| Desktop | V2 | Milestone B (ms) | 9 | 1591.5 | 1588.7 | 1596.5 | 7.8 | 1586.6 | 1601.2 | 5.1 | 1592.6 |
| Desktop | V3 | Milestone B (ms) | 9 | 1596.3 | 1591.3 | 1600.1 | 8.8 | 1590.3 | 1602.9 | 5.0 | 1596.0 |
| Desktop | V3B | Milestone B (ms) | 9 | 1591.4 | 1590.2 | 1596.3 | 6.1 | 1590.0 | 1598.3 | 3.2 | 1592.9 |

#### Milestone C (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone C (ms) | 9 | 6145.5 | 6144.6 | 6149.1 | 4.5 | 6139.2 | 6331.1 | 62.0 | 6166.2 |
| Mobile | V2 | Milestone C (ms) | 9 | 3801.1 | 3792.2 | 3821.1 | 28.9 | 3785.8 | 3838.5 | 18.7 | 3807.3 |
| Mobile | V3 | Milestone C (ms) | 9 | 3801.4 | 3784.1 | 3806.4 | 22.3 | 3780.5 | 3874.8 | 29.1 | 3804.9 |
| Mobile | V3B | Milestone C (ms) | 9 | 3839.6 | 3829.6 | 3853.1 | 23.5 | 3812.8 | 3885.5 | 21.5 | 3842.1 |
| Desktop | V1 | Milestone C (ms) | 9 | 4058.0 | 4057.0 | 4059.3 | 2.3 | 4055.6 | 4064.8 | 3.2 | 4059.1 |
| Desktop | V2 | Milestone C (ms) | 9 | 3542.9 | 3542.8 | 3546.4 | 3.6 | 3536.8 | 3553.4 | 4.8 | 3544.0 |
| Desktop | V3 | Milestone C (ms) | 9 | 3545.3 | 3543.7 | 3551.4 | 7.7 | 3542.0 | 3561.1 | 6.4 | 3548.4 |
| Desktop | V3B | Milestone C (ms) | 9 | 2543.0 | 2538.2 | 2544.8 | 6.6 | 2530.5 | 2545.8 | 5.0 | 2541.3 |

#### Milestone D (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone D (ms) | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.5 | 6064.4 |
| Mobile | V2 | Milestone D (ms) | 9 | 4534.6 | 4530.0 | 4536.4 | 6.4 | 4526.3 | 4538.7 | 4.3 | 4533.3 |
| Mobile | V3 | Milestone D (ms) | 9 | 4531.3 | 4530.3 | 4533.3 | 3.0 | 4527.0 | 4541.4 | 4.3 | 4532.6 |
| Mobile | V3B | Milestone D (ms) | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop | V1 | Milestone D (ms) | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.2 | 4042.3 | 3.2 | 4036.8 |
| Desktop | V2 | Milestone D (ms) | 9 | 4512.2 | 4511.9 | 4513.8 | 1.9 | 4510.3 | 4515.8 | 1.9 | 4512.8 |
| Desktop | V3 | Milestone D (ms) | 9 | 4515.3 | 4512.5 | 4517.7 | 5.2 | 4509.7 | 4519.9 | 3.4 | 4514.9 |
| Desktop | V3B | Milestone D (ms) | 9 | 3511.8 | 3509.3 | 3512.6 | 3.3 | 3508.4 | 3514.8 | 2.1 | 3511.2 |

#### Milestone E (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone E (ms) | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.5 | 6064.4 |
| Mobile | V2 | Milestone E (ms) | 9 | 4040.4 | 4039.8 | 4042.7 | 2.9 | 4037.5 | 4091.0 | 16.9 | 4046.5 |
| Mobile | V3 | Milestone E (ms) | 9 | 4035.3 | 4033.5 | 4039.9 | 6.4 | 4029.3 | 4043.0 | 4.8 | 4035.9 |
| Mobile | V3B | Milestone E (ms) | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop | V1 | Milestone E (ms) | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.4 | 4042.3 | 3.2 | 4036.8 |
| Desktop | V2 | Milestone E (ms) | 9 | 4013.0 | 4012.8 | 4013.8 | 1.0 | 4012.4 | 4025.1 | 4.1 | 4014.8 |
| Desktop | V3 | Milestone E (ms) | 9 | 4013.6 | 4012.9 | 4017.0 | 4.1 | 4012.2 | 4020.4 | 2.8 | 4014.9 |
| Desktop | V3B | Milestone E (ms) | 9 | 3010.3 | 3010.1 | 3010.7 | 0.6 | 3009.3 | 3015.0 | 1.8 | 3010.8 |

#### Milestone F (ms)

Role: primary.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Milestone F (ms) | 9 | 6145.6 | 6144.6 | 6149.1 | 4.5 | 6139.3 | 6331.7 | 62.2 | 6166.4 |
| Mobile | V2 | Milestone F (ms) | 9 | 4534.6 | 4530.0 | 4536.5 | 6.5 | 4526.3 | 4538.9 | 4.3 | 4533.5 |
| Mobile | V3 | Milestone F (ms) | 9 | 4531.3 | 4530.3 | 4533.3 | 3.0 | 4527.1 | 4541.6 | 4.3 | 4532.6 |
| Mobile | V3B | Milestone F (ms) | 9 | 3839.7 | 3829.6 | 3853.2 | 23.6 | 3812.8 | 3885.5 | 21.5 | 3842.3 |
| Desktop | V1 | Milestone F (ms) | 9 | 4058.0 | 4057.1 | 4059.4 | 2.3 | 4055.6 | 4064.9 | 3.2 | 4059.1 |
| Desktop | V2 | Milestone F (ms) | 9 | 4512.3 | 4511.9 | 4513.9 | 2.0 | 4510.3 | 4515.8 | 1.9 | 4512.8 |
| Desktop | V3 | Milestone F (ms) | 9 | 4515.3 | 4512.5 | 4517.8 | 5.3 | 4509.7 | 4520.0 | 3.5 | 4514.9 |
| Desktop | V3B | Milestone F (ms) | 9 | 3511.8 | 3509.3 | 3512.6 | 3.3 | 3508.5 | 3514.8 | 2.1 | 3511.2 |

## 7. Performance descriptive statistics

Performance is diagnostic. Every group is n=3 and includes the S1 DevTools trace and the two S2–S3 CDP traces. These medians corroborate Network milestones and navigation timing. They are not a substitute for the Network n=9 milestone series or for Lighthouse FCP and LCP.

S1 and S2–S3 are different capture methods: DevTools versus CDP Tracing, different day, port, and asset hashes, with extension scripts present only on S1. Desktop trace FCP and LCP medians pool those methods. The three raw Desktop FCP observations are listed in section 9 so the S1 offset stays visible inside n=3.

#### Trace FCP (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace FCP (ms) | 3 | 4075.9 | 4074.3 | 4078.3 | 4.0 | 4072.7 | 4080.6 | 4.0 | 4076.4 |
| Mobile | V2 | Trace FCP (ms) | 3 | 1573.9 | 1559.6 | 1578.2 | 18.6 | 1545.3 | 1582.4 | 19.5 | 1567.2 |
| Mobile | V3 | Trace FCP (ms) | 3 | 1542.3 | 1541.4 | 1543.8 | 2.4 | 1540.5 | 1545.4 | 2.5 | 1542.7 |
| Mobile | V3B | Trace FCP (ms) | 3 | 1555.7 | 1552.0 | 1569.3 | 17.2 | 1548.4 | 1582.9 | 18.2 | 1562.3 |
| Desktop | V1 | Trace FCP (ms) | 3 | 3653.5 | 3653.0 | 3933.1 | 280.2 | 3652.4 | 4212.8 | 323.2 | 3839.6 |
| Desktop | V2 | Trace FCP (ms) | 3 | 1150.6 | 1148.3 | 1416.1 | 267.8 | 1146.0 | 1681.6 | 307.9 | 1326.0 |
| Desktop | V3 | Trace FCP (ms) | 3 | 1164.5 | 1157.9 | 1436.6 | 278.8 | 1151.2 | 1708.7 | 318.1 | 1341.5 |
| Desktop | V3B | Trace FCP (ms) | 3 | 1163.3 | 1161.8 | 1436.8 | 275.0 | 1160.3 | 1710.3 | 316.7 | 1344.6 |

#### Trace LCP (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace LCP (ms) | 3 | 4075.9 | 4074.3 | 4078.3 | 4.0 | 4072.7 | 4080.6 | 4.0 | 4076.4 |
| Mobile | V2 | Trace LCP (ms) | 3 | 1573.9 | 1559.6 | 1578.2 | 18.6 | 1545.3 | 1582.4 | 19.5 | 1567.2 |
| Mobile | V3 | Trace LCP (ms) | 3 | 1542.3 | 1541.4 | 1543.8 | 2.4 | 1540.5 | 1545.4 | 2.5 | 1542.7 |
| Mobile | V3B | Trace LCP (ms) | 3 | 1555.7 | 1552.0 | 1569.3 | 17.2 | 1548.4 | 1582.9 | 18.2 | 1562.3 |
| Desktop | V1 | Trace LCP (ms) | 3 | 3653.5 | 3653.0 | 3933.1 | 280.2 | 3652.4 | 4212.8 | 323.2 | 3839.6 |
| Desktop | V2 | Trace LCP (ms) | 3 | 1150.6 | 1148.3 | 1416.1 | 267.8 | 1146.0 | 1681.6 | 307.9 | 1326.0 |
| Desktop | V3 | Trace LCP (ms) | 3 | 1164.5 | 1157.9 | 1436.6 | 278.8 | 1151.2 | 1708.7 | 318.1 | 1341.5 |
| Desktop | V3B | Trace LCP (ms) | 3 | 1163.3 | 1161.8 | 1436.8 | 275.0 | 1160.3 | 1710.3 | 316.7 | 1344.6 |

#### Trace DOMContentLoaded (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace DOMContentLoaded (ms) | 3 | 4070.0 | 4069.8 | 4075.1 | 5.3 | 4069.6 | 4080.2 | 6.0 | 4073.2 |
| Mobile | V2 | Trace DOMContentLoaded (ms) | 3 | 4547.3 | 4537.1 | 4547.3 | 10.2 | 4526.9 | 4547.3 | 11.8 | 4540.5 |
| Mobile | V3 | Trace DOMContentLoaded (ms) | 3 | 4529.6 | 4527.9 | 4552.1 | 24.2 | 4526.2 | 4574.6 | 27.0 | 4543.5 |
| Mobile | V3B | Trace DOMContentLoaded (ms) | 3 | 3532.3 | 3526.3 | 3554.0 | 27.8 | 3520.2 | 3575.8 | 29.2 | 3542.8 |
| Desktop | V1 | Trace DOMContentLoaded (ms) | 3 | 3631.9 | 3629.9 | 3664.5 | 34.6 | 3627.9 | 3697.1 | 38.9 | 3652.3 |
| Desktop | V2 | Trace DOMContentLoaded (ms) | 3 | 4516.7 | 4516.6 | 4516.7 | 0.1 | 4516.5 | 4516.7 | 0.1 | 4516.6 |
| Desktop | V3 | Trace DOMContentLoaded (ms) | 3 | 4519.1 | 4518.6 | 4520.2 | 1.6 | 4518.1 | 4521.3 | 1.7 | 4519.5 |
| Desktop | V3B | Trace DOMContentLoaded (ms) | 3 | 3513.5 | 3512.4 | 3515.2 | 2.7 | 3511.4 | 3516.9 | 2.8 | 3513.9 |

#### Trace load event end (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace load event end (ms) | 3 | 6071.8 | 6070.6 | 6104.9 | 34.3 | 6069.3 | 6137.9 | 38.9 | 6093.0 |
| Mobile | V2 | Trace load event end (ms) | 3 | 4549.9 | 4542.3 | 4560.1 | 17.9 | 4534.6 | 4570.3 | 17.9 | 4551.6 |
| Mobile | V3 | Trace load event end (ms) | 3 | 4532.4 | 4530.7 | 4563.0 | 32.4 | 4528.9 | 4593.6 | 36.4 | 4551.6 |
| Mobile | V3B | Trace load event end (ms) | 3 | 3789.0 | 3786.6 | 3804.5 | 17.9 | 3784.2 | 3820.0 | 19.4 | 3797.7 |
| Desktop | V1 | Trace load event end (ms) | 3 | 4050.0 | 4049.5 | 4074.8 | 25.4 | 4048.9 | 4099.7 | 29.0 | 4066.2 |
| Desktop | V2 | Trace load event end (ms) | 3 | 4519.2 | 4518.9 | 4521.4 | 2.5 | 4518.5 | 4523.6 | 2.7 | 4520.5 |
| Desktop | V3 | Trace load event end (ms) | 3 | 4523.4 | 4521.5 | 4524.1 | 2.6 | 4519.6 | 4524.9 | 2.7 | 4522.6 |
| Desktop | V3B | Trace load event end (ms) | 3 | 3513.8 | 3513.6 | 3517.0 | 3.5 | 3513.4 | 3520.3 | 3.9 | 3515.8 |

#### Trace milestone A (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone A (ms) | 3 | 6241.4 | 6239.9 | 6262.5 | 22.6 | 6238.3 | 6283.5 | 25.2 | 6254.4 |
| Mobile | V2 | Trace milestone A (ms) | 3 | 3952.8 | 3938.5 | 3968.2 | 29.7 | 3924.3 | 3983.7 | 29.7 | 3953.6 |
| Mobile | V3 | Trace milestone A (ms) | 3 | 3964.5 | 3958.5 | 3964.6 | 6.1 | 3952.4 | 3964.7 | 7.0 | 3960.5 |
| Mobile | V3B | Trace milestone A (ms) | 3 | 3960.6 | 3942.7 | 3967.7 | 25.0 | 3924.9 | 3974.8 | 25.7 | 3953.4 |
| Desktop | V1 | Trace milestone A (ms) | 3 | 4096.5 | 4092.3 | 4114.8 | 22.5 | 4088.0 | 4133.1 | 24.0 | 4105.9 |
| Desktop | V2 | Trace milestone A (ms) | 3 | 1667.1 | 1663.6 | 1676.7 | 13.1 | 1660.0 | 1686.3 | 13.6 | 1671.1 |
| Desktop | V3 | Trace milestone A (ms) | 3 | 1656.8 | 1656.3 | 1673.5 | 17.2 | 1655.8 | 1690.2 | 19.6 | 1667.6 |
| Desktop | V3B | Trace milestone A (ms) | 3 | 1671.7 | 1667.4 | 1696.9 | 29.5 | 1663.1 | 1722.2 | 31.9 | 1685.7 |

#### Trace milestone B (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone B (ms) | 3 | 6241.5 | 6240.1 | 6262.7 | 22.6 | 6238.7 | 6283.8 | 25.3 | 6254.7 |
| Mobile | V2 | Trace milestone B (ms) | 3 | 3952.8 | 3938.8 | 3968.8 | 30.1 | 3924.8 | 3984.9 | 30.1 | 3954.2 |
| Mobile | V3 | Trace milestone B (ms) | 3 | 3964.7 | 3958.5 | 3964.9 | 6.4 | 3952.4 | 3965.1 | 7.2 | 3960.7 |
| Mobile | V3B | Trace milestone B (ms) | 3 | 3960.6 | 3942.8 | 3967.8 | 25.0 | 3925.0 | 3974.9 | 25.7 | 3953.5 |
| Desktop | V1 | Trace milestone B (ms) | 3 | 4096.6 | 4092.4 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop | V2 | Trace milestone B (ms) | 3 | 1667.3 | 1663.8 | 1676.8 | 13.1 | 1660.2 | 1686.4 | 13.6 | 1671.3 |
| Desktop | V3 | Trace milestone B (ms) | 3 | 1656.9 | 1656.4 | 1673.5 | 17.1 | 1655.9 | 1690.2 | 19.5 | 1667.7 |
| Desktop | V3B | Trace milestone B (ms) | 3 | 1671.9 | 1667.6 | 1697.0 | 29.5 | 1663.2 | 1722.2 | 31.9 | 1685.8 |

#### Trace milestone C (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone C (ms) | 3 | 6502.0 | 6498.9 | 6502.2 | 3.3 | 6495.8 | 6502.3 | 3.7 | 6500.0 |
| Mobile | V2 | Trace milestone C (ms) | 3 | 4157.3 | 4146.2 | 4203.8 | 57.5 | 4135.2 | 4250.2 | 61.0 | 4180.9 |
| Mobile | V3 | Trace milestone C (ms) | 3 | 4185.4 | 4161.5 | 4195.1 | 33.6 | 4137.7 | 4204.8 | 34.5 | 4176.0 |
| Mobile | V3B | Trace milestone C (ms) | 3 | 4223.2 | 4166.9 | 4231.9 | 64.9 | 4110.7 | 4240.5 | 70.5 | 4191.5 |
| Desktop | V1 | Trace milestone C (ms) | 3 | 4174.9 | 4162.9 | 4177.2 | 14.4 | 4150.8 | 4179.6 | 15.5 | 4168.4 |
| Desktop | V2 | Trace milestone C (ms) | 3 | 3577.5 | 3568.8 | 3601.0 | 32.2 | 3560.0 | 3624.4 | 33.3 | 3587.3 |
| Desktop | V3 | Trace milestone C (ms) | 3 | 3583.1 | 3571.6 | 3589.2 | 17.6 | 3560.2 | 3595.3 | 17.8 | 3579.5 |
| Desktop | V3B | Trace milestone C (ms) | 3 | 2567.5 | 2565.4 | 2572.2 | 6.8 | 2563.3 | 2576.9 | 7.0 | 2569.2 |

#### Trace milestone D (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone D (ms) | 3 | 6241.5 | 6240.2 | 6262.7 | 22.5 | 6238.8 | 6283.8 | 25.2 | 6254.7 |
| Mobile | V2 | Trace milestone D (ms) | 3 | 4550.6 | 4538.1 | 4595.0 | 56.9 | 4525.6 | 4639.4 | 59.8 | 4571.9 |
| Mobile | V3 | Trace milestone D (ms) | 3 | 4574.5 | 4565.4 | 4585.2 | 19.8 | 4556.3 | 4595.9 | 19.8 | 4575.6 |
| Mobile | V3B | Trace milestone D (ms) | 3 | 3961.0 | 3943.0 | 3968.0 | 25.0 | 3925.0 | 3974.9 | 25.8 | 3953.6 |
| Desktop | V1 | Trace milestone D (ms) | 3 | 4096.7 | 4092.5 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop | V2 | Trace milestone D (ms) | 3 | 4516.2 | 4515.4 | 4516.2 | 0.8 | 4514.5 | 4516.2 | 1.0 | 4515.6 |
| Desktop | V3 | Trace milestone D (ms) | 3 | 4520.4 | 4518.0 | 4520.7 | 2.6 | 4515.7 | 4520.9 | 2.9 | 4519.0 |
| Desktop | V3B | Trace milestone D (ms) | 3 | 3510.9 | 3510.7 | 3511.7 | 1.0 | 3510.5 | 3512.4 | 1.0 | 3511.3 |

#### Trace milestone E (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone E (ms) | 3 | 6241.5 | 6240.2 | 6262.7 | 22.5 | 6238.8 | 6283.8 | 25.2 | 6254.7 |
| Mobile | V2 | Trace milestone E (ms) | 3 | 4221.2 | 4213.6 | 4277.8 | 64.2 | 4206.1 | 4334.4 | 70.1 | 4253.9 |
| Mobile | V3 | Trace milestone E (ms) | 3 | 4253.2 | 4242.1 | 4269.4 | 27.3 | 4230.9 | 4285.5 | 27.5 | 4256.5 |
| Mobile | V3B | Trace milestone E (ms) | 3 | 3961.0 | 3943.0 | 3968.0 | 25.0 | 3925.0 | 3974.9 | 25.8 | 3953.6 |
| Desktop | V1 | Trace milestone E (ms) | 3 | 4096.7 | 4092.5 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop | V2 | Trace milestone E (ms) | 3 | 4015.7 | 4015.7 | 4017.1 | 1.4 | 4015.7 | 4018.6 | 1.7 | 4016.7 |
| Desktop | V3 | Trace milestone E (ms) | 3 | 4016.7 | 4015.7 | 4017.6 | 1.9 | 4014.8 | 4018.5 | 1.9 | 4016.7 |
| Desktop | V3B | Trace milestone E (ms) | 3 | 3012.9 | 3011.7 | 3013.7 | 2.0 | 3010.5 | 3014.4 | 2.0 | 3012.6 |

#### Trace milestone F (ms)

Role: diagnostic.

| Profile | Variant | Metric | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | V1 | Trace milestone F (ms) | 3 | 6502.7 | 6499.5 | 6502.9 | 3.4 | 6496.3 | 6503.1 | 3.8 | 6500.7 |
| Mobile | V2 | Trace milestone F (ms) | 3 | 4550.6 | 4538.1 | 4595.1 | 57.0 | 4525.7 | 4639.6 | 59.9 | 4572.0 |
| Mobile | V3 | Trace milestone F (ms) | 3 | 4574.5 | 4565.4 | 4585.2 | 19.8 | 4556.3 | 4595.9 | 19.8 | 4575.6 |
| Mobile | V3B | Trace milestone F (ms) | 3 | 4223.3 | 4167.3 | 4232.3 | 65.0 | 4111.4 | 4241.3 | 70.4 | 4192.0 |
| Desktop | V1 | Trace milestone F (ms) | 3 | 4175.0 | 4163.0 | 4177.3 | 14.4 | 4150.9 | 4179.7 | 15.5 | 4168.5 |
| Desktop | V2 | Trace milestone F (ms) | 3 | 4516.2 | 4515.4 | 4516.3 | 0.9 | 4514.5 | 4516.3 | 1.0 | 4515.7 |
| Desktop | V3 | Trace milestone F (ms) | 3 | 4520.4 | 4518.1 | 4520.7 | 2.6 | 4515.8 | 4521.0 | 2.8 | 4519.1 |
| Desktop | V3B | Trace milestone F (ms) | 3 | 3511.0 | 3510.8 | 3511.7 | 0.9 | 3510.6 | 3512.4 | 0.9 | 3511.3 |

### DOMContentLoaded definition

The reported trace DCL is the `domContentLoadedEventStart` paired with `MarkDOMContent` on the experiment frame. That is the document DCL marker.

The dataset audit’s DCL column matches this value on 11 Desktop traces. On all 12 Mobile traces, and on `D-PF-V3-02`, the audit column is an earlier `domContentLoadedEventStart` about 0.2–7.9 ms after navigation start. This processing keeps one definition for all 24 traces. The earlier timestamp remains in the JSON field `dcl_early_ms` and is not used in the tables above. No trace was removed.

Reported trace DCL for `D-PF-V3-02` is the document event at 4519.1 ms. The audit column for that sample is 3.1 ms, which is the earlier event.

Trace load in these tables is `loadEventEnd`. The audit Load column is `loadEventStart`. On these 24 traces the end is 0.0–0.8 ms after the start.

## 8. V3B vs V3 comparisons

Δ median = V3B median − V3 median. Relative change (%) = (Δ median / V3 median) × 100. A negative relative change is a lower measured value for V3B. These tables do not assign a better variant, a winner, or a significant result.

### 8.1 Lighthouse, primary and secondary

n is 10/10. TTI is excluded here because it is informational.

#### Mobile

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Performance score | 10/10 | 81.5 | 79.0 | 2.5 | 3.2 |
| FCP (ms) | 10/10 | 3561.1 | 3598.7 | -37.7 | -1.0 |
| LCP (ms) | 10/10 | 3561.1 | 3609.2 | -48.1 | -1.3 |
| Speed Index (ms) | 10/10 | 4428.2 | 5236.0 | -807.8 | -15.4 |
| TBT (ms) | 10/10 | 35.9 | 39.5 | -3.6 | -9.2 |
| CLS | 10/10 | 0.0000 | 0.0000 | 0.0000 | not defined |

#### Desktop

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Performance score | 10/10 | 95.5 | 94.0 | 1.5 | 1.6 |
| FCP (ms) | 10/10 | 802.8 | 805.2 | -2.4 | -0.3 |
| LCP (ms) | 10/10 | 832.8 | 825.2 | 7.6 | 0.9 |
| Speed Index (ms) | 10/10 | 1901.7 | 2317.9 | -416.2 | -18.0 |
| TBT (ms) | 10/10 | 0.0 | 0.0 | 0.0 | not defined |
| CLS | 10/10 | 0.0134 | 0.0134 | 0.0000 | 0.0 |

### 8.2 Network HAR

n is 10/10.

#### Mobile

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Request count | 10/10 | 53 | 53 | 0 | 0.0 |
| Static asset count | 10/10 | 52 | 52 | 0 | 0.0 |
| Duplicate URL count | 10/10 | 0 | 0 | 0 | not defined |
| Browser-visible Server Function RPC count | 10/10 | 0 | 0 | 0 | not defined |
| Transferred bytes | 10/10 | 444,738 | 444,736 | 2 | 0.0 |
| Resource bytes | 10/10 | 1,217,863 | 1,217,861 | 2 | 0.0 |
| Document request start (ms) | 10/10 | 0.0 | 0.0 | 0.0 | not defined |
| Document duration (ms) | 10/10 | 3523.7 | 4520.1 | -996.4 | -22.0 |
| Document response end (ms) | 10/10 | 3523.7 | 4520.1 | -996.4 | -22.0 |
| DOMContentLoaded (ms) | 10/10 | 3527.0 | 4524.8 | -997.8 | -22.1 |
| Load (ms) | 10/10 | 3693.1 | 4529.3 | -836.2 | -18.5 |

#### Desktop

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Request count | 10/10 | 53 | 53 | 0 | 0.0 |
| Static asset count | 10/10 | 52 | 52 | 0 | 0.0 |
| Duplicate URL count | 10/10 | 0 | 0 | 0 | not defined |
| Browser-visible Server Function RPC count | 10/10 | 0 | 0 | 0 | not defined |
| Transferred bytes | 10/10 | 444,738 | 444,736 | 2 | 0.0 |
| Resource bytes | 10/10 | 1,217,863 | 1,217,861 | 2 | 0.0 |
| Document request start (ms) | 10/10 | 1.0 | 0.0 | 1.0 | not defined |
| Document duration (ms) | 10/10 | 3507.1 | 4509.9 | -1002.8 | -22.2 |
| Document response end (ms) | 10/10 | 3507.9 | 4510.3 | -1002.5 | -22.2 |
| DOMContentLoaded (ms) | 10/10 | 3509.3 | 4512.0 | -1002.7 | -22.2 |
| Load (ms) | 10/10 | 3510.4 | 4513.3 | -1002.8 | -22.2 |

### 8.3 Network milestones

n is 9/9. Protocol section 12.1 names milestones C, D, E, and F as the V3 versus V3B comparison. Milestones A and B are included because both groups have stored notes.

#### Mobile

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Milestone A (ms) | 9/9 | 3739.4 | 3711.6 | 27.8 | 0.7 |
| Milestone B (ms) | 9/9 | 3740.7 | 3711.7 | 29.0 | 0.8 |
| Milestone C (ms) | 9/9 | 3839.6 | 3801.4 | 38.2 | 1.0 |
| Milestone D (ms) | 9/9 | 3740.7 | 4531.3 | -790.6 | -17.4 |
| Milestone E (ms) | 9/9 | 3740.7 | 4035.3 | -294.6 | -7.3 |
| Milestone F (ms) | 9/9 | 3839.7 | 4531.3 | -691.6 | -15.3 |

#### Desktop

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Milestone A (ms) | 9/9 | 1591.4 | 1596.2 | -4.8 | -0.3 |
| Milestone B (ms) | 9/9 | 1591.4 | 1596.3 | -4.9 | -0.3 |
| Milestone C (ms) | 9/9 | 2543.0 | 3545.3 | -1002.3 | -28.3 |
| Milestone D (ms) | 9/9 | 3511.8 | 4515.3 | -1003.5 | -22.2 |
| Milestone E (ms) | 9/9 | 3010.3 | 4013.6 | -1003.3 | -25.0 |
| Milestone F (ms) | 9/9 | 3511.8 | 4515.3 | -1003.5 | -22.2 |

### 8.4 Performance, diagnostic corroboration

n is 3/3. These deltas mix the S1 DevTools trace with two CDP traces, including the Desktop FCP/LCP capture split. They are corroboration of the Network milestone comparison, not a second primary result.

#### Mobile

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trace FCP (ms) | 3/3 | 1555.7 | 1542.3 | 13.4 | 0.9 |
| Trace LCP (ms) | 3/3 | 1555.7 | 1542.3 | 13.4 | 0.9 |
| Trace DOMContentLoaded (ms) | 3/3 | 3532.3 | 4529.6 | -997.3 | -22.0 |
| Trace load event end (ms) | 3/3 | 3789.0 | 4532.4 | -743.4 | -16.4 |
| Trace milestone A (ms) | 3/3 | 3960.6 | 3964.5 | -3.9 | -0.1 |
| Trace milestone B (ms) | 3/3 | 3960.6 | 3964.7 | -4.1 | -0.1 |
| Trace milestone C (ms) | 3/3 | 4223.2 | 4185.4 | 37.8 | 0.9 |
| Trace milestone D (ms) | 3/3 | 3961.0 | 4574.5 | -613.5 | -13.4 |
| Trace milestone E (ms) | 3/3 | 3961.0 | 4253.2 | -292.2 | -6.9 |
| Trace milestone F (ms) | 3/3 | 4223.3 | 4574.5 | -351.2 | -7.7 |

#### Desktop

| Metric | n (V3B/V3) | V3B median | V3 median | Δ median | Relative change (%) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trace FCP (ms) | 3/3 | 1163.3 | 1164.5 | -1.2 | -0.1 |
| Trace LCP (ms) | 3/3 | 1163.3 | 1164.5 | -1.2 | -0.1 |
| Trace DOMContentLoaded (ms) | 3/3 | 3513.5 | 4519.1 | -1005.6 | -22.3 |
| Trace load event end (ms) | 3/3 | 3513.8 | 4523.4 | -1009.6 | -22.3 |
| Trace milestone A (ms) | 3/3 | 1671.7 | 1656.8 | 14.9 | 0.9 |
| Trace milestone B (ms) | 3/3 | 1671.9 | 1656.9 | 15.0 | 0.9 |
| Trace milestone C (ms) | 3/3 | 2567.5 | 3583.1 | -1015.6 | -28.3 |
| Trace milestone D (ms) | 3/3 | 3510.9 | 4520.4 | -1009.5 | -22.3 |
| Trace milestone E (ms) | 3/3 | 3012.9 | 4016.7 | -1003.8 | -25.0 |
| Trace milestone F (ms) | 3/3 | 3511.0 | 4520.4 | -1009.4 | -22.3 |

## 9. Methodological caveats

### Samples retained with a known cohort difference

Index 01 is a separate collection cohort: 2026-09-28 for Lighthouse and Network, 2026-09-29 for Performance, origin port 4173. Index 02 and later is 2026-09-30, port 3000. The build SHA on the later Network notes and CDP traces is `8c8df0b3266b32b841735126151e9b1b1b2b94ba`. The index-01 build SHA is not verifiable from these artifacts. All index-01 samples stay in the n=10 and n=3 series that apply to them.

Lighthouse screen emulation, counted from the JSON in this processing:

- Screen emulation disabled: 8 of 80.
- Desktop index 01 stored screen: 412×823, device scale 1.75, emulation disabled=True, formFactor=desktop. `formFactor` on those four files is desktop. Throttling on those four files is the desktop preset. The stored screen block is the mobile size and scale, and emulation is disabled. That mismatch stays attached to Desktop Lighthouse n=10.

The four Desktop S1 Lighthouse samples inside n=10:

| Sample | Performance score | FCP (ms) | LCP (ms) | Speed Index (ms) | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| D-LH-V1-01 | 93.0 | 656.7 | 656.7 | 2619.0 | 0.0000 |
| D-LH-V2-01 | 96.0 | 569.4 | 569.4 | 2111.2 | 0.0102 |
| D-LH-V3-01 | 95.0 | 658.0 | 658.0 | 2132.1 | 0.0102 |
| D-LH-V3B-01 | 98.0 | 285.0 | 285.0 | 1709.6 | 0.0095 |

### Performance capture method

S1 Performance traces are DevTools captures. S2–S3 traces are CDP Tracing. Extension scripts are present on S1 only. Emulated device scale is not stored on the eight S1 traces. Desktop `cpuThrottling` is absent on all 12 Desktop traces.

Desktop trace FCP, S1 value and the two CDP values, all retained in n=3:

| Variant | S1 FCP (ms) | CDP FCP (ms) | CDP FCP (ms) |
| --- | ---: | ---: | ---: |
| V1 | 4212.8 | 3652.4 | 3653.5 |
| V2 | 1681.6 | 1146.0 | 1150.6 |
| V3 | 1708.7 | 1151.2 | 1164.5 |
| V3B | 1710.3 | 1160.3 | 1163.3 |

On each Desktop variant the S1 FCP is later than both CDP values. Mobile S1 FCP stays within the same band as its CDP pair. Lighthouse remains the primary FCP and LCP series.

### Tukey flags

Tukey flags on the reported series: **126** metric values across **50** samples. The dataset audit’s series — Lighthouse without TTI, HAR timings without document start and document end, and Network milestones — account for **108** of those flags. The other 18 flags are TTI (7), document request start (4), and document response end (7). Performance trace flags: **0**. No flagged sample was removed. The full flag list is in `final-statistical-analysis.json`.

Flags at least 10% from the group median, excluding informational TTI and the 1 ms document-start clock: **28**. The remaining flags are under 10% and come mostly from tight groups, including byte totals and sub-percent timing differences.

Flags at least 10% from the group median:

| Sample | Group | Metric | Observed | Group median | Deviation from median (%) | Reason |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| D-LH-V1-01 | Desktop V1 | CLS | 0.0000 | 0.0218 | -100.0 | IQR is 0 and the value differs from the group median |
| M-NW-V3B-01 | Mobile V3B | Load (ms) | 7254.0 | 3693.1 | 96.4 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3B-07 | Mobile V3B | TBT (ms) | 65.7 | 35.9 | 83.1 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-07 | Mobile V3 | TBT (ms) | 68.0 | 39.5 | 72.2 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | LCP (ms) | 285.0 | 832.8 | -65.8 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | TBT (ms) | 12.0 | 34.0 | -64.7 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | FCP (ms) | 285.0 | 802.8 | -64.5 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-01 | Mobile V3 | Load (ms) | 7401.0 | 4529.3 | 63.4 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V2-01 | Mobile V2 | Load (ms) | 7399.0 | 4528.9 | 63.4 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | Load (ms) | 9353.8 | 5997.9 | 55.9 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-01 | Mobile V3 | TBT (ms) | 22.0 | 39.5 | -44.3 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | LCP (ms) | 569.4 | 851.2 | -33.1 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | FCP (ms) | 569.4 | 810.9 | -29.8 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | CLS | 0.0095 | 0.0134 | -29.4 | IQR is 0 and the value differs from the group median |
| M-LH-V2-07 | Mobile V2 | FCP (ms) | 2557.5 | 3613.1 | -29.2 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-09 | Mobile V3 | TBT (ms) | 28.0 | 39.5 | -29.1 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | LCP (ms) | 4420.3 | 3481.8 | 27.0 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | CLS | 0.0102 | 0.0134 | -24.2 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3-01 | Desktop V3 | CLS | 0.0102 | 0.0134 | -24.2 | IQR is 0 and the value differs from the group median |
| M-LH-V1-10 | Mobile V1 | TBT (ms) | 42.0 | 34.0 | 23.5 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-10 | Mobile V3 | TBT (ms) | 48.0 | 39.5 | 21.5 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V1-01 | Desktop V1 | FCP (ms) | 656.7 | 788.6 | -16.7 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-08 | Desktop V2 | LCP (ms) | 726.4 | 851.2 | -14.7 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | FCP (ms) | 3939.3 | 3481.8 | 13.1 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | DOMContentLoaded (ms) | 4513.6 | 4055.3 | 11.3 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-08 | Desktop V2 | FCP (ms) | 726.4 | 810.9 | -10.4 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | Performance score | 70.0 | 78.0 | -10.3 | IQR is 0 and the value differs from the group median |
| D-LH-V3B-01 | Desktop V3B | Speed Index (ms) | 1709.6 | 1901.7 | -10.1 | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |

### Filename

`D-LH-V1-01` is stored as `D-LH-V1-01 .json` and `D-LH-V1-01 .html`. The sample was parsed from the spaced JSON path. The file was not renamed.

## 10. Metrics excluded from comparative interpretation

| Metric | Status in this processing |
| --- | --- |
| INP | No numeric value in 80/80 Lighthouse files. Load-only experiment. Not estimated. |
| Lighthouse LCP element | Audit absent in 80/80 files. Not inferred from traces. |
| Network milestones for eight index-01 samples | Notes not stored. Left blank. Not reconstructed. |
| Performance scripting time | Not summarized. S1 and S2–S3 disagree in direction across definitions in the capture-method audit. |
| Performance rendering time | Not summarized. Excluded from comparison across the capture split. |
| Performance painting time | Not summarized. Excluded from comparison across the capture split. |
| Performance long tasks | Not summarized. Excluded from comparison across the capture split. |
| Last network activity → milestone F | Not summarized. The capture-method audit shows the gap changes sign and size between S1 and S2–S3. |
| TTI | Calculated as informational Lighthouse dispersion only. Omitted from V3B versus V3. |
| Early trace `domContentLoadedEventStart` | Stored per sample in JSON. Omitted from the reported DCL median. |

Suitable for the final thesis analysis: Lighthouse performance score, FCP, LCP, Speed Index, CLS, and TBT; Network request count, static asset count, duplicate URL count, browser-visible Server Function RPC count, document start, document duration, document response end, DOMContentLoaded, load, and milestones A–F at the n stated above. Transferred bytes and resource bytes can be reported as size, separately from the timing comparison.

Diagnostic only: Performance FCP, LCP, DOMContentLoaded, load event end, and milestones A–F, each at n=3, with the S1 capture-method caveat. Desktop trace FCP and LCP are reported with the S1 versus CDP values visible.

## 11. Recommended tables and figures for Chapter 4

Use profile-separate displays. Caption every display with the tool, the metric, and n. Keep index 01 inside Lighthouse and HAR displays. State n=9 on Network milestone displays. State the Desktop Lighthouse S1 screen mismatch on Desktop Lighthouse displays.

1. Table, Lighthouse medians by variant, separate Mobile and Desktop panels. Columns: variant, n, performance score, FCP, LCP, Speed Index, TBT, CLS. n=10.
2. Appendix table, the dispersion rows in section 4, for the same metrics.
3. Table, Network medians by variant, separate profiles. Columns: variant, n, request count, document duration, DOMContentLoaded, load, Server Function RPC count, duplicate URL count. n=10.
4. Table, Network milestone medians B–F by variant, separate profiles, with A available from section 6. n=9. Caption the eight absent index-01 notes.
5. Table, V3B versus V3, section 8.1 through 8.3, split by profile. This is the numeric table for Chapter 4.5. Leave hypothesis language out of the table.
6. Figure, median Network milestones B–F by variant, one panel per profile, with an interval from Q1 to Q3. n=9.
7. Figure, Lighthouse LCP and Speed Index medians by variant, one panel per profile. n=10. Desktop caption includes the S1 screen-emulation mismatch.
8. Small size table, transferred bytes and resource bytes by variant. The two profiles match. n=10.
9. Diagnostic table or appendix, Performance milestone medians A–F, n=3, captioned as corroboration and as a mixed capture method.
10. Do not chart scripting, rendering, painting, long tasks, or the last-network-activity gap.

## 12. Numerical findings to carry into Chapter 4

Quote medians with the n and IQR below. Full dispersion is in sections 4–7. Δ is V3B median minus V3 median. A negative relative change is a lower V3B median.

### Lighthouse medians (n=10)

**Performance score**

- Mobile: V1 78.0 (IQR 0.0); V2 79.0 (IQR 5.3); V3 79.0 (IQR 5.3); V3B 81.5 (IQR 4.8)
- Desktop: V1 93.0 (IQR 1.0); V2 94.0 (IQR 0.0); V3 94.0 (IQR 0.0); V3B 95.5 (IQR 1.0)

**FCP (ms)**

- Mobile: V1 3481.8 (IQR 10.0); V2 3613.1 (IQR 382.2); V3 3598.7 (IQR 421.2); V3B 3561.1 (IQR 460.4)
- Desktop: V1 788.6 (IQR 66.6); V2 810.9 (IQR 20.8); V3 805.2 (IQR 79.5); V3B 802.8 (IQR 35.5)

**LCP (ms)**

- Mobile: V1 3481.8 (IQR 10.0); V2 3613.1 (IQR 494.7); V3 3609.2 (IQR 544.0); V3B 3561.1 (IQR 460.4)
- Desktop: V1 828.6 (IQR 141.6); V2 851.2 (IQR 41.2); V3 825.2 (IQR 119.5); V3B 832.8 (IQR 70.5)

**Speed Index (ms)**

- Mobile: V1 6902.9 (IQR 39.6); V2 5255.5 (IQR 164.1); V3 5236.0 (IQR 83.5); V3B 4428.2 (IQR 73.3)
- Desktop: V1 2621.0 (IQR 29.0); V2 2314.3 (IQR 10.1); V3 2317.9 (IQR 25.7); V3B 1901.7 (IQR 21.3)

**TBT (ms)**

- Mobile: V1 34.0 (IQR 3.5); V2 39.5 (IQR 11.3); V3 39.5 (IQR 3.8); V3B 35.9 (IQR 10.8)
- Desktop: V1 0.0 (IQR 0.0); V2 0.0 (IQR 0.0); V3 0.0 (IQR 0.0); V3B 0.0 (IQR 0.0)

**CLS**

- Mobile: V1 0.0000 (IQR 0.0000); V2 0.0000 (IQR 0.0000); V3 0.0000 (IQR 0.0000); V3B 0.0000 (IQR 0.0000)
- Desktop: V1 0.0218 (IQR 0.0000); V2 0.0134 (IQR 0.0010); V3 0.0134 (IQR 0.0000); V3B 0.0134 (IQR 0.0000)

### Network HAR medians (n=10)

**Request count**

- Mobile: V1 53 (IQR 0); V2 53 (IQR 0); V3 53 (IQR 0); V3B 53 (IQR 0)
- Desktop: V1 53 (IQR 0); V2 53 (IQR 0); V3 53 (IQR 0); V3B 53 (IQR 0)

**Static asset count**

- Mobile: V1 52 (IQR 0); V2 52 (IQR 0); V3 52 (IQR 0); V3B 52 (IQR 0)
- Desktop: V1 52 (IQR 0); V2 52 (IQR 0); V3 52 (IQR 0); V3B 52 (IQR 0)

**Duplicate URL count**

- Mobile: V1 0 (IQR 0); V2 0 (IQR 0); V3 0 (IQR 0); V3B 0 (IQR 0)
- Desktop: V1 0 (IQR 0); V2 0 (IQR 0); V3 0 (IQR 0); V3B 0 (IQR 0)

**Browser-visible Server Function RPC count**

- Mobile: V1 0 (IQR 0); V2 0 (IQR 0); V3 0 (IQR 0); V3B 0 (IQR 0)
- Desktop: V1 0 (IQR 0); V2 0 (IQR 0); V3 0 (IQR 0); V3B 0 (IQR 0)

**Document request start (ms)**

- Mobile: V1 0.5 (IQR 1.0); V2 1.0 (IQR 0.8); V3 0.0 (IQR 0.0); V3B 0.0 (IQR 1.0)
- Desktop: V1 0.5 (IQR 1.0); V2 0.0 (IQR 1.0); V3 0.0 (IQR 1.0); V3B 1.0 (IQR 1.0)

**Document duration (ms)**

- Mobile: V1 3609.7 (IQR 4.8); V2 4521.1 (IQR 5.7); V3 4520.1 (IQR 3.0); V3B 3523.7 (IQR 11.8)
- Desktop: V1 3524.8 (IQR 1.6); V2 4509.6 (IQR 2.0); V3 4509.9 (IQR 1.9); V3B 3507.1 (IQR 2.0)

**Document response end (ms)**

- Mobile: V1 3610.2 (IQR 5.5); V2 4522.1 (IQR 5.2); V3 4520.1 (IQR 3.9); V3B 3523.7 (IQR 11.0)
- Desktop: V1 3525.1 (IQR 1.8); V2 4510.6 (IQR 2.0); V3 4510.3 (IQR 2.6); V3B 3507.9 (IQR 1.8)

**DOMContentLoaded (ms)**

- Mobile: V1 4055.3 (IQR 4.9); V2 4527.6 (IQR 6.3); V3 4524.8 (IQR 3.1); V3B 3527.0 (IQR 11.5)
- Desktop: V1 3614.7 (IQR 4.1); V2 4511.6 (IQR 2.4); V3 4512.0 (IQR 2.0); V3B 3509.3 (IQR 2.2)

**Load (ms)**

- Mobile: V1 5997.9 (IQR 6.5); V2 4528.9 (IQR 8.4); V3 4529.3 (IQR 8.2); V3B 3693.1 (IQR 15.2)
- Desktop: V1 4019.4 (IQR 1.5); V2 4512.9 (IQR 2.7); V3 4513.3 (IQR 2.2); V3B 3510.4 (IQR 1.8)

### Network milestone medians (n=9)

**Milestone A (ms)**

- Mobile: V1 6051.3 (IQR 6.4); V2 3715.2 (IQR 19.9); V3 3711.6 (IQR 6.9); V3B 3739.4 (IQR 19.2)
- Desktop: V1 4035.4 (IQR 2.9); V2 1591.4 (IQR 7.9); V3 1596.2 (IQR 8.8); V3B 1591.4 (IQR 6.2)

**Milestone B (ms)**

- Mobile: V1 6051.3 (IQR 6.4); V2 3715.2 (IQR 19.5); V3 3711.7 (IQR 6.7); V3B 3740.7 (IQR 19.3)
- Desktop: V1 4035.4 (IQR 3.0); V2 1591.5 (IQR 7.8); V3 1596.3 (IQR 8.8); V3B 1591.4 (IQR 6.1)

**Milestone C (ms)**

- Mobile: V1 6145.5 (IQR 4.5); V2 3801.1 (IQR 28.9); V3 3801.4 (IQR 22.3); V3B 3839.6 (IQR 23.5)
- Desktop: V1 4058.0 (IQR 2.3); V2 3542.9 (IQR 3.6); V3 3545.3 (IQR 7.7); V3B 2543.0 (IQR 6.6)

**Milestone D (ms)**

- Mobile: V1 6051.3 (IQR 6.4); V2 4534.6 (IQR 6.4); V3 4531.3 (IQR 3.0); V3B 3740.7 (IQR 19.3)
- Desktop: V1 4035.4 (IQR 3.0); V2 4512.2 (IQR 1.9); V3 4515.3 (IQR 5.2); V3B 3511.8 (IQR 3.3)

**Milestone E (ms)**

- Mobile: V1 6051.3 (IQR 6.4); V2 4040.4 (IQR 2.9); V3 4035.3 (IQR 6.4); V3B 3740.7 (IQR 19.3)
- Desktop: V1 4035.4 (IQR 3.0); V2 4013.0 (IQR 1.0); V3 4013.6 (IQR 4.1); V3B 3010.3 (IQR 0.6)

**Milestone F (ms)**

- Mobile: V1 6145.6 (IQR 4.5); V2 4534.6 (IQR 6.5); V3 4531.3 (IQR 3.0); V3B 3839.7 (IQR 23.6)
- Desktop: V1 4058.0 (IQR 2.3); V2 4512.3 (IQR 2.0); V3 4515.3 (IQR 5.3); V3B 3511.8 (IQR 3.3)

### V3B median minus V3 median

Lighthouse, n=10/10:

- Mobile Performance score: V3B 81.5, V3 79.0, Δ 2.5, relative change 3.2%
- Mobile FCP (ms): V3B 3561.1, V3 3598.7, Δ -37.7, relative change -1.0%
- Mobile LCP (ms): V3B 3561.1, V3 3609.2, Δ -48.1, relative change -1.3%
- Mobile Speed Index (ms): V3B 4428.2, V3 5236.0, Δ -807.8, relative change -15.4%
- Mobile TBT (ms): V3B 35.9, V3 39.5, Δ -3.6, relative change -9.2%
- Mobile CLS: V3B 0.0000, V3 0.0000, Δ 0.0000, relative change not defined
- Desktop Performance score: V3B 95.5, V3 94.0, Δ 1.5, relative change 1.6%
- Desktop FCP (ms): V3B 802.8, V3 805.2, Δ -2.4, relative change -0.3%
- Desktop LCP (ms): V3B 832.8, V3 825.2, Δ 7.6, relative change 0.9%
- Desktop Speed Index (ms): V3B 1901.7, V3 2317.9, Δ -416.2, relative change -18.0%
- Desktop TBT (ms): V3B 0.0, V3 0.0, Δ 0.0, relative change not defined
- Desktop CLS: V3B 0.0134, V3 0.0134, Δ 0.0000, relative change 0.0%

Network milestones C–F, n=9/9:

- Mobile Milestone C (ms): V3B 3839.6, V3 3801.4, Δ 38.2, relative change 1.0%
- Mobile Milestone D (ms): V3B 3740.7, V3 4531.3, Δ -790.6, relative change -17.4%
- Mobile Milestone E (ms): V3B 3740.7, V3 4035.3, Δ -294.6, relative change -7.3%
- Mobile Milestone F (ms): V3B 3839.7, V3 4531.3, Δ -691.6, relative change -15.3%
- Desktop Milestone C (ms): V3B 2543.0, V3 3545.3, Δ -1002.3, relative change -28.3%
- Desktop Milestone D (ms): V3B 3511.8, V3 4515.3, Δ -1003.5, relative change -22.2%
- Desktop Milestone E (ms): V3B 3010.3, V3 4013.6, Δ -1003.3, relative change -25.0%
- Desktop Milestone F (ms): V3B 3511.8, V3 4515.3, Δ -1003.5, relative change -22.2%

Network document duration and load, n=10/10:

- Mobile Document duration (ms): V3B 3523.7, V3 4520.1, Δ -996.4, relative change -22.0%
- Mobile Document response end (ms): V3B 3523.7, V3 4520.1, Δ -996.4, relative change -22.0%
- Mobile DOMContentLoaded (ms): V3B 3527.0, V3 4524.8, Δ -997.8, relative change -22.1%
- Mobile Load (ms): V3B 3693.1, V3 4529.3, Δ -836.2, relative change -18.5%
- Desktop Document duration (ms): V3B 3507.1, V3 4509.9, Δ -1002.8, relative change -22.2%
- Desktop Document response end (ms): V3B 3507.9, V3 4510.3, Δ -1002.5, relative change -22.2%
- Desktop DOMContentLoaded (ms): V3B 3509.3, V3 4512.0, Δ -1002.7, relative change -22.2%
- Desktop Load (ms): V3B 3510.4, V3 4513.3, Δ -1002.8, relative change -22.2%

Performance diagnostic medians are in section 7. Carry them into Chapter 4 only as corroboration, with the capture-method caveat.

## Processing record

- Lighthouse files parsed: 80
- Network HAR files parsed: 80
- Network notes files parsed: 72
- Network notes absent: 8
- Performance files parsed: 24
- Total sample files: 184
- Raw measurement files were opened for reading and were not written.
- Tables in this file were written by `final-statistical-analysis.py` from the raw artifacts.
- Machine-readable exports: `final-statistical-analysis.json` and `final-statistical-analysis.csv`.

