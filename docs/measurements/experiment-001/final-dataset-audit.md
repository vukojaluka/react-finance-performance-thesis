# Experiment 001 — Final dataset audit

Audit date: 2026-09-30. This document checks the stored final measurement artifacts. It does not rerun measurements, change raw files, or interpret hypotheses.

Overall status: **WARNING**.

The dataset contains the required 184 samples. Lighthouse runs parsed, Network HARs parsed, and Performance traces contain `exp-milestone-A` through `exp-milestone-F`. Warnings that remain are the index-01 collection cohort, the Desktop Lighthouse S1 screen-emulation block, eight Network samples without stored milestone notes, and a filename space in `D-LH-V1-01`. No sample was removed.

## 1. Audit scope

Status: **PASS** for scope control.

Inspected tree: `docs/measurements/experiment-001/`.

Compared with:

- `docs/experiment-001-measurement-protocol.md`
- `docs/experiment-001-results-template.md`
- `docs/experiment-001-results-audit.md` (prior pilot audit, not this dataset)
- `docs/experiments.md`
- `docs/architecture.md`
- `docs/measurements/experiment-001/README.md`
- `docs/measurements/experiment-001/final-measurement-checklist.md`
- `docs/measurements/experiment-001/final-measurement-tracker.md`
- `docs/measurements/experiment-001/session-log.md`

Not done: application source was not edited; V1, V2, V3, and V3B were not edited; measurements were not rerun; raw files were not deleted or overwritten; no missing value was imputed; pilot artifacts were not copied in.

React DevTools Profiler is not part of this dataset. The required total is 80 Lighthouse + 80 Network + 24 Performance = 184.

## 2. Dataset inventory

Status: **PASS**.

Files under the measurement tree: 370. Raw final samples present: 184. Expected: 184. Missing sample IDs: none. Duplicate sample IDs: none.

The 370 files break down as 184 raw samples, 80 Lighthouse HTML companions, 72 Network notes files, 24 `.gitkeep` directory markers, 6 `.DS_Store` files, and 4 campaign documents (`README.md`, `final-measurement-checklist.md`, `final-measurement-tracker.md`, `session-log.md`).

No pilot layout is present in this tree. There is no top-level `lighthouse/` or `network/` directory, no `raw/summary.json`, and no `U-NW-*` file.

## 3. Sample count table

Status: **PASS**.

| Profile | Variant | Lighthouse | Network | Performance |
| ------- | ------- | ---------: | ------: | ----------: |
| Mobile | V1 | 10 | 10 | 3 |
| Mobile | V2 | 10 | 10 | 3 |
| Mobile | V3 | 10 | 10 | 3 |
| Mobile | V3B | 10 | 10 | 3 |
| Desktop | V1 | 10 | 10 | 3 |
| Desktop | V2 | 10 | 10 | 3 |
| Desktop | V3 | 10 | 10 | 3 |
| Desktop | V3B | 10 | 10 | 3 |
| **Total** |  | **80** | **80** | **24** |

Total final samples: **184**.

The tracker contains 184 `RECORDED` rows and 0 `PENDING` rows.

## 4. Filename and structure audit

Status: **WARNING**.

Expected IDs `M-LH-V1-01` … `D-LH-V3B-10`, `M-NW-V1-01` … `D-NW-V3B-10`, and `M-PF-V1-01` … `D-PF-V3B-03` are all present. Sequence numbers have no gaps. No sample ID maps to two raw files. No file matches the pilot naming patterns.

Files are stored flat, as `<sample-id>.json`, `<sample-id>.har`, and `<sample-id>.html`, inside `profile-*/variant-*/<tool>/`. Protocol section 14.1, the checklist, and the measurement README describe a nested `<sample-id>/lighthouse.json` directory. The tracker paths match the flat files that exist. This audit does not rename files and does not rewrite the protocol storage section.

Malformed names, both still present:

| File | Issue |
| ---- | ----- |
| `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-01 .json` | space before `.json` |
| `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-01 .html` | space before `.html` |

There is no second, correctly spelled `D-LH-V1-01.json`. The tracker row for `D-LH-V1-01` points at the spaced JSON path, so the row resolves. The sample was parsed from that file.

Every other Lighthouse JSON has a same-stem HTML companion. No other filename contains a space.

Non-sample extras:

- 24 `.gitkeep` files, one per tool directory. These are directory markers, not samples.
- 6 `.DS_Store` files at the tree root and under `profile-m`, `profile-d`, `profile-m/variant-v3`, `profile-d/variant-v1`, and `profile-d/variant-v2`. They are not measurement data and were not deleted.

## 5. Lighthouse validation

Status: **WARNING**.

All 80 JSON files parsed. Lighthouse 13.4.1, `throttlingMethod: simulate`, performance category only. Every run has an empty `runWarnings` list, no `runtimeError`, a performance score, and numeric FCP, LCP, Speed Index, TBT, CLS, and TTI. Every final URL is `/experiments/experiment-001` with `variant` matching the sample ID. `formFactor` is `mobile` for Profile M and `desktop` for Profile D.

INP has no numeric audit value in any of the 80 files. It is N/A for this load-only experiment.

TTI is present in all 80 files. It is listed in the raw table and in an informational summary below. It is not a primary median and it is not in the V3B vs V3 table.

The LCP element label is not stored. The `largest-contentful-paint-element` audit is absent. `lcp-breakdown-insight` contains subpart durations only, with no node label. LCP element is **not recorded** for all 80 samples. No element name was inferred.

Two collection cohorts are in the 80 files:

| Cohort | Samples | Origin | Host | Screen stored | `screenEmulation.disabled` | Throttling |
| ------ | ------: | ------ | ---- | ------------- | -------------------------: | ---------- |
| S2–S10 | 72 | `localhost:3000` | Linux Chrome | Profile M 412×823 dSF 1.75; Profile D 1350×940 dSF 1 | no | M: RTT 150 ms, 1638.4 kbps, CPU 4×. D: RTT 40 ms, 10240 kbps, CPU 1× |
| S1 Mobile | 4 | `localhost:4173` | Mac Chrome | 412×823 dSF 1.75 | yes | RTT 150 ms, 1638.4 kbps, CPU 4× |
| S1 Desktop | 4 | `localhost:4173` | Mac Chrome | 412×823 dSF 1.75 | yes | RTT 40 ms, 10240 kbps, CPU 1×; `formFactor` desktop |

S1 dates from `fetchTime` are 2026-09-28. S2–S10 dates are 2026-09-30. `benchmarkIndex` on the eight S1 files is about 2888–3004. The later files are mostly about 3250–3868.

`screenEmulation.disabled: true` means the stored screen settings were not applied during gather. On Mobile S1 the stored dimensions still match Profile M, but emulation was disabled. On Desktop S1 the stored screen block is the mobile size and scale, while `formFactor` and the throttling numbers are desktop. That is a configuration mismatch. Those four samples stay in the n=10 set.

Displayed times are rounded to 0.1 ms. Scores are the Lighthouse category score times 100. Statistics in section 10 use the unrounded JSON numbers.

| Sample | Origin | Form factor | Screen | Emulation disabled | Score | FCP | LCP | SI | TBT | CLS | TTI | Cohort note |
| ------ | ------ | ----------- | ------ | -----------------: | ----: | --: | --: | -: | --: | --: | --: | ----------- |
| D-LH-V1-01 | localhost:4173 | desktop | 412×823 dSF 1.75 | yes | 93.0 | 656.7 | 656.7 | 2619.0 | 0.0 | 0.0000 | 656.7 | S1 desktop screen mismatch |
| D-LH-V1-02 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 92.0 | 842.1 | 942.1 | 2640.7 | 0.0 | 0.0218 | 942.1 | — |
| D-LH-V1-03 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 92.0 | 850.2 | 950.2 | 2641.5 | 0.0 | 0.0218 | 950.2 | — |
| D-LH-V1-04 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 788.7 | 828.7 | 2606.9 | 0.0 | 0.0218 | 828.7 | — |
| D-LH-V1-05 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 779.5 | 799.5 | 2618.5 | 0.0 | 0.0218 | 799.5 | — |
| D-LH-V1-06 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 92.0 | 849.0 | 949.0 | 2635.6 | 0.0 | 0.0218 | 949.0 | — |
| D-LH-V1-07 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 783.9 | 823.9 | 2591.9 | 0.0 | 0.0218 | 823.9 | — |
| D-LH-V1-08 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 92.0 | 857.9 | 957.9 | 2652.5 | 0.0 | 0.0218 | 957.9 | — |
| D-LH-V1-09 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 788.5 | 828.5 | 2623.1 | 0.0 | 0.0218 | 828.5 | — |
| D-LH-V1-10 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 769.1 | 789.1 | 2607.7 | 0.0 | 0.0218 | 789.1 | — |
| D-LH-V2-01 | localhost:4173 | desktop | 412×823 dSF 1.75 | yes | 96.0 | 569.4 | 569.4 | 2111.2 | 0.0 | 0.0102 | 569.4 | S1 desktop screen mismatch |
| D-LH-V2-02 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 825.7 | 865.7 | 2312.3 | 0.0 | 0.0121 | 865.7 | — |
| D-LH-V2-03 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 813.4 | 853.4 | 2318.1 | 0.0 | 0.0134 | 853.4 | — |
| D-LH-V2-04 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 797.7 | 817.7 | 2317.0 | 0.0 | 0.0121 | 817.7 | — |
| D-LH-V2-05 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 812.0 | 852.0 | 2314.2 | 0.0 | 0.0134 | 852.0 | — |
| D-LH-V2-06 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 810.4 | 850.4 | 2314.5 | 0.0 | 0.0134 | 850.4 | — |
| D-LH-V2-07 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 790.4 | 810.4 | 2306.2 | 0.0 | 0.0134 | 810.4 | — |
| D-LH-V2-08 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 726.4 | 726.4 | 2290.6 | 0.0 | 0.0134 | 726.4 | — |
| D-LH-V2-09 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 811.3 | 891.3 | 2323.2 | 0.0 | 0.0134 | 891.3 | — |
| D-LH-V2-10 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 813.5 | 853.5 | 2332.6 | 0.0 | 0.0134 | 853.5 | — |
| D-LH-V3-01 | localhost:4173 | desktop | 412×823 dSF 1.75 | yes | 95.0 | 658.0 | 658.0 | 2132.1 | 0.0 | 0.0102 | 658.0 | S1 desktop screen mismatch |
| D-LH-V3-02 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 812.6 | 852.6 | 2318.3 | 0.0 | 0.0121 | 852.6 | — |
| D-LH-V3-03 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 806.1 | 826.1 | 2319.9 | 0.0 | 0.0134 | 826.1 | — |
| D-LH-V3-04 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 822.8 | 862.8 | 2320.3 | 0.0 | 0.0134 | 862.8 | — |
| D-LH-V3-05 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 829.6 | 889.6 | 2328.9 | 0.0 | 0.0134 | 889.6 | — |
| D-LH-V3-06 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 664.4 | 684.4 | 2267.6 | 0.0 | 0.0134 | 684.4 | — |
| D-LH-V3-07 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 726.3 | 726.3 | 2289.9 | 0.0 | 0.0134 | 726.3 | — |
| D-LH-V3-08 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 804.2 | 824.2 | 2317.5 | 0.0 | 0.0134 | 824.2 | — |
| D-LH-V3-09 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 93.0 | 829.9 | 889.9 | 2329.2 | 0.0 | 0.0134 | 889.9 | — |
| D-LH-V3-10 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 94.0 | 784.2 | 784.2 | 2308.4 | 0.0 | 0.0134 | 784.2 | — |
| D-LH-V3B-01 | localhost:4173 | desktop | 412×823 dSF 1.75 | yes | 98.0 | 285.0 | 285.0 | 1709.6 | 0.0 | 0.0095 | 285.0 | S1 desktop screen mismatch |
| D-LH-V3B-02 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 96.0 | 727.6 | 727.6 | 1871.1 | 0.0 | 0.0134 | 727.6 | — |
| D-LH-V3B-03 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 816.8 | 856.8 | 1909.1 | 0.0 | 0.0134 | 856.8 | — |
| D-LH-V3B-04 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 844.8 | 904.8 | 1912.8 | 0.0 | 0.0134 | 904.8 | — |
| D-LH-V3B-05 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 834.8 | 894.8 | 1915.4 | 0.0 | 0.0134 | 894.8 | — |
| D-LH-V3B-06 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 96.0 | 795.1 | 815.1 | 1890.3 | 0.0 | 0.0134 | 815.1 | — |
| D-LH-V3B-07 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 96.0 | 792.3 | 812.3 | 1900.7 | 0.0 | 0.0134 | 812.3 | — |
| D-LH-V3B-08 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 830.0 | 890.0 | 1906.1 | 0.0 | 0.0134 | 890.0 | — |
| D-LH-V3B-09 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 96.0 | 790.8 | 810.8 | 1885.9 | 0.0 | 0.0121 | 810.8 | — |
| D-LH-V3B-10 | localhost:3000 | desktop | 1350×940 dSF 1 | no | 95.0 | 810.5 | 850.5 | 1902.8 | 0.0 | 0.0134 | 850.5 | — |
| M-LH-V1-01 | localhost:4173 | mobile | 412×823 dSF 1.75 | yes | 70.0 | 3939.3 | 4420.3 | 7577.0 | 12.0 | 0.0000 | 4451.3 | S1 screen emulation disabled |
| M-LH-V1-02 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3478.5 | 3478.5 | 6876.9 | 35.0 | 0.0000 | 4463.5 | — |
| M-LH-V1-03 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3485.0 | 3485.0 | 6881.5 | 32.0 | 0.0000 | 4467.0 | — |
| M-LH-V1-04 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3474.0 | 3474.0 | 6879.8 | 33.0 | 0.0000 | 4457.0 | — |
| M-LH-V1-05 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3486.4 | 3486.4 | 6912.4 | 34.0 | 0.0000 | 4470.4 | — |
| M-LH-V1-06 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3486.6 | 3486.6 | 6921.7 | 34.0 | 0.0000 | 4470.6 | — |
| M-LH-V1-07 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3475.5 | 3475.5 | 6893.3 | 37.0 | 0.0000 | 4461.5 | — |
| M-LH-V1-08 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3485.4 | 3485.4 | 6878.6 | 33.0 | 0.0000 | 4468.4 | — |
| M-LH-V1-09 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3474.2 | 3474.2 | 6933.7 | 38.0 | 0.0000 | 4461.2 | — |
| M-LH-V1-10 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3478.0 | 3478.0 | 6914.3 | 42.0 | 0.0000 | 4469.0 | — |
| M-LH-V2-01 | localhost:4173 | mobile | 412×823 dSF 1.75 | yes | 75.0 | 3773.2 | 4073.2 | 5485.3 | 24.0 | 0.0000 | 4297.2 | S1 screen emulation disabled |
| M-LH-V2-02 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 77.0 | 3664.1 | 3814.1 | 5377.0 | 58.5 | 0.0000 | 4365.0 | — |
| M-LH-V2-03 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3612.9 | 3612.9 | 5249.4 | 50.0 | 0.0000 | 4300.9 | — |
| M-LH-V2-04 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 86.0 | 3008.0 | 3008.0 | 5157.6 | 54.0 | 0.0000 | 4317.9 | — |
| M-LH-V2-05 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3614.3 | 3614.3 | 5268.8 | 47.0 | 0.0000 | 4304.3 | — |
| M-LH-V2-06 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3613.3 | 3613.3 | 5261.5 | 40.0 | 0.0000 | 4298.3 | — |
| M-LH-V2-07 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 90.0 | 2557.5 | 2557.5 | 5073.5 | 39.0 | 0.0000 | 4307.8 | — |
| M-LH-V2-08 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 84.0 | 3156.7 | 3156.7 | 5170.8 | 38.0 | 0.0000 | 4303.7 | — |
| M-LH-V2-09 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 74.0 | 3915.8 | 4215.8 | 5378.6 | 31.5 | 0.0000 | 4296.8 | — |
| M-LH-V2-10 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3607.8 | 3607.8 | 5231.0 | 38.0 | 0.0000 | 4295.8 | — |
| M-LH-V3-01 | localhost:4173 | mobile | 412×823 dSF 1.75 | yes | 75.0 | 3764.9 | 4064.9 | 5470.3 | 22.0 | 0.0000 | 4286.9 | S1 screen emulation disabled |
| M-LH-V3-02 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3618.1 | 3768.1 | 5275.3 | 38.0 | 0.0000 | 4154.1 | — |
| M-LH-V3-03 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 82.0 | 3313.1 | 3313.1 | 5212.2 | 39.0 | 0.0000 | 4305.3 | — |
| M-LH-V3-04 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3590.9 | 3665.9 | 5236.3 | 40.0 | 0.0000 | 4166.3 | — |
| M-LH-V3-05 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3611.8 | 3611.8 | 5235.8 | 42.0 | 0.0000 | 4303.8 | — |
| M-LH-V3-06 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 86.0 | 3005.4 | 3005.4 | 5136.6 | 42.0 | 0.0000 | 4305.5 | — |
| M-LH-V3-07 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 84.0 | 3156.1 | 3156.1 | 5175.3 | 68.0 | 0.0000 | 4304.3 | — |
| M-LH-V3-08 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 79.0 | 3606.6 | 3606.6 | 5246.4 | 39.0 | 0.0000 | 4295.6 | — |
| M-LH-V3-09 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 84.0 | 3154.5 | 3154.5 | 5155.1 | 28.0 | 0.0000 | 4289.3 | — |
| M-LH-V3-10 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 78.0 | 3688.9 | 3763.9 | 5287.5 | 48.0 | 0.0000 | 4298.9 | — |
| M-LH-V3B-01 | localhost:4173 | mobile | 412×823 dSF 1.75 | yes | 77.0 | 3769.3 | 4069.3 | 4718.6 | 17.0 | 0.0000 | 4286.3 | S1 screen emulation disabled |
| M-LH-V3B-02 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 81.0 | 3613.2 | 3613.2 | 4435.9 | 29.0 | 0.0000 | 4292.2 | — |
| M-LH-V3B-03 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 82.0 | 3508.9 | 3508.9 | 4424.3 | 33.8 | 0.0000 | 4181.4 | — |
| M-LH-V3B-04 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 85.0 | 3154.2 | 3154.2 | 4370.6 | 38.0 | 0.0000 | 4298.5 | — |
| M-LH-V3B-05 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 80.0 | 3615.7 | 3615.7 | 4432.2 | 41.0 | 0.0000 | 4304.7 | — |
| M-LH-V3B-06 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 85.0 | 3156.1 | 3156.1 | 4337.0 | 40.0 | 0.0000 | 4305.2 | — |
| M-LH-V3B-07 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 80.0 | 3615.6 | 3615.6 | 4466.0 | 65.7 | 0.0000 | 4313.2 | — |
| M-LH-V3B-08 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 81.0 | 3613.5 | 3613.5 | 4438.0 | 39.0 | 0.0000 | 4302.5 | — |
| M-LH-V3B-09 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 91.0 | 2564.9 | 2564.9 | 4262.7 | 29.0 | 0.0000 | 4316.2 | — |
| M-LH-V3B-10 | localhost:3000 | mobile | 412×823 dSF 1.75 | no | 86.0 | 3152.6 | 3152.6 | 4362.0 | 21.9 | 0.0000 | 4306.0 | — |

### TTI, informational only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 4465.3 | 4461.3 | 4468.9 | 7.6 | 4451.3 | 4470.6 | 6.3 | 4464.0 |
| Mobile V2 | 10 | 4302.3 | 4297.5 | 4306.9 | 9.4 | 4295.8 | 4365.0 | 20.8 | 4308.8 |
| Mobile V3 | 10 | 4297.2 | 4287.5 | 4304.2 | 16.7 | 4154.1 | 4305.5 | 58.8 | 4271.0 |
| Mobile V3B | 10 | 4303.6 | 4293.8 | 4305.8 | 12.0 | 4181.4 | 4316.2 | 39.4 | 4290.6 |
| Desktop V1 | 10 | 828.6 | 805.6 | 947.3 | 141.6 | 656.7 | 957.9 | 97.3 | 852.6 |
| Desktop V2 | 10 | 851.2 | 812.2 | 853.5 | 41.2 | 569.4 | 891.3 | 95.3 | 809.0 |
| Desktop V3 | 10 | 825.2 | 740.7 | 860.2 | 119.5 | 658.0 | 889.9 | 83.9 | 799.8 |
| Desktop V3B | 10 | 832.8 | 811.2 | 881.7 | 70.5 | 285.0 | 904.8 | 183.3 | 784.8 |

## 6. Network validation

Status: **WARNING**.

All 80 HAR 1.2 files parsed. Each has one page. The document request returns HTTP 200 for `/experiments/experiment-001` with the sample’s variant. Request count is 53 in every sample. No URL is repeated. No request falls outside the document, `/assets/`, or `favicon.svg`. Browser-visible Server Function RPC count in the HAR is 0 for every sample.

That absence is not read as absence of server execution. The protocol states that streamed document work may not appear as separate per-query rows. All 72 stored notes say the same thing: RPC count 0, duplicate Server Function URLs `none`, and query work streamed inside the document response.

Transferred bytes are HAR `response.bodySize` plus `response.headersSize` where both are ≥ 0. No entry had an unknown body size. Resource bytes are the sum of `response.content.size`. Every entry has `startedDateTime` and `time`, so request order and waterfall duration can be read from the HAR. Document time below is the document entry’s HAR `time`. DCL and load are `pageTimings.onContentLoad` and `pageTimings.onLoad`.

Viewport, CPU throttle, and network throttle are **NOT VERIFIABLE** from the HAR. Those fields are not in the file.

Eight samples have no `.notes.md`. Milestone values were not reconstructed from Lighthouse or Performance traces.

| Sample ID | Milestone notes |
| --------- | --------------- |
| M-NW-V1-01 | **not stored** |
| M-NW-V2-01 | **not stored** |
| M-NW-V3-01 | **not stored** |
| M-NW-V3B-01 | **not stored** |
| D-NW-V1-01 | **not stored** |
| D-NW-V2-01 | **not stored** |
| D-NW-V3-01 | **not stored** |
| D-NW-V3B-01 | **not stored** |

The other 72 notes files each record build SHA `8c8df0b3266b32b841735126151e9b1b1b2b94ba` (72 files matched that SHA). Each stores numeric User Timing `startTime` values for A–F. Variant label and profile match the sample ID. Order checks passed: A is not after B, C, D, or E, and F is not before the latest of B–E. No milestone is negative.

Index 01 is `localhost:4173` on 2026-09-28. Index 02–10 is `localhost:3000` on 2026-09-30. Milestone medians in section 10 therefore use n=9. The HAR sample count stays n=10.

### HAR metrics

| Sample | Origin | Requests | Transferred bytes | Resource bytes | Document ms | DCL ms | Load ms | Other URLs | Duplicate URLs |
| ------ | ------ | -------: | ----------------: | -------------: | ----------: | -----: | ------: | ---------: | -------------: |
| D-NW-V1-01 | localhost:4173 | 53 | 438,137 | 1,200,119 | 3538.9 | 3664.0 | 4073.5 | 0 | 0 |
| D-NW-V1-02 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3524.0 | 3614.3 | 4017.0 | 0 | 0 |
| D-NW-V1-03 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3524.5 | 3617.3 | 4020.3 | 0 | 0 |
| D-NW-V1-04 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3525.1 | 3614.3 | 4019.7 | 0 | 0 |
| D-NW-V1-05 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3526.3 | 3618.6 | 4023.2 | 0 | 0 |
| D-NW-V1-06 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3523.8 | 3612.4 | 4020.4 | 0 | 0 |
| D-NW-V1-07 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3524.5 | 3616.7 | 4018.9 | 0 | 0 |
| D-NW-V1-08 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3525.6 | 3615.0 | 4018.9 | 0 | 0 |
| D-NW-V1-09 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3522.4 | 3612.7 | 4015.8 | 0 | 0 |
| D-NW-V1-10 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3525.8 | 3608.1 | 4019.0 | 0 | 0 |
| D-NW-V2-01 | localhost:4173 | 53 | 442,565 | 1,204,499 | 4518.4 | 4521.8 | 4527.1 | 0 | 0 |
| D-NW-V2-02 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4510.9 | 4513.1 | 4514.6 | 0 | 0 |
| D-NW-V2-03 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4509.0 | 4510.5 | 4510.8 | 0 | 0 |
| D-NW-V2-04 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4509.2 | 4511.3 | 4512.8 | 0 | 0 |
| D-NW-V2-05 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4511.2 | 4512.7 | 4513.0 | 0 | 0 |
| D-NW-V2-06 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4508.3 | 4510.0 | 4511.4 | 0 | 0 |
| D-NW-V2-07 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4511.1 | 4515.4 | 4515.7 | 0 | 0 |
| D-NW-V2-08 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4509.9 | 4512.0 | 4513.5 | 0 | 0 |
| D-NW-V2-09 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4509.4 | 4511.0 | 4512.3 | 0 | 0 |
| D-NW-V2-10 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4507.2 | 4509.5 | 4511.1 | 0 | 0 |
| D-NW-V3-01 | localhost:4173 | 53 | 442,799 | 1,204,733 | 4525.4 | 4525.7 | 4529.6 | 0 | 0 |
| D-NW-V3-02 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4511.2 | 4513.6 | 4515.3 | 0 | 0 |
| D-NW-V3-03 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4509.2 | 4511.4 | 4513.0 | 0 | 0 |
| D-NW-V3-04 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4508.9 | 4511.0 | 4512.6 | 0 | 0 |
| D-NW-V3-05 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4510.9 | 4512.9 | 4513.2 | 0 | 0 |
| D-NW-V3-06 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4509.7 | 4511.5 | 4511.7 | 0 | 0 |
| D-NW-V3-07 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4509.8 | 4511.8 | 4513.3 | 0 | 0 |
| D-NW-V3-08 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4510.0 | 4512.1 | 4513.7 | 0 | 0 |
| D-NW-V3-09 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4507.7 | 4509.3 | 4510.8 | 0 | 0 |
| D-NW-V3-10 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4511.8 | 4513.8 | 4515.3 | 0 | 0 |
| D-NW-V3B-01 | localhost:4173 | 53 | 442,801 | 1,204,735 | 3518.9 | 3519.1 | 3522.2 | 0 | 0 |
| D-NW-V3B-02 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3506.4 | 3508.6 | 3510.1 | 0 | 0 |
| D-NW-V3B-03 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3509.0 | 3511.2 | 3512.7 | 0 | 0 |
| D-NW-V3B-04 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3507.2 | 3509.2 | 3509.6 | 0 | 0 |
| D-NW-V3B-05 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3506.5 | 3508.2 | 3509.7 | 0 | 0 |
| D-NW-V3B-06 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3508.2 | 3510.2 | 3511.8 | 0 | 0 |
| D-NW-V3B-07 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3506.4 | 3508.3 | 3509.9 | 0 | 0 |
| D-NW-V3B-08 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3508.5 | 3510.7 | 3511.0 | 0 | 0 |
| D-NW-V3B-09 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3506.9 | 3509.3 | 3510.8 | 0 | 0 |
| D-NW-V3B-10 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3506.2 | 3507.8 | 3509.4 | 0 | 0 |
| M-NW-V1-01 | localhost:4173 | 53 | 438,137 | 1,200,119 | 3625.2 | 4513.6 | 9353.8 | 0 | 0 |
| M-NW-V1-02 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3609.9 | 4058.1 | 5996.8 | 0 | 0 |
| M-NW-V1-03 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3612.6 | 4054.9 | 6000.9 | 0 | 0 |
| M-NW-V1-04 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3622.6 | 4106.1 | 6071.9 | 0 | 0 |
| M-NW-V1-05 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3607.6 | 4051.7 | 6004.2 | 0 | 0 |
| M-NW-V1-06 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3605.5 | 4047.3 | 5985.5 | 0 | 0 |
| M-NW-V1-07 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3609.5 | 4055.8 | 5997.3 | 0 | 0 |
| M-NW-V1-08 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3605.9 | 4053.3 | 5998.6 | 0 | 0 |
| M-NW-V1-09 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3607.3 | 4058.3 | 5992.2 | 0 | 0 |
| M-NW-V1-10 | localhost:3000 | 53 | 440,074 | 1,213,247 | 3610.7 | 4053.8 | 5997.1 | 0 | 0 |
| M-NW-V2-01 | localhost:4173 | 53 | 442,565 | 1,204,499 | 4526.5 | 4528.8 | 7399.0 | 0 | 0 |
| M-NW-V2-02 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4517.5 | 4523.7 | 4524.9 | 0 | 0 |
| M-NW-V2-03 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4520.2 | 4528.1 | 4529.7 | 0 | 0 |
| M-NW-V2-04 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4517.1 | 4522.7 | 4523.6 | 0 | 0 |
| M-NW-V2-05 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4526.0 | 4532.6 | 4533.4 | 0 | 0 |
| M-NW-V2-06 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4516.9 | 4523.2 | 4524.2 | 0 | 0 |
| M-NW-V2-07 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4523.0 | 4529.9 | 4531.0 | 0 | 0 |
| M-NW-V2-08 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4522.0 | 4527.0 | 4528.0 | 0 | 0 |
| M-NW-V2-09 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4522.5 | 4530.4 | 4536.6 | 0 | 0 |
| M-NW-V2-10 | localhost:3000 | 53 | 444,502 | 1,217,627 | 4514.6 | 4519.4 | 4520.4 | 0 | 0 |
| M-NW-V3-01 | localhost:4173 | 53 | 442,799 | 1,204,733 | 4519.7 | 4522.0 | 7401.0 | 0 | 0 |
| M-NW-V3-02 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4518.0 | 4524.2 | 4531.1 | 0 | 0 |
| M-NW-V3-03 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4518.0 | 4524.2 | 4525.2 | 0 | 0 |
| M-NW-V3-04 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4529.5 | 4535.5 | 4542.3 | 0 | 0 |
| M-NW-V3-05 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4521.5 | 4526.5 | 4527.5 | 0 | 0 |
| M-NW-V3-06 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4522.4 | 4527.6 | 4533.6 | 0 | 0 |
| M-NW-V3-07 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4521.3 | 4527.5 | 4533.7 | 0 | 0 |
| M-NW-V3-08 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4516.0 | 4522.4 | 4523.5 | 0 | 0 |
| M-NW-V3-09 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4520.0 | 4525.3 | 4526.1 | 0 | 0 |
| M-NW-V3-10 | localhost:3000 | 53 | 444,736 | 1,217,861 | 4520.1 | 4524.2 | 4524.8 | 0 | 0 |
| M-NW-V3B-01 | localhost:4173 | 53 | 442,801 | 1,204,735 | 3526.3 | 3528.4 | 7254.0 | 0 | 0 |
| M-NW-V3B-02 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3534.7 | 3540.4 | 3707.7 | 0 | 0 |
| M-NW-V3B-03 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3512.4 | 3523.0 | 3678.9 | 0 | 0 |
| M-NW-V3B-04 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3521.0 | 3525.6 | 3687.1 | 0 | 0 |
| M-NW-V3B-05 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3515.7 | 3520.5 | 3682.0 | 0 | 0 |
| M-NW-V3B-06 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3531.4 | 3535.4 | 3700.0 | 0 | 0 |
| M-NW-V3B-07 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3518.4 | 3522.4 | 3684.5 | 0 | 0 |
| M-NW-V3B-08 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3520.9 | 3524.2 | 3685.1 | 0 | 0 |
| M-NW-V3B-09 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3529.0 | 3533.0 | 3699.4 | 0 | 0 |
| M-NW-V3B-10 | localhost:3000 | 53 | 444,738 | 1,217,863 | 3533.4 | 3537.7 | 3699.1 | 0 | 0 |

### Stored User Timing milestones

A blank cell means the notes file is absent. It is not a measured zero.

| Sample | Notes | A | B | C | D | E | F |
| ------ | ----- | -: | -: | -: | -: | -: | -: |
| D-NW-V1-01 | missing | — | — | — | — | — | — |
| D-NW-V1-02 | stored | 4034.8 | 4034.8 | 4057.0 | 4034.8 | 4034.8 | 4057.1 |
| D-NW-V1-03 | stored | 4035.4 | 4035.4 | 4056.9 | 4035.4 | 4035.4 | 4056.9 |
| D-NW-V1-04 | stored | 4037.7 | 4037.8 | 4059.3 | 4037.8 | 4037.8 | 4059.4 |
| D-NW-V1-05 | stored | 4042.3 | 4042.3 | 4064.0 | 4042.3 | 4042.3 | 4064.0 |
| D-NW-V1-06 | stored | 4037.4 | 4037.5 | 4059.0 | 4037.5 | 4037.5 | 4059.1 |
| D-NW-V1-07 | stored | 4035.2 | 4035.3 | 4058.0 | 4035.3 | 4035.3 | 4058.0 |
| D-NW-V1-08 | stored | 4041.1 | 4041.1 | 4064.8 | 4041.1 | 4041.1 | 4064.9 |
| D-NW-V1-09 | stored | 4034.6 | 4034.7 | 4057.2 | 4034.7 | 4034.7 | 4057.3 |
| D-NW-V1-10 | stored | 4032.2 | 4032.2 | 4055.6 | 4032.2 | 4032.4 | 4055.6 |
| D-NW-V2-01 | missing | — | — | — | — | — | — |
| D-NW-V2-02 | stored | 1598.3 | 1598.4 | 3542.8 | 4513.8 | 4013.8 | 4513.9 |
| D-NW-V2-03 | stored | 1588.6 | 1588.7 | 3546.4 | 4512.2 | 4013.0 | 4512.3 |
| D-NW-V2-04 | stored | 1591.4 | 1591.5 | 3539.5 | 4511.9 | 4012.4 | 4511.9 |
| D-NW-V2-05 | stored | 1601.1 | 1601.2 | 3553.4 | 4515.8 | 4017.3 | 4515.8 |
| D-NW-V2-06 | stored | 1586.6 | 1586.6 | 3542.9 | 4510.6 | 4012.9 | 4510.7 |
| D-NW-V2-07 | stored | 1593.2 | 1593.3 | 3536.8 | 4515.2 | 4013.4 | 4515.2 |
| D-NW-V2-08 | stored | 1596.5 | 1596.5 | 3547.6 | 4513.1 | 4025.1 | 4513.2 |
| D-NW-V2-09 | stored | 1588.4 | 1588.4 | 3543.8 | 4511.9 | 4012.8 | 4511.9 |
| D-NW-V2-10 | stored | 1588.9 | 1588.9 | 3542.8 | 4510.3 | 4012.7 | 4510.3 |
| D-NW-V3-01 | missing | — | — | — | — | — | — |
| D-NW-V3-02 | stored | 1601.2 | 1601.3 | 3544.8 | 4515.3 | 4015.4 | 4515.3 |
| D-NW-V3-03 | stored | 1591.3 | 1591.3 | 3543.7 | 4512.1 | 4012.5 | 4512.1 |
| D-NW-V3-04 | stored | 1602.9 | 1602.9 | 3561.1 | 4517.7 | 4017.6 | 4517.8 |
| D-NW-V3-05 | stored | 1598.9 | 1599.0 | 3543.2 | 4515.3 | 4013.6 | 4515.3 |
| D-NW-V3-06 | stored | 1596.2 | 1596.3 | 3551.4 | 4518.8 | 4017.0 | 4518.8 |
| D-NW-V3-07 | stored | 1592.4 | 1592.5 | 3542.0 | 4512.6 | 4012.9 | 4512.6 |
| D-NW-V3-08 | stored | 1590.4 | 1590.4 | 3548.9 | 4512.5 | 4012.9 | 4512.5 |
| D-NW-V3-09 | stored | 1590.3 | 1590.3 | 3545.3 | 4509.7 | 4012.2 | 4509.7 |
| D-NW-V3-10 | stored | 1600.1 | 1600.1 | 3554.8 | 4519.9 | 4020.4 | 4520.0 |
| D-NW-V3B-01 | missing | — | — | — | — | — | — |
| D-NW-V3B-02 | stored | 1596.5 | 1596.6 | 2530.5 | 3509.3 | 3010.1 | 3509.3 |
| D-NW-V3B-03 | stored | 1590.8 | 1590.9 | 2544.8 | 3511.8 | 3010.5 | 3511.8 |
| D-NW-V3B-04 | stored | 1591.4 | 1591.4 | 2537.8 | 3513.0 | 3012.0 | 3513.0 |
| D-NW-V3B-05 | stored | 1596.3 | 1596.3 | 2538.2 | 3514.8 | 3015.0 | 3514.8 |
| D-NW-V3B-06 | stored | 1598.3 | 1598.3 | 2543.0 | 3511.8 | 3010.3 | 3511.8 |
| D-NW-V3B-07 | stored | 1589.9 | 1590.0 | 2544.3 | 3508.9 | 3009.3 | 3509.0 |
| D-NW-V3B-08 | stored | 1592.5 | 1592.5 | 2545.8 | 3512.6 | 3010.7 | 3512.6 |
| D-NW-V3B-09 | stored | 1590.1 | 1590.1 | 2545.5 | 3510.1 | 3010.3 | 3510.1 |
| D-NW-V3B-10 | stored | 1590.1 | 1590.2 | 2541.8 | 3508.4 | 3009.3 | 3508.5 |
| M-NW-V1-01 | missing | — | — | — | — | — | — |
| M-NW-V1-02 | stored | 6048.1 | 6048.1 | 6145.5 | 6048.1 | 6048.1 | 6145.6 |
| M-NW-V1-03 | stored | 6053.7 | 6053.7 | 6144.6 | 6053.7 | 6053.7 | 6144.6 |
| M-NW-V1-04 | stored | 6172.0 | 6172.0 | 6331.1 | 6172.0 | 6172.0 | 6331.7 |
| M-NW-V1-05 | stored | 6058.2 | 6058.2 | 6147.2 | 6058.2 | 6058.2 | 6147.2 |
| M-NW-V1-06 | stored | 6046.1 | 6046.7 | 6149.1 | 6046.7 | 6046.7 | 6149.1 |
| M-NW-V1-07 | stored | 6054.5 | 6054.5 | 6145.2 | 6054.5 | 6054.5 | 6145.6 |
| M-NW-V1-08 | stored | 6051.3 | 6051.3 | 6139.6 | 6051.3 | 6051.3 | 6139.6 |
| M-NW-V1-09 | stored | 6050.4 | 6050.8 | 6139.2 | 6050.9 | 6050.9 | 6139.3 |
| M-NW-V1-10 | stored | 6044.6 | 6044.6 | 6154.4 | 6044.6 | 6044.6 | 6154.5 |
| M-NW-V2-01 | missing | — | — | — | — | — | — |
| M-NW-V2-02 | stored | 3707.8 | 3708.7 | 3797.0 | 4531.3 | 4040.4 | 4531.9 |
| M-NW-V2-03 | stored | 3733.1 | 3733.1 | 3838.5 | 4536.4 | 4047.8 | 4536.5 |
| M-NW-V2-04 | stored | 3728.0 | 3728.8 | 3821.1 | 4530.0 | 4091.0 | 4530.0 |
| M-NW-V2-05 | stored | 3727.2 | 3727.3 | 3818.9 | 4538.6 | 4041.3 | 4538.7 |
| M-NW-V2-06 | stored | 3708.1 | 3708.2 | 3785.8 | 4529.4 | 4042.7 | 4529.6 |
| M-NW-V2-07 | stored | 3728.0 | 3728.2 | 3823.6 | 4538.7 | 4040.1 | 4538.9 |
| M-NW-V2-08 | stored | 3705.1 | 3705.2 | 3787.7 | 4534.6 | 4039.8 | 4534.6 |
| M-NW-V2-09 | stored | 3715.2 | 3715.2 | 3801.1 | 4534.7 | 4038.1 | 4534.8 |
| M-NW-V2-10 | stored | 3712.5 | 3712.5 | 3792.2 | 4526.3 | 4037.5 | 4526.3 |
| M-NW-V3-01 | missing | — | — | — | — | — | — |
| M-NW-V3-02 | stored | 3711.6 | 3711.7 | 3801.8 | 4527.0 | 4035.3 | 4527.1 |
| M-NW-V3-03 | stored | 3708.5 | 3708.7 | 3784.1 | 4531.3 | 4033.5 | 4531.3 |
| M-NW-V3-04 | stored | 3762.3 | 3763.0 | 3874.8 | 4541.4 | 4039.9 | 4541.6 |
| M-NW-V3-05 | stored | 3728.0 | 3728.1 | 3818.8 | 4536.7 | 4041.1 | 4536.7 |
| M-NW-V3-06 | stored | 3703.9 | 3704.0 | 3780.5 | 4530.5 | 4029.8 | 4530.5 |
| M-NW-V3-07 | stored | 3711.4 | 3711.4 | 3794.9 | 4530.3 | 4029.3 | 4530.3 |
| M-NW-V3-08 | stored | 3715.4 | 3715.4 | 3806.4 | 4533.3 | 4043.0 | 4533.3 |
| M-NW-V3-09 | stored | 3701.1 | 3701.1 | 3781.5 | 4533.0 | 4036.0 | 4533.0 |
| M-NW-V3-10 | stored | 3712.1 | 3712.5 | 3801.4 | 4529.9 | 4035.0 | 4529.9 |
| M-NW-V3B-01 | missing | — | — | — | — | — | — |
| M-NW-V3B-02 | stored | 3771.8 | 3771.9 | 3885.5 | 3771.9 | 3771.9 | 3885.5 |
| M-NW-V3B-03 | stored | 3727.7 | 3727.8 | 3812.8 | 3727.8 | 3727.8 | 3812.8 |
| M-NW-V3B-04 | stored | 3738.3 | 3738.5 | 3830.5 | 3738.5 | 3738.5 | 3830.5 |
| M-NW-V3B-05 | stored | 3734.2 | 3734.2 | 3825.3 | 3734.2 | 3734.2 | 3825.3 |
| M-NW-V3B-06 | stored | 3755.1 | 3755.2 | 3853.1 | 3755.2 | 3755.2 | 3853.2 |
| M-NW-V3B-07 | stored | 3735.9 | 3735.9 | 3839.6 | 3735.9 | 3735.9 | 3839.7 |
| M-NW-V3B-08 | stored | 3739.4 | 3740.7 | 3829.6 | 3740.7 | 3740.7 | 3829.6 |
| M-NW-V3B-09 | stored | 3754.7 | 3754.7 | 3857.2 | 3754.7 | 3754.7 | 3857.8 |
| M-NW-V3B-10 | stored | 3756.7 | 3756.7 | 3845.5 | 3756.7 | 3756.7 | 3846.2 |

## 7. Performance validation

Status: **WARNING**.

All 24 traces parsed. Each contains exactly one `exp-milestone-A` through `exp-milestone-F` on the renderer thread, with a `startTime` in the mark payload. Those names are the experiment User Timing marks. No duplicate marks. No negative marks. A is not after B–E, and F is not before the latest widget mark. Mark `startTime` matches the trace timestamp delta from the matching `navigationStart` within 5 ms on every trace.

The URL variant matches the sample ID. FCP, LCP candidate, DCL, and load were found on that same navigation. LCP node names are trace candidates, not the missing Lighthouse element audit.

Capture is split:

| Cohort | Samples | Source | Origin | CPU field | Download | Latency | Viewport | dSF |
| ------ | ------: | ------ | ------ | --------- | -------: | ------: | -------- | --: |
| S1 Mobile | 4 | DevTools | `localhost:4173` | 4 | 204750 B/s | 150 ms | 412×823 | not stored |
| S2–S3 Mobile | 8 | CDP Tracing | `localhost:3000` | 4 | 204750 B/s | 150 ms | 412×823 | 1.75 |
| S1 Desktop | 4 | DevTools | `localhost:4173` | field absent | 1280000 B/s | 40 ms | 1350×940 | not stored |
| S2–S3 Desktop | 8 | CDP Tracing | `localhost:3000` | field absent | 1280000 B/s | 40 ms | 1350×940 | 1 |

204750 bytes/s is 1638 kbit/s. 1280000 bytes/s is 10240 kbit/s. Those download rates match the protocol and are not mismatches.

Desktop `cpuThrottling` is omitted in all 12 Desktop traces. No Desktop trace stores a 4× value. An explicit 1× multiplier is **NOT VERIFIABLE** from the trace. The session log says Desktop Performance used no CPU throttle.

Emulated device scale is **NOT VERIFIABLE** for the eight S1 DevTools traces. `hostDPR: 1` on those files is the host display scale, not the emulated scale. S2–S3 metadata records dSF 1.75 on Mobile and 1 on Desktop.

S2–S3 Mobile metadata also records `viewport.mobile: false` beside 412×823 and dSF 1.75. The DevTools profile table requires those dimensions and scale. It does not require the Chrome `mobile` boolean that Lighthouse sets for Profile M. The dimensions and scale match. The boolean is reported here and is not treated as a viewport-size mismatch.

CDP traces record build SHA `8c8df0b3266b32b841735126151e9b1b1b2b94ba`. S1 DevTools traces do not record a build SHA.

Scripting, rendering, and painting below are inclusive main-thread sums: `EvaluateScript`, `Layout` + `UpdateLayoutTree`, and `Paint`. They overlap nested work, and the DevTools S1 traces produce much larger scripting totals than the CDP traces. Those totals are not pooled as one instrumentation method. Long tasks are main-thread `RunTask` events longer than 50 ms.

### Trace configuration and navigation timing

| Sample | Source | CPU | Download B/s | Latency ms | Viewport | dSF | Long tasks | FCP | LCP | DCL | Load |
| ------ | ------ | --: | -----------: | ---------: | -------- | --: | ---------: | --: | --: | --: | ---: |
| D-PF-V1-01 | DevTools | — | 1280000 | 40 | 1350×940 | — | 1 | 4212.8 | 4212.8 | 3697.1 | 4099.5 |
| D-PF-V1-02 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 3653.5 | 3653.5 | 3631.9 | 4048.9 |
| D-PF-V1-03 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 3652.4 | 3652.4 | 3627.9 | 4050.0 |
| D-PF-V2-01 | DevTools | — | 1280000 | 40 | 1350×940 | — | 1 | 1681.6 | 1681.6 | 4516.5 | 4523.4 |
| D-PF-V2-02 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1150.6 | 1150.6 | 4516.7 | 4519.2 |
| D-PF-V2-03 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1146.0 | 1146.0 | 4516.7 | 4518.5 |
| D-PF-V3-01 | DevTools | — | 1280000 | 40 | 1350×940 | — | 1 | 1708.7 | 1708.7 | 4518.1 | 4524.7 |
| D-PF-V3-02 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1164.5 | 1164.5 | 3.1 | 4519.6 |
| D-PF-V3-03 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1151.2 | 1151.2 | 4521.3 | 4523.3 |
| D-PF-V3B-01 | DevTools | — | 1280000 | 40 | 1350×940 | — | 1 | 1710.3 | 1710.3 | 3516.9 | 3520.1 |
| D-PF-V3B-02 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1163.3 | 1163.3 | 3511.4 | 3513.3 |
| D-PF-V3B-03 | CDP Tracing | — | 1280000 | 40 | 1350×940 | 1 | 1 | 1160.3 | 1160.3 | 3513.5 | 3513.8 |
| M-PF-V1-01 | DevTools | 4 | 204750 | 150 | 412×823 | — | 4 | 4080.6 | 4080.6 | 2.0 | 6137.2 |
| M-PF-V1-02 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 3 | 4072.7 | 4072.7 | 3.0 | 6069.3 |
| M-PF-V1-03 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 3 | 4075.9 | 4075.9 | 3.3 | 6071.8 |
| M-PF-V2-01 | DevTools | 4 | 204750 | 150 | 412×823 | — | 4 | 1573.9 | 1573.9 | 2.2 | 4569.4 |
| M-PF-V2-02 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 2 | 1545.3 | 1545.3 | 3.7 | 4534.6 |
| M-PF-V2-03 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 4 | 1582.4 | 1582.4 | 7.9 | 4549.9 |
| M-PF-V3-01 | DevTools | 4 | 204750 | 150 | 412×823 | — | 4 | 1540.5 | 1540.5 | 1.7 | 4593.2 |
| M-PF-V3-02 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 2 | 1542.2 | 1542.2 | 2.1 | 4528.9 |
| M-PF-V3-03 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 3 | 1545.4 | 1545.4 | 3.4 | 4532.4 |
| M-PF-V3B-01 | DevTools | 4 | 204750 | 150 | 412×823 | — | 4 | 1582.9 | 1582.9 | 1.9 | 3819.5 |
| M-PF-V3B-02 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 3 | 1548.4 | 1548.4 | 4.5 | 3789.0 |
| M-PF-V3B-03 | CDP Tracing | 4 | 204750 | 150 | 412×823 | 1.75 | 2 | 1555.7 | 1555.7 | 2.4 | 3784.2 |

### Trace milestones

These are diagnostic n=3 traces. They are not substitutes for the missing Network notes.

| Sample | A | B | C | D | E | F |
| ------ | -: | -: | -: | -: | -: | -: |
| D-PF-V1-01 | 4133.1 | 4133.2 | 4179.6 | 4133.2 | 4133.2 | 4179.7 |
| D-PF-V1-02 | 4096.5 | 4096.6 | 4174.9 | 4096.7 | 4096.7 | 4175.0 |
| D-PF-V1-03 | 4088.0 | 4088.2 | 4150.8 | 4088.2 | 4088.2 | 4150.9 |
| D-PF-V2-01 | 1686.3 | 1686.4 | 3560.0 | 4514.5 | 4018.6 | 4514.5 |
| D-PF-V2-02 | 1667.1 | 1667.3 | 3624.4 | 4516.2 | 4015.7 | 4516.2 |
| D-PF-V2-03 | 1660.0 | 1660.2 | 3577.5 | 4516.2 | 4015.7 | 4516.3 |
| D-PF-V3-01 | 1690.2 | 1690.2 | 3560.2 | 4515.7 | 4014.8 | 4515.8 |
| D-PF-V3-02 | 1656.8 | 1656.9 | 3595.3 | 4520.4 | 4016.7 | 4520.4 |
| D-PF-V3-03 | 1655.8 | 1655.9 | 3583.1 | 4520.9 | 4018.5 | 4521.0 |
| D-PF-V3B-01 | 1722.2 | 1722.2 | 2563.3 | 3512.4 | 3014.4 | 3512.4 |
| D-PF-V3B-02 | 1671.7 | 1671.9 | 2576.9 | 3510.9 | 3010.5 | 3511.0 |
| D-PF-V3B-03 | 1663.1 | 1663.2 | 2567.5 | 3510.5 | 3012.9 | 3510.6 |
| M-PF-V1-01 | 6283.5 | 6283.8 | 6502.0 | 6283.8 | 6283.8 | 6502.7 |
| M-PF-V1-02 | 6241.4 | 6241.5 | 6502.3 | 6241.5 | 6241.5 | 6503.1 |
| M-PF-V1-03 | 6238.3 | 6238.7 | 6495.8 | 6238.8 | 6238.8 | 6496.3 |
| M-PF-V2-01 | 3952.8 | 3952.8 | 4135.2 | 4550.6 | 4206.1 | 4550.6 |
| M-PF-V2-02 | 3924.3 | 3924.8 | 4157.3 | 4525.6 | 4221.2 | 4525.7 |
| M-PF-V2-03 | 3983.7 | 3984.9 | 4250.2 | 4639.4 | 4334.4 | 4639.6 |
| M-PF-V3-01 | 3964.7 | 3964.7 | 4137.7 | 4574.5 | 4230.9 | 4574.5 |
| M-PF-V3-02 | 3952.4 | 3952.4 | 4185.4 | 4556.3 | 4253.2 | 4556.3 |
| M-PF-V3-03 | 3964.5 | 3965.1 | 4204.8 | 4595.9 | 4285.5 | 4595.9 |
| M-PF-V3B-01 | 3924.9 | 3925.0 | 4110.7 | 3925.0 | 3925.0 | 4111.4 |
| M-PF-V3B-02 | 3974.8 | 3974.9 | 4240.5 | 3974.9 | 3974.9 | 4241.3 |
| M-PF-V3B-03 | 3960.6 | 3960.6 | 4223.2 | 3961.0 | 3961.0 | 4223.3 |

## 8. Configuration validation

Status: **WARNING**, with one **FAIL** on the Desktop Lighthouse S1 screen block.

| Check | Result | Status |
| ----- | ------ | ------ |
| Lighthouse S2–S10 Mobile viewport 412×823, dSF 1.75, emulation applied | 36/36 | PASS |
| Lighthouse S2–S10 Desktop viewport 1350×940, dSF 1, emulation applied | 36/36 | PASS |
| Lighthouse throttling, both profiles, all 80 | M: 150 ms, 1638.4 kbps, CPU 4×. D: 40 ms, 10240 kbps, CPU 1× | PASS |
| Lighthouse Mobile S1 screen numbers | 412×823 dSF 1.75, but `disabled: true` | WARNING |
| Lighthouse Desktop S1 screen numbers | stored 412×823 dSF 1.75 with `disabled: true`, while form factor and throttling are desktop | FAIL |
| Performance viewport and network throttle, all 24 | dimensions and 204750 / 1280000 B/s match | PASS |
| Performance Mobile CPU | 4× on all 12 | PASS |
| Performance Desktop CPU multiplier | field absent | NOT VERIFIABLE |
| Performance S1 device scale | not stored | NOT VERIFIABLE |
| Network HAR viewport, CPU, and network throttle | not stored in HAR | NOT VERIFIABLE |

Index 01 across tools is a separate cohort: 2026-09-28 for Lighthouse and Network, 2026-09-29 for Performance, origin port 4173, and a Mac host on the Lighthouse files. Index 02 and later is 2026-09-30, port 3000, build `8c8df0b3266b32b841735126151e9b1b1b2b94ba` where that SHA is stored. The build SHA for index 01 is **NOT VERIFIABLE** from the artifacts.

## 9. Latin-square and session validation

Status: **PASS** for order reconstructed from artifact timestamps.

Lighthouse JSON, HAR, and Performance traces do not contain a session-id field. Order was reconstructed by sorting each profile and sample index by `fetchTime`, HAR page `startedDateTime`, or trace `metadata.startTime`. The resulting variant order matches the protocol square for S1–S10 on Lighthouse and Network, and for S1–S3 on Performance. Both profiles match.

The cycle is S1 V1→V2→V3→V3B, S2 V2→V3→V3B→V1, S3 V3→V3B→V1→V2, S4 V3B→V1→V2→V3, then the same cycle through S10. Performance stops at S3.

| Tool | Profile | Session | Expected order | Timestamp order | Status |
| ---- | ------- | ------- | -------------- | --------------- | ------ |
| lighthouse | Mobile | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Mobile | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| lighthouse | Mobile | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| lighthouse | Mobile | S4 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| lighthouse | Mobile | S5 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Mobile | S6 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| lighthouse | Mobile | S7 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| lighthouse | Mobile | S8 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| lighthouse | Mobile | S9 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Mobile | S10 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| lighthouse | Desktop | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Desktop | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| lighthouse | Desktop | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| lighthouse | Desktop | S4 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| lighthouse | Desktop | S5 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Desktop | S6 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| lighthouse | Desktop | S7 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| lighthouse | Desktop | S8 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| lighthouse | Desktop | S9 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| lighthouse | Desktop | S10 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Mobile | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Mobile | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Mobile | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| network | Mobile | S4 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| network | Mobile | S5 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Mobile | S6 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Mobile | S7 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| network | Mobile | S8 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| network | Mobile | S9 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Mobile | S10 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Desktop | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Desktop | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Desktop | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| network | Desktop | S4 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| network | Desktop | S5 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Desktop | S6 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| network | Desktop | S7 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| network | Desktop | S8 | V3B → V1 → V2 → V3 | V3B → V1 → V2 → V3 | PASS |
| network | Desktop | S9 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| network | Desktop | S10 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| performance | Mobile | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| performance | Mobile | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| performance | Mobile | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |
| performance | Desktop | S1 | V1 → V2 → V3 → V3B | V1 → V2 → V3 → V3B | PASS |
| performance | Desktop | S2 | V2 → V3 → V3B → V1 | V2 → V3 → V3B → V1 | PASS |
| performance | Desktop | S3 | V3 → V3B → V1 → V2 | V3 → V3B → V1 → V2 | PASS |

`session-log.md` lists S2–S10 for Lighthouse and Network and S2–S3 for Performance. Those listed orders match the timestamp order. S1 is described in the log as the pre-existing `-01` pass and is not a table row. S1 timestamps still follow V1→V2→V3→V3B.

S1 is not the same sitting as S2. Mobile Lighthouse S1 ends at `M-LH-V3B-01` on 2026-09-28, and S2 starts at `M-LH-V2-02` on 2026-09-30. Inside the 2026-09-30 Mobile Lighthouse run, the longest gap is 9.5 minutes between `M-LH-V3B-05` and `M-LH-V2-06`, which is the session-log interruption after S5. The log says the 16 samples already saved were kept. The timestamp order does not show a repeated or swapped variant after that gap.

## 10. Statistical summary

Status: **PASS** for the statistics that can be computed. Milestone series are n=9 because eight notes files are absent. That n is the count of stored values, not an imputed n=10.

Method, from protocol section 13.6: median is the primary statistic. Q1 and Q3 use the inclusive quartile method (`n=4`, linear interpolation of the inclusive ranks). IQR is Q3 − Q1. Standard deviation is the sample standard deviation with divisor n−1. Mean is supplementary. No p-values, confidence intervals, or significance tests.

Groups are Mobile and Desktop crossed with V1, V2, V3, and V3B. Lighthouse metrics use n=10, including the S1 samples. Network HAR metrics use n=10. Network milestones use the 72 stored notes.

### Lighthouse performance score (0–100)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 78.0 | 78.0 | 78.0 | 0.0 | 70.0 | 78.0 | 2.5 | 77.2 |
| Mobile V2 | 10 | 79.0 | 77.5 | 82.8 | 5.2 | 74.0 | 90.0 | 5.0 | 80.2 |
| Mobile V3 | 10 | 79.0 | 78.2 | 83.5 | 5.2 | 75.0 | 86.0 | 3.4 | 80.4 |
| Mobile V3B | 10 | 81.5 | 80.2 | 85.0 | 4.8 | 77.0 | 91.0 | 4.0 | 82.8 |
| Desktop V1 | 10 | 93.0 | 92.0 | 93.0 | 1.0 | 92.0 | 93.0 | 0.5 | 92.6 |
| Desktop V2 | 10 | 94.0 | 94.0 | 94.0 | 0.0 | 93.0 | 96.0 | 0.8 | 94.0 |
| Desktop V3 | 10 | 94.0 | 94.0 | 94.0 | 0.0 | 93.0 | 95.0 | 0.7 | 94.0 |
| Desktop V3B | 10 | 95.5 | 95.0 | 96.0 | 1.0 | 95.0 | 98.0 | 0.9 | 95.7 |

### Lighthouse FCP (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 3481.8 | 3476.1 | 3486.1 | 10.0 | 3474.0 | 3939.3 | 145.2 | 3526.3 |
| Mobile V2 | 10 | 3613.1 | 3269.5 | 3651.7 | 382.2 | 2557.5 | 3915.8 | 415.0 | 3452.4 |
| Mobile V3 | 10 | 3598.7 | 3195.4 | 3616.5 | 421.2 | 3005.4 | 3764.9 | 267.7 | 3451.0 |
| Mobile V3B | 10 | 3561.1 | 3154.7 | 3615.1 | 460.4 | 2564.9 | 3769.3 | 366.0 | 3376.4 |
| Desktop V1 | 10 | 788.6 | 780.6 | 847.3 | 66.6 | 656.7 | 857.9 | 60.0 | 796.6 |
| Desktop V2 | 10 | 810.9 | 792.2 | 813.0 | 20.8 | 569.4 | 825.7 | 78.0 | 777.0 |
| Desktop V3 | 10 | 805.2 | 740.7 | 820.2 | 79.5 | 658.0 | 829.9 | 66.6 | 773.8 |
| Desktop V3B | 10 | 802.8 | 791.2 | 826.7 | 35.5 | 285.0 | 844.8 | 167.6 | 752.8 |

### Lighthouse LCP (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 3481.8 | 3476.1 | 3486.1 | 10.0 | 3474.0 | 4420.3 | 297.3 | 3574.4 |
| Mobile V2 | 10 | 3613.1 | 3269.5 | 3764.2 | 494.7 | 2557.5 | 4215.8 | 497.9 | 3527.4 |
| Mobile V3 | 10 | 3609.2 | 3195.4 | 3739.4 | 544.0 | 3005.4 | 4064.9 | 338.0 | 3511.0 |
| Mobile V3B | 10 | 3561.1 | 3154.7 | 3615.1 | 460.4 | 2564.9 | 4069.3 | 411.2 | 3406.4 |
| Desktop V1 | 10 | 828.6 | 805.6 | 947.3 | 141.6 | 656.7 | 957.9 | 97.3 | 852.6 |
| Desktop V2 | 10 | 851.2 | 812.2 | 853.5 | 41.2 | 569.4 | 891.3 | 95.3 | 809.0 |
| Desktop V3 | 10 | 825.2 | 740.7 | 860.2 | 119.5 | 658.0 | 889.9 | 83.9 | 799.8 |
| Desktop V3B | 10 | 832.8 | 811.2 | 881.7 | 70.5 | 285.0 | 904.8 | 183.3 | 784.8 |

### Lighthouse Speed Index (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 6902.9 | 6880.2 | 6919.8 | 39.6 | 6876.9 | 7577.0 | 215.3 | 6966.9 |
| Mobile V2 | 10 | 5255.5 | 5185.8 | 5349.9 | 164.1 | 5073.5 | 5485.3 | 121.3 | 5265.4 |
| Mobile V3 | 10 | 5236.0 | 5184.5 | 5268.0 | 83.5 | 5136.6 | 5470.3 | 93.9 | 5243.1 |
| Mobile V3B | 10 | 4428.2 | 4364.1 | 4437.5 | 73.3 | 4262.7 | 4718.6 | 119.8 | 4424.7 |
| Desktop V1 | 10 | 2621.0 | 2610.4 | 2639.4 | 29.0 | 2591.9 | 2652.5 | 18.8 | 2623.7 |
| Desktop V2 | 10 | 2314.3 | 2307.7 | 2317.8 | 10.1 | 2111.2 | 2332.6 | 65.2 | 2294.0 |
| Desktop V3 | 10 | 2317.9 | 2294.5 | 2320.2 | 25.7 | 2132.1 | 2329.2 | 59.7 | 2293.2 |
| Desktop V3B | 10 | 1901.7 | 1887.0 | 1908.4 | 21.3 | 1709.6 | 1915.4 | 61.5 | 1880.4 |

### Lighthouse TBT (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 34.0 | 33.0 | 36.5 | 3.5 | 12.0 | 42.0 | 8.0 | 33.0 |
| Mobile V2 | 10 | 39.5 | 38.0 | 49.2 | 11.2 | 24.0 | 58.5 | 10.5 | 42.0 |
| Mobile V3 | 10 | 39.5 | 38.3 | 42.0 | 3.7 | 22.0 | 68.0 | 12.1 | 40.6 |
| Mobile V3B | 10 | 35.9 | 29.0 | 39.7 | 10.7 | 17.0 | 65.7 | 13.3 | 35.4 |
| Desktop V1 | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop V2 | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop V3 | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Desktop V3B | 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |

Desktop TBT is 0 on all 40 Desktop Lighthouse samples.

### Lighthouse CLS

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile V2 | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile V3 | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Mobile V3B | 10 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| Desktop V1 | 10 | 0.0218 | 0.0218 | 0.0218 | 0.0000 | 0.0000 | 0.0218 | 0.0069 | 0.0196 |
| Desktop V2 | 10 | 0.0134 | 0.0124 | 0.0134 | 0.0010 | 0.0102 | 0.0134 | 0.0011 | 0.0128 |
| Desktop V3 | 10 | 0.0134 | 0.0134 | 0.0134 | 0.0000 | 0.0102 | 0.0134 | 0.0011 | 0.0129 |
| Desktop V3B | 10 | 0.0134 | 0.0134 | 0.0134 | 0.0000 | 0.0095 | 0.0134 | 0.0013 | 0.0129 |

Mobile CLS is 0 on all 40 Mobile Lighthouse samples. Desktop CLS medians are about 0.0134 except where a sample differs, including `D-LH-V1-01` at 0.

### Network requests

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile V2 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile V3 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Mobile V3B | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop V1 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop V2 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop V3 | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |
| Desktop V3B | 10 | 53 | 53 | 53 | 0 | 53 | 53 | 0 | 53 |

### Network transferred bytes

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 440,074 | 440,074 | 440,074 | 0 | 438,137 | 440,074 | 613 | 439,880 |
| Mobile V2 | 10 | 444,502 | 444,502 | 444,502 | 0 | 442,565 | 444,502 | 613 | 444,308 |
| Mobile V3 | 10 | 444,736 | 444,736 | 444,736 | 0 | 442,799 | 444,736 | 613 | 444,542 |
| Mobile V3B | 10 | 444,738 | 444,738 | 444,738 | 0 | 442,801 | 444,738 | 613 | 444,544 |
| Desktop V1 | 10 | 440,074 | 440,074 | 440,074 | 0 | 438,137 | 440,074 | 613 | 439,880 |
| Desktop V2 | 10 | 444,502 | 444,502 | 444,502 | 0 | 442,565 | 444,502 | 613 | 444,308 |
| Desktop V3 | 10 | 444,736 | 444,736 | 444,736 | 0 | 442,799 | 444,736 | 613 | 444,542 |
| Desktop V3B | 10 | 444,738 | 444,738 | 444,738 | 0 | 442,801 | 444,738 | 613 | 444,544 |

### Network resource bytes

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 1,213,247 | 1,213,247 | 1,213,247 | 0 | 1,200,119 | 1,213,247 | 4,151 | 1,211,934 |
| Mobile V2 | 10 | 1,217,627 | 1,217,627 | 1,217,627 | 0 | 1,204,499 | 1,217,627 | 4,151 | 1,216,314 |
| Mobile V3 | 10 | 1,217,861 | 1,217,861 | 1,217,861 | 0 | 1,204,733 | 1,217,861 | 4,151 | 1,216,548 |
| Mobile V3B | 10 | 1,217,863 | 1,217,863 | 1,217,863 | 0 | 1,204,735 | 1,217,863 | 4,151 | 1,216,550 |
| Desktop V1 | 10 | 1,213,247 | 1,213,247 | 1,213,247 | 0 | 1,200,119 | 1,213,247 | 4,151 | 1,211,934 |
| Desktop V2 | 10 | 1,217,627 | 1,217,627 | 1,217,627 | 0 | 1,204,499 | 1,217,627 | 4,151 | 1,216,314 |
| Desktop V3 | 10 | 1,217,861 | 1,217,861 | 1,217,861 | 0 | 1,204,733 | 1,217,861 | 4,151 | 1,216,548 |
| Desktop V3B | 10 | 1,217,863 | 1,217,863 | 1,217,863 | 0 | 1,204,735 | 1,217,863 | 4,151 | 1,216,550 |

### Network document time (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 3609.7 | 3607.4 | 3612.2 | 4.8 | 3605.5 | 3625.2 | 6.8 | 3611.7 |
| Mobile V2 | 10 | 4521.1 | 4517.2 | 4522.9 | 5.7 | 4514.6 | 4526.5 | 4.1 | 4520.6 |
| Mobile V3 | 10 | 4520.1 | 4518.4 | 4521.5 | 3.0 | 4516.0 | 4529.5 | 3.6 | 4520.7 |
| Mobile V3B | 10 | 3523.7 | 3519.0 | 3530.8 | 11.8 | 3512.4 | 3534.7 | 7.8 | 3524.3 |
| Desktop V1 | 10 | 3524.8 | 3524.1 | 3525.7 | 1.6 | 3522.4 | 3538.9 | 4.6 | 3526.1 |
| Desktop V2 | 10 | 4509.6 | 4509.0 | 4511.0 | 2.0 | 4507.2 | 4518.4 | 3.1 | 4510.5 |
| Desktop V3 | 10 | 4509.9 | 4509.3 | 4511.2 | 1.9 | 4507.7 | 4525.4 | 5.0 | 4511.5 |
| Desktop V3B | 10 | 3507.1 | 3506.4 | 3508.4 | 2.0 | 3506.2 | 3518.9 | 3.8 | 3508.4 |

### Network DOMContentLoaded (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 4055.3 | 4053.4 | 4058.3 | 4.9 | 4047.3 | 4513.6 | 144.4 | 4105.3 |
| Mobile V2 | 10 | 4527.6 | 4523.3 | 4529.7 | 6.3 | 4519.4 | 4532.6 | 4.1 | 4526.6 |
| Mobile V3 | 10 | 4524.8 | 4524.2 | 4527.2 | 3.1 | 4522.0 | 4535.5 | 3.9 | 4526.0 |
| Mobile V3B | 10 | 3527.0 | 3523.3 | 3534.8 | 11.5 | 3520.5 | 3540.4 | 7.1 | 3529.1 |
| Desktop V1 | 10 | 3614.7 | 3613.1 | 3617.2 | 4.1 | 3608.1 | 3664.0 | 16.0 | 3619.3 |
| Desktop V2 | 10 | 4511.6 | 4510.6 | 4513.0 | 2.4 | 4509.5 | 4521.8 | 3.6 | 4512.7 |
| Desktop V3 | 10 | 4512.0 | 4511.5 | 4513.4 | 2.0 | 4509.3 | 4525.7 | 4.5 | 4513.3 |
| Desktop V3B | 10 | 3509.3 | 3508.4 | 3510.6 | 2.2 | 3507.8 | 3519.1 | 3.3 | 3510.3 |

### Network load (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 10 | 5997.9 | 5996.9 | 6003.4 | 6.5 | 5985.5 | 9353.8 | 1059.3 | 6339.8 |
| Mobile V2 | 10 | 4528.9 | 4524.4 | 4532.8 | 8.4 | 4520.4 | 7399.0 | 907.9 | 4815.1 |
| Mobile V3 | 10 | 4529.3 | 4525.4 | 4533.7 | 8.2 | 4523.5 | 7401.0 | 908.0 | 4816.9 |
| Mobile V3B | 10 | 3693.1 | 3684.6 | 3699.8 | 15.2 | 3678.9 | 7254.0 | 1126.6 | 4047.8 |
| Desktop V1 | 10 | 4019.4 | 4018.9 | 4020.4 | 1.5 | 4015.8 | 4073.5 | 17.3 | 4024.7 |
| Desktop V2 | 10 | 4512.9 | 4511.6 | 4514.3 | 2.7 | 4510.8 | 4527.1 | 4.8 | 4514.2 |
| Desktop V3 | 10 | 4513.3 | 4512.7 | 4514.9 | 2.2 | 4510.8 | 4529.6 | 5.4 | 4514.9 |
| Desktop V3B | 10 | 3510.4 | 3509.8 | 3511.6 | 1.8 | 3509.4 | 3522.2 | 3.8 | 3511.7 |

### Network milestone A (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.6 | 6064.3 |
| Mobile V2 | 9 | 3715.2 | 3708.1 | 3728.0 | 19.9 | 3705.1 | 3733.1 | 10.7 | 3718.3 |
| Mobile V3 | 9 | 3711.6 | 3708.5 | 3715.4 | 6.9 | 3701.1 | 3762.3 | 18.6 | 3717.1 |
| Mobile V3B | 9 | 3739.4 | 3735.9 | 3755.1 | 19.2 | 3727.7 | 3771.8 | 14.2 | 3746.0 |
| Desktop V1 | 9 | 4035.4 | 4034.8 | 4037.7 | 2.9 | 4032.2 | 4042.3 | 3.2 | 4036.7 |
| Desktop V2 | 9 | 1591.4 | 1588.6 | 1596.5 | 7.9 | 1586.6 | 1601.1 | 5.1 | 1592.6 |
| Desktop V3 | 9 | 1596.2 | 1591.3 | 1600.1 | 8.8 | 1590.3 | 1602.9 | 5.0 | 1596.0 |
| Desktop V3B | 9 | 1591.4 | 1590.1 | 1596.3 | 6.2 | 1589.9 | 1598.3 | 3.3 | 1592.9 |

### Network milestone B (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.6 | 6064.4 |
| Mobile V2 | 9 | 3715.2 | 3708.7 | 3728.2 | 19.5 | 3705.2 | 3733.1 | 10.7 | 3718.6 |
| Mobile V3 | 9 | 3711.7 | 3708.7 | 3715.4 | 6.7 | 3701.1 | 3763.0 | 18.7 | 3717.3 |
| Mobile V3B | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop V1 | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.2 | 4042.3 | 3.2 | 4036.8 |
| Desktop V2 | 9 | 1591.5 | 1588.7 | 1596.5 | 7.8 | 1586.6 | 1601.2 | 5.1 | 1592.6 |
| Desktop V3 | 9 | 1596.3 | 1591.3 | 1600.1 | 8.8 | 1590.3 | 1602.9 | 5.0 | 1596.0 |
| Desktop V3B | 9 | 1591.4 | 1590.2 | 1596.3 | 6.1 | 1590.0 | 1598.3 | 3.2 | 1592.9 |

### Network milestone C (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6145.5 | 6144.6 | 6149.1 | 4.5 | 6139.2 | 6331.1 | 62.0 | 6166.2 |
| Mobile V2 | 9 | 3801.1 | 3792.2 | 3821.1 | 28.9 | 3785.8 | 3838.5 | 18.7 | 3807.3 |
| Mobile V3 | 9 | 3801.4 | 3784.1 | 3806.4 | 22.3 | 3780.5 | 3874.8 | 29.1 | 3804.9 |
| Mobile V3B | 9 | 3839.6 | 3829.6 | 3853.1 | 23.5 | 3812.8 | 3885.5 | 21.5 | 3842.1 |
| Desktop V1 | 9 | 4058.0 | 4057.0 | 4059.3 | 2.3 | 4055.6 | 4064.8 | 3.2 | 4059.1 |
| Desktop V2 | 9 | 3542.9 | 3542.8 | 3546.4 | 3.6 | 3536.8 | 3553.4 | 4.8 | 3544.0 |
| Desktop V3 | 9 | 3545.3 | 3543.7 | 3551.4 | 7.7 | 3542.0 | 3561.1 | 6.4 | 3548.4 |
| Desktop V3B | 9 | 2543.0 | 2538.2 | 2544.8 | 6.6 | 2530.5 | 2545.8 | 5.0 | 2541.3 |

### Network milestone D (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.5 | 6064.4 |
| Mobile V2 | 9 | 4534.6 | 4530.0 | 4536.4 | 6.4 | 4526.3 | 4538.7 | 4.3 | 4533.3 |
| Mobile V3 | 9 | 4531.3 | 4530.3 | 4533.3 | 3.0 | 4527.0 | 4541.4 | 4.3 | 4532.6 |
| Mobile V3B | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop V1 | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.2 | 4042.3 | 3.2 | 4036.8 |
| Desktop V2 | 9 | 4512.2 | 4511.9 | 4513.8 | 1.9 | 4510.3 | 4515.8 | 1.9 | 4512.8 |
| Desktop V3 | 9 | 4515.3 | 4512.5 | 4517.7 | 5.2 | 4509.7 | 4519.9 | 3.4 | 4514.9 |
| Desktop V3B | 9 | 3511.8 | 3509.3 | 3512.6 | 3.3 | 3508.4 | 3514.8 | 2.1 | 3511.2 |

### Network milestone E (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6051.3 | 6048.1 | 6054.5 | 6.4 | 6044.6 | 6172.0 | 40.5 | 6064.4 |
| Mobile V2 | 9 | 4040.4 | 4039.8 | 4042.7 | 2.9 | 4037.5 | 4091.0 | 16.9 | 4046.5 |
| Mobile V3 | 9 | 4035.3 | 4033.5 | 4039.9 | 6.4 | 4029.3 | 4043.0 | 4.8 | 4035.9 |
| Mobile V3B | 9 | 3740.7 | 3735.9 | 3755.2 | 19.3 | 3727.8 | 3771.9 | 14.2 | 3746.2 |
| Desktop V1 | 9 | 4035.4 | 4034.8 | 4037.8 | 3.0 | 4032.4 | 4042.3 | 3.2 | 4036.8 |
| Desktop V2 | 9 | 4013.0 | 4012.8 | 4013.8 | 1.0 | 4012.4 | 4025.1 | 4.1 | 4014.8 |
| Desktop V3 | 9 | 4013.6 | 4012.9 | 4017.0 | 4.1 | 4012.2 | 4020.4 | 2.8 | 4014.9 |
| Desktop V3B | 9 | 3010.3 | 3010.1 | 3010.7 | 0.6 | 3009.3 | 3015.0 | 1.8 | 3010.8 |

### Network milestone F (ms), stored notes only

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 9 | 6145.6 | 6144.6 | 6149.1 | 4.5 | 6139.3 | 6331.7 | 62.2 | 6166.4 |
| Mobile V2 | 9 | 4534.6 | 4530.0 | 4536.5 | 6.5 | 4526.3 | 4538.9 | 4.3 | 4533.5 |
| Mobile V3 | 9 | 4531.3 | 4530.3 | 4533.3 | 3.0 | 4527.1 | 4541.6 | 4.3 | 4532.6 |
| Mobile V3B | 9 | 3839.7 | 3829.6 | 3853.2 | 23.6 | 3812.8 | 3885.5 | 21.5 | 3842.3 |
| Desktop V1 | 9 | 4058.0 | 4057.1 | 4059.4 | 2.3 | 4055.6 | 4064.9 | 3.2 | 4059.1 |
| Desktop V2 | 9 | 4512.3 | 4511.9 | 4513.9 | 2.0 | 4510.3 | 4515.8 | 1.9 | 4512.8 |
| Desktop V3 | 9 | 4515.3 | 4512.5 | 4517.8 | 5.3 | 4509.7 | 4520.0 | 3.5 | 4514.9 |
| Desktop V3B | 9 | 3511.8 | 3509.3 | 3512.6 | 3.3 | 3508.5 | 3514.8 | 2.1 | 3511.2 |

### Performance trace milestones, diagnostic n=3

These medians corroborate the traces. They are not the primary n=10 milestone series.

#### Trace milestone A (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6241.4 | 6239.9 | 6262.4 | 22.6 | 6238.3 | 6283.5 | 25.2 | 6254.4 |
| Mobile V2 | 3 | 3952.8 | 3938.5 | 3968.2 | 29.7 | 3924.3 | 3983.7 | 29.7 | 3953.6 |
| Mobile V3 | 3 | 3964.5 | 3958.4 | 3964.6 | 6.1 | 3952.4 | 3964.7 | 7.0 | 3960.5 |
| Mobile V3B | 3 | 3960.6 | 3942.7 | 3967.7 | 25.0 | 3924.9 | 3974.8 | 25.7 | 3953.4 |
| Desktop V1 | 3 | 4096.5 | 4092.2 | 4114.8 | 22.5 | 4088.0 | 4133.1 | 24.0 | 4105.9 |
| Desktop V2 | 3 | 1667.1 | 1663.5 | 1676.7 | 13.1 | 1660.0 | 1686.3 | 13.6 | 1671.1 |
| Desktop V3 | 3 | 1656.8 | 1656.3 | 1673.5 | 17.2 | 1655.8 | 1690.2 | 19.6 | 1667.6 |
| Desktop V3B | 3 | 1671.7 | 1667.4 | 1696.9 | 29.5 | 1663.1 | 1722.2 | 31.9 | 1685.7 |

#### Trace milestone B (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6241.5 | 6240.1 | 6262.7 | 22.6 | 6238.7 | 6283.8 | 25.3 | 6254.7 |
| Mobile V2 | 3 | 3952.8 | 3938.8 | 3968.8 | 30.0 | 3924.8 | 3984.9 | 30.1 | 3954.2 |
| Mobile V3 | 3 | 3964.7 | 3958.5 | 3964.9 | 6.4 | 3952.4 | 3965.1 | 7.2 | 3960.7 |
| Mobile V3B | 3 | 3960.6 | 3942.8 | 3967.8 | 24.9 | 3925.0 | 3974.9 | 25.7 | 3953.5 |
| Desktop V1 | 3 | 4096.6 | 4092.4 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop V2 | 3 | 1667.3 | 1663.8 | 1676.8 | 13.1 | 1660.2 | 1686.4 | 13.6 | 1671.3 |
| Desktop V3 | 3 | 1656.9 | 1656.4 | 1673.5 | 17.1 | 1655.9 | 1690.2 | 19.5 | 1667.7 |
| Desktop V3B | 3 | 1671.9 | 1667.6 | 1697.0 | 29.5 | 1663.2 | 1722.2 | 31.9 | 1685.8 |

#### Trace milestone C (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6502.0 | 6498.9 | 6502.1 | 3.2 | 6495.8 | 6502.3 | 3.7 | 6500.0 |
| Mobile V2 | 3 | 4157.3 | 4146.2 | 4203.8 | 57.5 | 4135.2 | 4250.2 | 61.0 | 4180.9 |
| Mobile V3 | 3 | 4185.4 | 4161.5 | 4195.1 | 33.6 | 4137.7 | 4204.8 | 34.5 | 4176.0 |
| Mobile V3B | 3 | 4223.2 | 4166.9 | 4231.9 | 64.9 | 4110.7 | 4240.5 | 70.5 | 4191.5 |
| Desktop V1 | 3 | 4174.9 | 4162.9 | 4177.2 | 14.4 | 4150.8 | 4179.6 | 15.5 | 4168.4 |
| Desktop V2 | 3 | 3577.5 | 3568.8 | 3600.9 | 32.2 | 3560.0 | 3624.4 | 33.3 | 3587.3 |
| Desktop V3 | 3 | 3583.1 | 3571.6 | 3589.2 | 17.6 | 3560.2 | 3595.3 | 17.8 | 3579.5 |
| Desktop V3B | 3 | 2567.5 | 2565.4 | 2572.2 | 6.8 | 2563.3 | 2576.9 | 7.0 | 2569.2 |

#### Trace milestone D (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6241.5 | 6240.1 | 6262.7 | 22.5 | 6238.8 | 6283.8 | 25.2 | 6254.7 |
| Mobile V2 | 3 | 4550.6 | 4538.1 | 4595.0 | 56.9 | 4525.6 | 4639.4 | 59.8 | 4571.9 |
| Mobile V3 | 3 | 4574.5 | 4565.4 | 4585.2 | 19.8 | 4556.3 | 4595.9 | 19.8 | 4575.6 |
| Mobile V3B | 3 | 3961.0 | 3943.0 | 3967.9 | 24.9 | 3925.0 | 3974.9 | 25.8 | 3953.6 |
| Desktop V1 | 3 | 4096.7 | 4092.4 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop V2 | 3 | 4516.2 | 4515.4 | 4516.2 | 0.8 | 4514.5 | 4516.2 | 1.0 | 4515.6 |
| Desktop V3 | 3 | 4520.4 | 4518.0 | 4520.6 | 2.6 | 4515.7 | 4520.9 | 2.9 | 4519.0 |
| Desktop V3B | 3 | 3510.9 | 3510.7 | 3511.7 | 1.0 | 3510.5 | 3512.4 | 1.0 | 3511.3 |

#### Trace milestone E (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6241.5 | 6240.1 | 6262.7 | 22.5 | 6238.8 | 6283.8 | 25.2 | 6254.7 |
| Mobile V2 | 3 | 4221.2 | 4213.6 | 4277.8 | 64.2 | 4206.1 | 4334.4 | 70.1 | 4253.9 |
| Mobile V3 | 3 | 4253.2 | 4242.1 | 4269.4 | 27.3 | 4230.9 | 4285.5 | 27.5 | 4256.5 |
| Mobile V3B | 3 | 3961.0 | 3943.0 | 3967.9 | 24.9 | 3925.0 | 3974.9 | 25.8 | 3953.6 |
| Desktop V1 | 3 | 4096.7 | 4092.4 | 4114.9 | 22.5 | 4088.2 | 4133.2 | 23.9 | 4106.0 |
| Desktop V2 | 3 | 4015.7 | 4015.7 | 4017.1 | 1.4 | 4015.7 | 4018.6 | 1.7 | 4016.7 |
| Desktop V3 | 3 | 4016.7 | 4015.7 | 4017.6 | 1.9 | 4014.8 | 4018.5 | 1.9 | 4016.7 |
| Desktop V3B | 3 | 3012.9 | 3011.7 | 3013.7 | 2.0 | 3010.5 | 3014.4 | 2.0 | 3012.6 |

#### Trace milestone F (ms)

| Group | n | Median | Q1 | Q3 | IQR | Min | Max | SD | Mean |
| ----- | -: | -----: | -: | -: | --: | --: | --: | -: | ---: |
| Mobile V1 | 3 | 6502.7 | 6499.5 | 6502.9 | 3.4 | 6496.3 | 6503.1 | 3.8 | 6500.7 |
| Mobile V2 | 3 | 4550.6 | 4538.1 | 4595.1 | 56.9 | 4525.7 | 4639.6 | 59.9 | 4572.0 |
| Mobile V3 | 3 | 4574.5 | 4565.4 | 4585.2 | 19.8 | 4556.3 | 4595.9 | 19.8 | 4575.6 |
| Mobile V3B | 3 | 4223.3 | 4167.3 | 4232.3 | 65.0 | 4111.4 | 4241.3 | 70.4 | 4192.0 |
| Desktop V1 | 3 | 4175.0 | 4162.9 | 4177.3 | 14.4 | 4150.9 | 4179.7 | 15.5 | 4168.5 |
| Desktop V2 | 3 | 4516.2 | 4515.4 | 4516.2 | 0.9 | 4514.5 | 4516.3 | 1.0 | 4515.7 |
| Desktop V3 | 3 | 4520.4 | 4518.1 | 4520.7 | 2.6 | 4515.8 | 4521.0 | 2.8 | 4519.1 |
| Desktop V3B | 3 | 3511.0 | 3510.8 | 3511.7 | 0.9 | 3510.6 | 3512.4 | 0.9 | 3511.3 |

## 11. V3B vs V3 comparison

Status: **PASS** as a measured comparison. This section does not rank variants and does not evaluate H3.

Δ median = V3B median − V3 median. Relative change = (Δ / V3 median) × 100. A negative relative change means the V3B median is lower. Where the V3 median is 0, relative change is not defined.

The sign of Δ is not the same on every metric.

Lighthouse n is 10/10. Milestone n is 9/9 because S1 notes are absent.

### Lighthouse

| Profile | Metric | n | V3B median | V3 median | Δ median | Relative change (%) |
| ------- | ------ | -: | ---------: | --------: | -------: | ------------------: |
| Mobile | FCP | 10/10 | 3561.1 | 3598.7 | -37.7 | -1.0 |
| Desktop | FCP | 10/10 | 802.8 | 805.2 | -2.4 | -0.3 |
| Mobile | LCP | 10/10 | 3561.1 | 3609.2 | -48.1 | -1.3 |
| Desktop | LCP | 10/10 | 832.8 | 825.2 | 7.6 | 0.9 |
| Mobile | Speed Index | 10/10 | 4428.2 | 5236.0 | -807.8 | -15.4 |
| Desktop | Speed Index | 10/10 | 1901.7 | 2317.9 | -416.2 | -18.0 |
| Mobile | TBT | 10/10 | 35.9 | 39.5 | -3.6 | -9.2 |
| Desktop | TBT | 10/10 | 0.0 | 0.0 | 0.0 | not defined |
| Mobile | CLS | 10/10 | 0.0000 | 0.0000 | 0.0000 | not defined |
| Desktop | CLS | 10/10 | 0.0134 | 0.0134 | 0.0000 | 0.0 |
| Mobile | Performance score | 10/10 | 81.5 | 79.0 | 2.5 | 3.2 |
| Desktop | Performance score | 10/10 | 95.5 | 94.0 | 1.5 | 1.6 |

### Network milestones C–F

| Profile | Metric | n | V3B median | V3 median | Δ median | Relative change (%) |
| ------- | ------ | -: | ---------: | --------: | -------: | ------------------: |
| Mobile | C | 9/9 | 3839.6 | 3801.4 | 38.2 | 1.0 |
| Desktop | C | 9/9 | 2543.0 | 3545.3 | -1002.3 | -28.3 |
| Mobile | D | 9/9 | 3740.7 | 4531.3 | -790.6 | -17.4 |
| Desktop | D | 9/9 | 3511.8 | 4515.3 | -1003.5 | -22.2 |
| Mobile | E | 9/9 | 3740.7 | 4035.3 | -294.6 | -7.3 |
| Desktop | E | 9/9 | 3010.3 | 4013.6 | -1003.3 | -25.0 |
| Mobile | F | 9/9 | 3839.7 | 4531.3 | -691.6 | -15.3 |
| Desktop | F | 9/9 | 3511.8 | 4515.3 | -1003.5 | -22.2 |

### Other recorded Network metrics

| Profile | Metric | n | V3B median | V3 median | Δ median | Relative change (%) |
| ------- | ------ | -: | ---------: | --------: | -------: | ------------------: |
| Mobile | Requests | 10/10 | 53 | 53 | 0 | 0.0 |
| Desktop | Requests | 10/10 | 53 | 53 | 0 | 0.0 |
| Mobile | Document time | 10/10 | 3523.7 | 4520.1 | -996.4 | -22.0 |
| Desktop | Document time | 10/10 | 3507.1 | 4509.9 | -1002.8 | -22.2 |
| Mobile | Load | 10/10 | 3693.1 | 4529.3 | -836.2 | -18.5 |
| Desktop | Load | 10/10 | 3510.4 | 4513.3 | -1002.8 | -22.2 |

## 12. Potential anomalies

Status: **WARNING**.

Rule used for this audit only: within each profile × variant × metric, flag a value outside the Tukey fence Q1 − 1.5 IQR to Q3 + 1.5 IQR. If IQR is 0, flag any value that differs from the median. This fence is not a protocol exclusion rule. Flagged samples stay in every n above.

The fence flagged 108 metric values across 44 samples. 28 flags differ from the group median by at least 10%, or the median is 0 so a percentage is not defined. 80 flags are under 10% and come mostly from tight groups, including transferred-byte totals and small TBT differences.

Fifteen of the flagged sample IDs are index 01. Several of the larger Lighthouse and load-time flags are that S1 cohort, including the Desktop Lighthouse screen mismatch. They are listed so the cohort can be discussed later. They were not removed.

### Flags at least 10% from the group median

| Sample ID | Group | Metric | Observed | Group median | Deviation from median | Reason |
| --------- | ----- | ------ | -------: | -----------: | --------------------: | ------ |
| D-LH-V1-01 | Desktop V1 | CLS | 0.0000 | 0.0218 | -100.0% | IQR is 0 and the value differs from the group median |
| M-NW-V3B-01 | Mobile V3B | Load | 7254.0 | 3693.1 | 96.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3B-07 | Mobile V3B | TBT | 65.7 | 35.9 | 83.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-07 | Mobile V3 | TBT | 68.0 | 39.5 | 72.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | LCP | 285.0 | 832.8 | -65.8% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | TBT | 12.0 | 34.0 | -64.7% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | FCP | 285.0 | 802.8 | -64.5% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-01 | Mobile V3 | Load | 7401.0 | 4529.3 | 63.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V2-01 | Mobile V2 | Load | 7399.0 | 4528.9 | 63.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | Load | 9353.8 | 5997.9 | 55.9% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-01 | Mobile V3 | TBT | 22.0 | 39.5 | -44.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | LCP | 569.4 | 851.2 | -33.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | FCP | 569.4 | 810.9 | -29.8% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | CLS | 0.0095 | 0.0134 | -29.4% | IQR is 0 and the value differs from the group median |
| M-LH-V2-07 | Mobile V2 | FCP | 2557.5 | 3613.1 | -29.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-09 | Mobile V3 | TBT | 28.0 | 39.5 | -29.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | LCP | 4420.3 | 3481.8 | 27.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | CLS | 0.0102 | 0.0134 | -24.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3-01 | Desktop V3 | CLS | 0.0102 | 0.0134 | -24.2% | IQR is 0 and the value differs from the group median |
| M-LH-V1-10 | Mobile V1 | TBT | 42.0 | 34.0 | 23.5% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-10 | Mobile V3 | TBT | 48.0 | 39.5 | 21.5% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V1-01 | Desktop V1 | FCP | 656.7 | 788.6 | -16.7% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-08 | Desktop V2 | LCP | 726.4 | 851.2 | -14.7% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | FCP | 3939.3 | 3481.8 | 13.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | DOMContentLoaded | 4513.6 | 4055.3 | 11.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-08 | Desktop V2 | FCP | 726.4 | 810.9 | -10.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V1-01 | Mobile V1 | Performance score | 70.0 | 78.0 | -10.3% | IQR is 0 and the value differs from the group median |
| D-LH-V3B-01 | Desktop V3B | Speed Index | 1709.6 | 1901.7 | -10.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |

### Other fence flags

| Sample ID | Group | Metric | Observed | Group median | Deviation from median | Reason |
| --------- | ----- | ------ | -------: | -----------: | --------------------: | ------ |
| M-LH-V1-01 | Mobile V1 | Speed Index | 7577.0 | 6902.9 | 9.8% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3-02 | Desktop V3 | CLS | 0.0121 | 0.0134 | -9.6% | IQR is 0 and the value differs from the group median |
| D-LH-V3B-09 | Desktop V3B | CLS | 0.0121 | 0.0134 | -9.6% | IQR is 0 and the value differs from the group median |
| D-LH-V3B-02 | Desktop V3B | FCP | 727.6 | 802.8 | -9.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | Speed Index | 2111.2 | 2314.3 | -8.8% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3-01 | Desktop V3 | Speed Index | 2132.1 | 2317.9 | -8.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3B-01 | Mobile V3B | Speed Index | 4718.6 | 4428.2 | 6.6% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-LH-V3-01 | Mobile V3 | Speed Index | 5470.3 | 5236.0 | 4.5% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | F | 6331.7 | 6145.6 | 3.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | C | 6331.1 | 6145.5 | 3.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V3B-01 | Desktop V3B | Performance score | 98.0 | 95.5 | 2.6% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-LH-V2-01 | Desktop V2 | Performance score | 96.0 | 94.0 | 2.1% | IQR is 0 and the value differs from the group median |
| M-NW-V1-04 | Mobile V1 | A | 6172.0 | 6051.3 | 2.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | B | 6172.0 | 6051.3 | 2.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | D | 6172.0 | 6051.3 | 2.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | E | 6172.0 | 6051.3 | 2.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | C | 3874.8 | 3801.4 | 1.9% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | B | 3763.0 | 3711.7 | 1.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | A | 3762.3 | 3711.6 | 1.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-01 | Desktop V1 | DOMContentLoaded | 3664.0 | 3614.7 | 1.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-01 | Desktop V1 | Load | 4073.5 | 4019.4 | 1.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V2-04 | Mobile V2 | E | 4091.0 | 4040.4 | 1.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | DOMContentLoaded | 4106.1 | 4055.3 | 1.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | Load | 6071.9 | 5997.9 | 1.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | Resource bytes | 1,200,119 | 1,213,247 | -1.1% | IQR is 0 and the value differs from the group median |
| D-NW-V1-01 | Desktop V1 | Resource bytes | 1,200,119 | 1,213,247 | -1.1% | IQR is 0 and the value differs from the group median |
| M-NW-V2-01 | Mobile V2 | Resource bytes | 1,204,499 | 1,217,627 | -1.1% | IQR is 0 and the value differs from the group median |
| D-NW-V2-01 | Desktop V2 | Resource bytes | 1,204,499 | 1,217,627 | -1.1% | IQR is 0 and the value differs from the group median |
| M-NW-V3-01 | Mobile V3 | Resource bytes | 1,204,733 | 1,217,861 | -1.1% | IQR is 0 and the value differs from the group median |
| D-NW-V3-01 | Desktop V3 | Resource bytes | 1,204,733 | 1,217,861 | -1.1% | IQR is 0 and the value differs from the group median |
| M-NW-V3B-01 | Mobile V3B | Resource bytes | 1,204,735 | 1,217,863 | -1.1% | IQR is 0 and the value differs from the group median |
| D-NW-V3B-01 | Desktop V3B | Resource bytes | 1,204,735 | 1,217,863 | -1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V2-09 | Desktop V2 | Performance score | 93.0 | 94.0 | -1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V2-10 | Desktop V2 | Performance score | 93.0 | 94.0 | -1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V3-01 | Desktop V3 | Performance score | 95.0 | 94.0 | 1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V3-05 | Desktop V3 | Performance score | 93.0 | 94.0 | -1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V3-06 | Desktop V3 | Performance score | 95.0 | 94.0 | 1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V3-09 | Desktop V3 | Performance score | 93.0 | 94.0 | -1.1% | IQR is 0 and the value differs from the group median |
| D-LH-V2-08 | Desktop V2 | Speed Index | 2290.6 | 2314.3 | -1.0% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-05 | Mobile V3 | A | 3728.0 | 3711.6 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-05 | Mobile V3 | B | 3728.1 | 3711.7 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-01 | Mobile V1 | Transferred bytes | 438,137 | 440,074 | -0.4% | IQR is 0 and the value differs from the group median |
| D-NW-V1-01 | Desktop V1 | Transferred bytes | 438,137 | 440,074 | -0.4% | IQR is 0 and the value differs from the group median |
| M-NW-V2-01 | Mobile V2 | Transferred bytes | 442,565 | 444,502 | -0.4% | IQR is 0 and the value differs from the group median |
| D-NW-V2-01 | Desktop V2 | Transferred bytes | 442,565 | 444,502 | -0.4% | IQR is 0 and the value differs from the group median |
| M-NW-V3-01 | Mobile V3 | Transferred bytes | 442,799 | 444,736 | -0.4% | IQR is 0 and the value differs from the group median |
| D-NW-V3-01 | Desktop V3 | Transferred bytes | 442,799 | 444,736 | -0.4% | IQR is 0 and the value differs from the group median |
| M-NW-V3B-01 | Mobile V3B | Transferred bytes | 442,801 | 444,738 | -0.4% | IQR is 0 and the value differs from the group median |
| D-NW-V3B-01 | Desktop V3B | Transferred bytes | 442,801 | 444,738 | -0.4% | IQR is 0 and the value differs from the group median |
| M-NW-V1-01 | Mobile V1 | Document time | 3625.2 | 3609.7 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-01 | Desktop V1 | Document time | 3538.9 | 3524.8 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3-01 | Desktop V3 | Load | 4529.6 | 4513.3 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-04 | Mobile V1 | Document time | 3622.6 | 3609.7 | 0.4% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3-01 | Desktop V3 | Document time | 4525.4 | 4509.9 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3B-01 | Desktop V3B | Document time | 3518.9 | 3507.1 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3B-01 | Desktop V3B | Load | 3522.2 | 3510.4 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-01 | Desktop V2 | Load | 4527.1 | 4512.9 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3-01 | Desktop V3 | DOMContentLoaded | 4525.7 | 4512.0 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-08 | Desktop V2 | E | 4025.1 | 4013.0 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-05 | Desktop V2 | C | 3553.4 | 3542.9 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3B-01 | Desktop V3B | DOMContentLoaded | 3519.1 | 3509.3 | 0.3% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | DOMContentLoaded | 4535.5 | 4524.8 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | F | 4541.6 | 4531.3 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-01 | Desktop V2 | DOMContentLoaded | 4521.8 | 4511.6 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | D | 4541.4 | 4531.3 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V3-04 | Mobile V3 | Document time | 4529.5 | 4520.1 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V1-06 | Mobile V1 | Load | 5985.5 | 5997.9 | -0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-01 | Desktop V2 | Document time | 4518.4 | 4509.6 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| M-NW-V2-03 | Mobile V2 | E | 4047.8 | 4040.4 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-07 | Desktop V2 | C | 3536.8 | 3542.9 | -0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-05 | Desktop V1 | A | 4042.3 | 4035.4 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-08 | Desktop V1 | F | 4064.9 | 4058.0 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-08 | Desktop V1 | C | 4064.8 | 4058.0 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3B-05 | Desktop V3B | E | 3015.0 | 3010.3 | 0.2% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-05 | Desktop V1 | C | 4064.0 | 4058.0 | 0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-05 | Desktop V1 | F | 4064.0 | 4058.0 | 0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V2-05 | Desktop V2 | E | 4017.3 | 4013.0 | 0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-05 | Desktop V1 | Load | 4023.2 | 4019.4 | 0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V1-09 | Desktop V1 | Load | 4015.8 | 4019.4 | -0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |
| D-NW-V3B-04 | Desktop V3B | E | 3012.0 | 3010.3 | 0.1% | outside the Tukey fence (Q1 - 1.5 IQR, Q3 + 1.5 IQR) |

Performance-trace Tukey flags: none. With n=3 the fence is wide, so the S1 versus CDP scripting difference does not appear here. That difference is reported in section 7 as a capture-method split, not as a discarded sample.

## 13. Documentation consistency

Status: **WARNING**.

Corrections made in this audit:

| Document | Change |
| -------- | ------ |
| `docs/measurements/experiment-001/final-measurement-tracker.md` | Total required samples changed from 208 to 184. Collected count was already 184. |
| `docs/experiments.md` | Two status lines no longer say formal measurements have not started. Exploratory tables were left as exploratory. |
| `docs/experiment-001-measurement-protocol.md` | Section 17 status and the section 18 next-step line now say the formal campaign is complete. Measurement procedure text was not rewritten. |

| Document | Check | Status |
| -------- | ----- | ------ |
| Protocol §13.5 | Lighthouse 10, Network 10, Performance 3; 160 primary + 24 diagnostic | PASS |
| Protocol §13.6 | Median, Q1, Q3, IQR, min, max, sample SD, optional mean; no p-values; V3B − V3 relative change | PASS |
| Protocol §§5 and 11 | V1 blocking, V2 suspense baseline, V3 late prefetch, V3B early prefetch; milestones A shell, B summary, C chart, D transactions, E budgets, F all resolved | PASS |
| Protocol §13.2 | Latin square S1–S4 as specified | PASS |
| Protocol §14.1 | Nested sample directories | WARNING: artifacts are flat files |
| Results template | n=10 / n=3, INP N/A, TTI informational, same milestone and Latin-square definitions; workbook still blank | PASS |
| Checklist | Total 184; no React Profiler row | PASS on counts. WARNING: sample path examples are still nested directories |
| Tracker | 184 required, 184 collected, 184 RECORDED, no PENDING, no React Profiler | PASS after the 208 correction |
| README | Points at the final tree and keeps the pilot on the other branch | WARNING: still describes nested sample directories and says the tracker is initially PENDING |
| `experiments.md` | Counts, Latin square, and variant definitions match. Status lines updated | WARNING: exploratory conclusion prose remains in that file and is labeled exploratory |
| `architecture.md` | No sample-count, Profiler, or Session R claims | PASS |
| `experiment-001-results-audit.md` | Dated 2026-09-28 pilot audit. It says the measurement tree was absent and formal measurements had not started | WARNING: historical. Not edited, so it is not a description of this tree |
| Session log | S2–S10 orders match timestamps. React Profiler line was already removed | PASS |

Searched the docs for `208`, `React Profiler`, `Session R`, and `profiling-build` after the edits. The only remaining “not started” wording is the 2026-09-28 pilot audit quoting the status it saw then. No document still claims 208 samples. No React Profiler procedure remains in the inspected final-campaign docs.

## 14. Raw-data integrity

Status: **PASS**.

This audit opened raw files for reading only. No raw measurement file was written, renamed, or deleted.

SHA-256 was computed for 336 artifact files (184 raw samples, 80 HTML reports, 72 notes). No two raw JSON or HAR files share a hash. Combined fingerprint of the sorted `path digest` lines:

`bf5b2e5dc0c32b925b83e284d6f73a649c6a4bf0cce255b8201f10c03a75a2ab`

Pilot files were not found in this tree. Index 01 is part of the final tracker, not a file copied from the pilot branch’s flat `lighthouse/*.json` layout. Nothing in this audit replaced a measured value with an estimate.

## 15. Final audit status

| Section | Status |
| ------- | ------ |
| 1. Scope | PASS |
| 2. Inventory | PASS |
| 3. Sample counts | PASS |
| 4. Filenames and structure | WARNING |
| 5. Lighthouse | WARNING |
| 6. Network | WARNING |
| 7. Performance | WARNING |
| 8. Configuration | WARNING; Desktop Lighthouse S1 screen block FAIL |
| 9. Latin square / session | PASS |
| 10. Statistics | PASS, with milestone n=9 |
| 11. V3B vs V3 | PASS |
| 12. Anomalies | WARNING |
| 13. Documentation | WARNING |
| 14. Raw-data integrity | PASS |
| **Dataset** | **WARNING** |

The dataset is usable for thesis descriptive statistics if the warnings stay attached to the analysis:

- Keep n=10 for Lighthouse and for Network HAR metrics, including index 01.
- Report Network milestone medians as n=9 unless the eight missing notes are recovered from original records. Do not fill them from other tools.
- State the Desktop Lighthouse S1 screen-emulation mismatch before using those four scores as desktop viewport evidence.
- State that index 01 is a different day, port, and, for Lighthouse, host.
- Do not rank the variants from this audit.

