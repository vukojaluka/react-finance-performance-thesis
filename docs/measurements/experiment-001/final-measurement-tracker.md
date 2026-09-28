# Experiment 001 — Final Measurement Tracker

Live status board for the **final thesis measurement** campaign.

No sample has been collected. Every row starts at `PENDING`.

This tracker does not contain pilot / preliminary measurement values. That n=3 set stays on `origin/cursor/experiment-001-optimization-results-c674` (`0e1accdf8392547b63420e2e40c37e2a3fee102f`).

Procedure: [final-measurement-checklist.md](./final-measurement-checklist.md).

## How to update a row

1. Leave the row `PENDING` until a navigation passes the validation checklist.
2. Save the artifact only into the path in that row.
3. Set **Status** to `RECORDED` and **Valid/Invalid** to `Valid`.
4. Leave **Exclusion reason** as `—` for a valid sample.
5. A valid row is never replaced and its files are never overwritten.
6. A failed attempt does not occupy the row. Log it in the checklist exclusion log, keep this row `PENDING`, and repeat the navigation for the same sample ID.
7. Do not enter metric values here. Enter those in `docs/experiment-001-results-template.md` after the artifact exists.

## Required counts

| Profile | Variant | Tool           | Required valid samples |
| ------- | ------- | -------------- | ---------------------: |
| Mobile  | V1      | Lighthouse     |                     10 |
| Mobile  | V1      | Network        |                     10 |
| Mobile  | V1      | Performance    |                      3 |
| Mobile  | V1      | React Profiler |                      3 |
| Mobile  | V2      | Lighthouse     |                     10 |
| Mobile  | V2      | Network        |                     10 |
| Mobile  | V2      | Performance    |                      3 |
| Mobile  | V2      | React Profiler |                      3 |
| Mobile  | V3      | Lighthouse     |                     10 |
| Mobile  | V3      | Network        |                     10 |
| Mobile  | V3      | Performance    |                      3 |
| Mobile  | V3      | React Profiler |                      3 |
| Mobile  | V3B     | Lighthouse     |                     10 |
| Mobile  | V3B     | Network        |                     10 |
| Mobile  | V3B     | Performance    |                      3 |
| Mobile  | V3B     | React Profiler |                      3 |
| Desktop | V1      | Lighthouse     |                     10 |
| Desktop | V1      | Network        |                     10 |
| Desktop | V1      | Performance    |                      3 |
| Desktop | V1      | React Profiler |                      3 |
| Desktop | V2      | Lighthouse     |                     10 |
| Desktop | V2      | Network        |                     10 |
| Desktop | V2      | Performance    |                      3 |
| Desktop | V2      | React Profiler |                      3 |
| Desktop | V3      | Lighthouse     |                     10 |
| Desktop | V3      | Network        |                     10 |
| Desktop | V3      | Performance    |                      3 |
| Desktop | V3      | React Profiler |                      3 |
| Desktop | V3B     | Lighthouse     |                     10 |
| Desktop | V3B     | Network        |                     10 |
| Desktop | V3B     | Performance    |                      3 |
| Desktop | V3B     | React Profiler |                      3 |

| Set                              |   Count |
| -------------------------------- | ------: |
| Lighthouse                       |      80 |
| Network                          |      80 |
| Performance                      |      24 |
| React Profiler                   |      24 |
| **Total required valid samples** | **208** |
| Collected in this tree           |       0 |

Artifact path is the sample directory. Create it when the sample is valid.

## Profile M — Mobile

### Mobile V1 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| M-LH-V1-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-01/` | —             | —                | —     |
| M-LH-V1-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-02/` | —             | —                | —     |
| M-LH-V1-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-03/` | —             | —                | —     |
| M-LH-V1-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-04/` | —             | —                | —     |
| M-LH-V1-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-05/` | —             | —                | —     |
| M-LH-V1-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-06/` | —             | —                | —     |
| M-LH-V1-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-07/` | —             | —                | —     |
| M-LH-V1-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-08/` | —             | —                | —     |
| M-LH-V1-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-09/` | —             | —                | —     |
| M-LH-V1-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-10/` | —             | —                | —     |

### Mobile V1 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-NW-V1-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-01/` | —             | —                | —     |
| M-NW-V1-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-02/` | —             | —                | —     |
| M-NW-V1-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-03/` | —             | —                | —     |
| M-NW-V1-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-04/` | —             | —                | —     |
| M-NW-V1-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-05/` | —             | —                | —     |
| M-NW-V1-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-06/` | —             | —                | —     |
| M-NW-V1-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-07/` | —             | —                | —     |
| M-NW-V1-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-08/` | —             | —                | —     |
| M-NW-V1-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-09/` | —             | —                | —     |
| M-NW-V1-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-10/` | —             | —                | —     |

### Mobile V1 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-PF-V1-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-01/` | —             | —                | —     |
| M-PF-V1-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-02/` | —             | —                | —     |
| M-PF-V1-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-03/` | —             | —                | —     |

### Mobile V1 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-RP-V1-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/profiler/M-RP-V1-01/` | —             | —                | —     |
| M-RP-V1-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/profiler/M-RP-V1-02/` | —             | —                | —     |
| M-RP-V1-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v1/profiler/M-RP-V1-03/` | —             | —                | —     |

### Mobile V2 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| M-LH-V2-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-01/` | —             | —                | —     |
| M-LH-V2-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-02/` | —             | —                | —     |
| M-LH-V2-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-03/` | —             | —                | —     |
| M-LH-V2-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-04/` | —             | —                | —     |
| M-LH-V2-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-05/` | —             | —                | —     |
| M-LH-V2-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-06/` | —             | —                | —     |
| M-LH-V2-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-07/` | —             | —                | —     |
| M-LH-V2-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-08/` | —             | —                | —     |
| M-LH-V2-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-09/` | —             | —                | —     |
| M-LH-V2-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-10/` | —             | —                | —     |

### Mobile V2 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-NW-V2-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-01/` | —             | —                | —     |
| M-NW-V2-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-02/` | —             | —                | —     |
| M-NW-V2-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-03/` | —             | —                | —     |
| M-NW-V2-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-04/` | —             | —                | —     |
| M-NW-V2-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-05/` | —             | —                | —     |
| M-NW-V2-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-06/` | —             | —                | —     |
| M-NW-V2-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-07/` | —             | —                | —     |
| M-NW-V2-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-08/` | —             | —                | —     |
| M-NW-V2-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-09/` | —             | —                | —     |
| M-NW-V2-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-10/` | —             | —                | —     |

### Mobile V2 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-PF-V2-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-01/` | —             | —                | —     |
| M-PF-V2-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-02/` | —             | —                | —     |
| M-PF-V2-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-03/` | —             | —                | —     |

### Mobile V2 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-RP-V2-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/profiler/M-RP-V2-01/` | —             | —                | —     |
| M-RP-V2-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/profiler/M-RP-V2-02/` | —             | —                | —     |
| M-RP-V2-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v2/profiler/M-RP-V2-03/` | —             | —                | —     |

### Mobile V3 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| M-LH-V3-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-01/` | —             | —                | —     |
| M-LH-V3-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-02/` | —             | —                | —     |
| M-LH-V3-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-03/` | —             | —                | —     |
| M-LH-V3-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-04/` | —             | —                | —     |
| M-LH-V3-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-05/` | —             | —                | —     |
| M-LH-V3-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-06/` | —             | —                | —     |
| M-LH-V3-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-07/` | —             | —                | —     |
| M-LH-V3-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-08/` | —             | —                | —     |
| M-LH-V3-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-09/` | —             | —                | —     |
| M-LH-V3-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-10/` | —             | —                | —     |

### Mobile V3 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-NW-V3-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-01/` | —             | —                | —     |
| M-NW-V3-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-02/` | —             | —                | —     |
| M-NW-V3-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-03/` | —             | —                | —     |
| M-NW-V3-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-04/` | —             | —                | —     |
| M-NW-V3-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-05/` | —             | —                | —     |
| M-NW-V3-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-06/` | —             | —                | —     |
| M-NW-V3-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-07/` | —             | —                | —     |
| M-NW-V3-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-08/` | —             | —                | —     |
| M-NW-V3-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-09/` | —             | —                | —     |
| M-NW-V3-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-10/` | —             | —                | —     |

### Mobile V3 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-PF-V3-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-01/` | —             | —                | —     |
| M-PF-V3-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-02/` | —             | —                | —     |
| M-PF-V3-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-03/` | —             | —                | —     |

### Mobile V3 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-RP-V3-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/profiler/M-RP-V3-01/` | —             | —                | —     |
| M-RP-V3-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/profiler/M-RP-V3-02/` | —             | —                | —     |
| M-RP-V3-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3/profiler/M-RP-V3-03/` | —             | —                | —     |

### Mobile V3B — Lighthouse

| Sample ID   | Status  | Artifact path                                                                    | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | -------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-LH-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-01/` | —             | —                | —     |
| M-LH-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-02/` | —             | —                | —     |
| M-LH-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-03/` | —             | —                | —     |
| M-LH-V3B-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-04/` | —             | —                | —     |
| M-LH-V3B-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-05/` | —             | —                | —     |
| M-LH-V3B-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-06/` | —             | —                | —     |
| M-LH-V3B-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-07/` | —             | —                | —     |
| M-LH-V3B-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-08/` | —             | —                | —     |
| M-LH-V3B-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-09/` | —             | —                | —     |
| M-LH-V3B-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-10/` | —             | —                | —     |

### Mobile V3B — Network

| Sample ID   | Status  | Artifact path                                                                 | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | ----------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-NW-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-01/` | —             | —                | —     |
| M-NW-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-02/` | —             | —                | —     |
| M-NW-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-03/` | —             | —                | —     |
| M-NW-V3B-04 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-04/` | —             | —                | —     |
| M-NW-V3B-05 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-05/` | —             | —                | —     |
| M-NW-V3B-06 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-06/` | —             | —                | —     |
| M-NW-V3B-07 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-07/` | —             | —                | —     |
| M-NW-V3B-08 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-08/` | —             | —                | —     |
| M-NW-V3B-09 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-09/` | —             | —                | —     |
| M-NW-V3B-10 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-10/` | —             | —                | —     |

### Mobile V3B — Performance

| Sample ID   | Status  | Artifact path                                                                     | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | --------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| M-PF-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-01/` | —             | —                | —     |
| M-PF-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-02/` | —             | —                | —     |
| M-PF-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-03/` | —             | —                | —     |

### Mobile V3B — React Profiler

| Sample ID   | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| M-RP-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/profiler/M-RP-V3B-01/` | —             | —                | —     |
| M-RP-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/profiler/M-RP-V3B-02/` | —             | —                | —     |
| M-RP-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-m/variant-v3b/profiler/M-RP-V3B-03/` | —             | —                | —     |

## Profile D — Desktop

### Desktop V1 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| D-LH-V1-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-01/` | —             | —                | —     |
| D-LH-V1-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-02/` | —             | —                | —     |
| D-LH-V1-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-03/` | —             | —                | —     |
| D-LH-V1-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-04/` | —             | —                | —     |
| D-LH-V1-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-05/` | —             | —                | —     |
| D-LH-V1-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-06/` | —             | —                | —     |
| D-LH-V1-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-07/` | —             | —                | —     |
| D-LH-V1-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-08/` | —             | —                | —     |
| D-LH-V1-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-09/` | —             | —                | —     |
| D-LH-V1-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-10/` | —             | —                | —     |

### Desktop V1 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-NW-V1-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-01/` | —             | —                | —     |
| D-NW-V1-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-02/` | —             | —                | —     |
| D-NW-V1-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-03/` | —             | —                | —     |
| D-NW-V1-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-04/` | —             | —                | —     |
| D-NW-V1-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-05/` | —             | —                | —     |
| D-NW-V1-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-06/` | —             | —                | —     |
| D-NW-V1-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-07/` | —             | —                | —     |
| D-NW-V1-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-08/` | —             | —                | —     |
| D-NW-V1-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-09/` | —             | —                | —     |
| D-NW-V1-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-10/` | —             | —                | —     |

### Desktop V1 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-PF-V1-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-01/` | —             | —                | —     |
| D-PF-V1-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-02/` | —             | —                | —     |
| D-PF-V1-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-03/` | —             | —                | —     |

### Desktop V1 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-RP-V1-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/profiler/D-RP-V1-01/` | —             | —                | —     |
| D-RP-V1-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/profiler/D-RP-V1-02/` | —             | —                | —     |
| D-RP-V1-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v1/profiler/D-RP-V1-03/` | —             | —                | —     |

### Desktop V2 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| D-LH-V2-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-01/` | —             | —                | —     |
| D-LH-V2-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-02/` | —             | —                | —     |
| D-LH-V2-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-03/` | —             | —                | —     |
| D-LH-V2-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-04/` | —             | —                | —     |
| D-LH-V2-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-05/` | —             | —                | —     |
| D-LH-V2-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-06/` | —             | —                | —     |
| D-LH-V2-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-07/` | —             | —                | —     |
| D-LH-V2-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-08/` | —             | —                | —     |
| D-LH-V2-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-09/` | —             | —                | —     |
| D-LH-V2-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-10/` | —             | —                | —     |

### Desktop V2 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-NW-V2-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-01/` | —             | —                | —     |
| D-NW-V2-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-02/` | —             | —                | —     |
| D-NW-V2-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-03/` | —             | —                | —     |
| D-NW-V2-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-04/` | —             | —                | —     |
| D-NW-V2-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-05/` | —             | —                | —     |
| D-NW-V2-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-06/` | —             | —                | —     |
| D-NW-V2-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-07/` | —             | —                | —     |
| D-NW-V2-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-08/` | —             | —                | —     |
| D-NW-V2-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-09/` | —             | —                | —     |
| D-NW-V2-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-10/` | —             | —                | —     |

### Desktop V2 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-PF-V2-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-01/` | —             | —                | —     |
| D-PF-V2-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-02/` | —             | —                | —     |
| D-PF-V2-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-03/` | —             | —                | —     |

### Desktop V2 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-RP-V2-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/profiler/D-RP-V2-01/` | —             | —                | —     |
| D-RP-V2-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/profiler/D-RP-V2-02/` | —             | —                | —     |
| D-RP-V2-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v2/profiler/D-RP-V2-03/` | —             | —                | —     |

### Desktop V3 — Lighthouse

| Sample ID  | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| D-LH-V3-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-01/` | —             | —                | —     |
| D-LH-V3-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-02/` | —             | —                | —     |
| D-LH-V3-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-03/` | —             | —                | —     |
| D-LH-V3-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-04/` | —             | —                | —     |
| D-LH-V3-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-05/` | —             | —                | —     |
| D-LH-V3-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-06/` | —             | —                | —     |
| D-LH-V3-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-07/` | —             | —                | —     |
| D-LH-V3-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-08/` | —             | —                | —     |
| D-LH-V3-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-09/` | —             | —                | —     |
| D-LH-V3-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-10/` | —             | —                | —     |

### Desktop V3 — Network

| Sample ID  | Status  | Artifact path                                                               | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | --------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-NW-V3-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-01/` | —             | —                | —     |
| D-NW-V3-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-02/` | —             | —                | —     |
| D-NW-V3-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-03/` | —             | —                | —     |
| D-NW-V3-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-04/` | —             | —                | —     |
| D-NW-V3-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-05/` | —             | —                | —     |
| D-NW-V3-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-06/` | —             | —                | —     |
| D-NW-V3-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-07/` | —             | —                | —     |
| D-NW-V3-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-08/` | —             | —                | —     |
| D-NW-V3-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-09/` | —             | —                | —     |
| D-NW-V3-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-10/` | —             | —                | —     |

### Desktop V3 — Performance

| Sample ID  | Status  | Artifact path                                                                   | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-PF-V3-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-01/` | —             | —                | —     |
| D-PF-V3-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-02/` | —             | —                | —     |
| D-PF-V3-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-03/` | —             | —                | —     |

### Desktop V3 — React Profiler

| Sample ID  | Status  | Artifact path                                                                | Valid/Invalid | Exclusion reason | Notes |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-RP-V3-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/profiler/D-RP-V3-01/` | —             | —                | —     |
| D-RP-V3-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/profiler/D-RP-V3-02/` | —             | —                | —     |
| D-RP-V3-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3/profiler/D-RP-V3-03/` | —             | —                | —     |

### Desktop V3B — Lighthouse

| Sample ID   | Status  | Artifact path                                                                    | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | -------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-LH-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-01/` | —             | —                | —     |
| D-LH-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-02/` | —             | —                | —     |
| D-LH-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-03/` | —             | —                | —     |
| D-LH-V3B-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-04/` | —             | —                | —     |
| D-LH-V3B-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-05/` | —             | —                | —     |
| D-LH-V3B-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-06/` | —             | —                | —     |
| D-LH-V3B-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-07/` | —             | —                | —     |
| D-LH-V3B-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-08/` | —             | —                | —     |
| D-LH-V3B-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-09/` | —             | —                | —     |
| D-LH-V3B-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-10/` | —             | —                | —     |

### Desktop V3B — Network

| Sample ID   | Status  | Artifact path                                                                 | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | ----------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-NW-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-01/` | —             | —                | —     |
| D-NW-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-02/` | —             | —                | —     |
| D-NW-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-03/` | —             | —                | —     |
| D-NW-V3B-04 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-04/` | —             | —                | —     |
| D-NW-V3B-05 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-05/` | —             | —                | —     |
| D-NW-V3B-06 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-06/` | —             | —                | —     |
| D-NW-V3B-07 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-07/` | —             | —                | —     |
| D-NW-V3B-08 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-08/` | —             | —                | —     |
| D-NW-V3B-09 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-09/` | —             | —                | —     |
| D-NW-V3B-10 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-10/` | —             | —                | —     |

### Desktop V3B — Performance

| Sample ID   | Status  | Artifact path                                                                     | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | --------------------------------------------------------------------------------- | ------------- | ---------------- | ----- |
| D-PF-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-01/` | —             | —                | —     |
| D-PF-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-02/` | —             | —                | —     |
| D-PF-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-03/` | —             | —                | —     |

### Desktop V3B — React Profiler

| Sample ID   | Status  | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes |
| ----------- | ------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----- |
| D-RP-V3B-01 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/profiler/D-RP-V3B-01/` | —             | —                | —     |
| D-RP-V3B-02 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/profiler/D-RP-V3B-02/` | —             | —                | —     |
| D-RP-V3B-03 | PENDING | `docs/measurements/experiment-001/profile-d/variant-v3b/profiler/D-RP-V3B-03/` | —             | —                | —     |
