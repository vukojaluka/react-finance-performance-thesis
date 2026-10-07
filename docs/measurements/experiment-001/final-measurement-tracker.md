# Experiment 001 — Final Measurement Tracker

Status board for the completed **final thesis measurement** campaign. All 184 rows are `RECORDED` and `Valid`. No row is `PENDING`.

Lighthouse, Network, and Performance rows are `RECORDED` / `Valid` where the artifact file exists.

This tracker does not contain pilot / preliminary measurement values. That n=3 set stays on `origin/cursor/experiment-001-optimization-results-c674` (`0e1accdf8392547b63420e2e40c37e2a3fee102f`).

Procedure: [final-measurement-checklist.md](./final-measurement-checklist.md).

## How a row was updated

These rules governed collection. They are not an open work list. Every row is now `RECORDED`.

1. A row stayed `PENDING` until a navigation passed the validation checklist.
2. The artifact was saved only into the path in that row.
3. **Status** was set to `RECORDED` and **Valid/Invalid** to `Valid`.
4. **Exclusion reason** stayed `—` for a valid sample.
5. A valid row is never replaced and its files are never overwritten.
6. A failed attempt did not occupy the row. It was logged in the checklist exclusion log, the row stayed `PENDING`, and the navigation was repeated for the same sample ID.
7. Do not enter metric values here. Enter those in `docs/experiment-001-results-template.md` after the artifact exists.

## Required counts

| Profile | Variant | Tool        | Required valid samples |
| ------- | ------- | ----------- | ---------------------: |
| Mobile  | V1      | Lighthouse  |                     10 |
| Mobile  | V1      | Network     |                     10 |
| Mobile  | V1      | Performance |                      3 |
| Mobile  | V2      | Lighthouse  |                     10 |
| Mobile  | V2      | Network     |                     10 |
| Mobile  | V2      | Performance |                      3 |
| Mobile  | V3      | Lighthouse  |                     10 |
| Mobile  | V3      | Network     |                     10 |
| Mobile  | V3      | Performance |                      3 |
| Mobile  | V3B     | Lighthouse  |                     10 |
| Mobile  | V3B     | Network     |                     10 |
| Mobile  | V3B     | Performance |                      3 |
| Desktop | V1      | Lighthouse  |                     10 |
| Desktop | V1      | Network     |                     10 |
| Desktop | V1      | Performance |                      3 |
| Desktop | V2      | Lighthouse  |                     10 |
| Desktop | V2      | Network     |                     10 |
| Desktop | V2      | Performance |                      3 |
| Desktop | V3      | Lighthouse  |                     10 |
| Desktop | V3      | Network     |                     10 |
| Desktop | V3      | Performance |                      3 |
| Desktop | V3B     | Lighthouse  |                     10 |
| Desktop | V3B     | Network     |                     10 |
| Desktop | V3B     | Performance |                      3 |

| Set                              |   Count |
| -------------------------------- | ------: |
| Lighthouse                       |      80 |
| Network                          |      80 |
| Performance                      |      24 |
| **Total required valid samples** | **184** |
| Collected in this tree           |     184 |

Artifact path is the saved measurement file. Lighthouse HTML sits beside the JSON. Network User Timing notes sit beside the HAR as `<sample-id>.notes.md`.

## Profile M — Mobile

### Mobile V1 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                      | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-LH-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-01.json` | Valid         | —                | pre-existing first pass |
| M-LH-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-02.json` | Valid         | —                | —                       |
| M-LH-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-03.json` | Valid         | —                | —                       |
| M-LH-V1-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-04.json` | Valid         | —                | —                       |
| M-LH-V1-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-05.json` | Valid         | —                | —                       |
| M-LH-V1-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-06.json` | Valid         | —                | —                       |
| M-LH-V1-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-07.json` | Valid         | —                | —                       |
| M-LH-V1-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-08.json` | Valid         | —                | —                       |
| M-LH-V1-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-09.json` | Valid         | —                | —                       |
| M-LH-V1-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-10.json` | Valid         | —                | —                       |

### Mobile V1 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| M-NW-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-01.har` | Valid         | —                | pre-existing first pass |
| M-NW-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-02.har` | Valid         | —                | —                       |
| M-NW-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-03.har` | Valid         | —                | —                       |
| M-NW-V1-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-04.har` | Valid         | —                | —                       |
| M-NW-V1-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-05.har` | Valid         | —                | —                       |
| M-NW-V1-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-06.har` | Valid         | —                | —                       |
| M-NW-V1-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-07.har` | Valid         | —                | —                       |
| M-NW-V1-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-08.har` | Valid         | —                | —                       |
| M-NW-V1-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-09.har` | Valid         | —                | —                       |
| M-NW-V1-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/network/M-NW-V1-10.har` | Valid         | —                | —                       |

### Mobile V1 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-PF-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-01.json` | Valid         | —                | pre-existing first pass |
| M-PF-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-02.json` | Valid         | —                | —                       |
| M-PF-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v1/performance/M-PF-V1-03.json` | Valid         | —                | —                       |

### Mobile V2 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                      | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-LH-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-01.json` | Valid         | —                | pre-existing first pass |
| M-LH-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-02.json` | Valid         | —                | —                       |
| M-LH-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-03.json` | Valid         | —                | —                       |
| M-LH-V2-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-04.json` | Valid         | —                | —                       |
| M-LH-V2-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-05.json` | Valid         | —                | —                       |
| M-LH-V2-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-06.json` | Valid         | —                | —                       |
| M-LH-V2-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-07.json` | Valid         | —                | —                       |
| M-LH-V2-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-08.json` | Valid         | —                | —                       |
| M-LH-V2-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-09.json` | Valid         | —                | —                       |
| M-LH-V2-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/lighthouse/M-LH-V2-10.json` | Valid         | —                | —                       |

### Mobile V2 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| M-NW-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-01.har` | Valid         | —                | pre-existing first pass |
| M-NW-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-02.har` | Valid         | —                | —                       |
| M-NW-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-03.har` | Valid         | —                | —                       |
| M-NW-V2-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-04.har` | Valid         | —                | —                       |
| M-NW-V2-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-05.har` | Valid         | —                | —                       |
| M-NW-V2-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-06.har` | Valid         | —                | —                       |
| M-NW-V2-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-07.har` | Valid         | —                | —                       |
| M-NW-V2-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-08.har` | Valid         | —                | —                       |
| M-NW-V2-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-09.har` | Valid         | —                | —                       |
| M-NW-V2-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/network/M-NW-V2-10.har` | Valid         | —                | —                       |

### Mobile V2 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-PF-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-01.json` | Valid         | —                | pre-existing first pass |
| M-PF-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-02.json` | Valid         | —                | —                       |
| M-PF-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v2/performance/M-PF-V2-03.json` | Valid         | —                | —                       |

### Mobile V3 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                      | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-LH-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-01.json` | Valid         | —                | pre-existing first pass |
| M-LH-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-02.json` | Valid         | —                | —                       |
| M-LH-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-03.json` | Valid         | —                | —                       |
| M-LH-V3-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-04.json` | Valid         | —                | —                       |
| M-LH-V3-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-05.json` | Valid         | —                | —                       |
| M-LH-V3-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-06.json` | Valid         | —                | —                       |
| M-LH-V3-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-07.json` | Valid         | —                | —                       |
| M-LH-V3-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-08.json` | Valid         | —                | —                       |
| M-LH-V3-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-09.json` | Valid         | —                | —                       |
| M-LH-V3-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/lighthouse/M-LH-V3-10.json` | Valid         | —                | —                       |

### Mobile V3 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| M-NW-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-01.har` | Valid         | —                | pre-existing first pass |
| M-NW-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-02.har` | Valid         | —                | —                       |
| M-NW-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-03.har` | Valid         | —                | —                       |
| M-NW-V3-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-04.har` | Valid         | —                | —                       |
| M-NW-V3-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-05.har` | Valid         | —                | —                       |
| M-NW-V3-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-06.har` | Valid         | —                | —                       |
| M-NW-V3-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-07.har` | Valid         | —                | —                       |
| M-NW-V3-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-08.har` | Valid         | —                | —                       |
| M-NW-V3-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-09.har` | Valid         | —                | —                       |
| M-NW-V3-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/network/M-NW-V3-10.har` | Valid         | —                | —                       |

### Mobile V3 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-PF-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-01.json` | Valid         | —                | pre-existing first pass |
| M-PF-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-02.json` | Valid         | —                | —                       |
| M-PF-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3/performance/M-PF-V3-03.json` | Valid         | —                | —                       |

### Mobile V3B — Lighthouse

| Sample ID   | Status   | Artifact path                                                                        | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | ------------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| M-LH-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-01.json` | Valid         | —                | pre-existing first pass |
| M-LH-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-02.json` | Valid         | —                | —                       |
| M-LH-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-03.json` | Valid         | —                | —                       |
| M-LH-V3B-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-04.json` | Valid         | —                | —                       |
| M-LH-V3B-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-05.json` | Valid         | —                | —                       |
| M-LH-V3B-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-06.json` | Valid         | —                | —                       |
| M-LH-V3B-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-07.json` | Valid         | —                | —                       |
| M-LH-V3B-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-08.json` | Valid         | —                | —                       |
| M-LH-V3B-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-09.json` | Valid         | —                | —                       |
| M-LH-V3B-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/lighthouse/M-LH-V3B-10.json` | Valid         | —                | —                       |

### Mobile V3B — Network

| Sample ID   | Status   | Artifact path                                                                    | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | -------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-NW-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-01.har` | Valid         | —                | pre-existing first pass |
| M-NW-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-02.har` | Valid         | —                | —                       |
| M-NW-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-03.har` | Valid         | —                | —                       |
| M-NW-V3B-04 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-04.har` | Valid         | —                | —                       |
| M-NW-V3B-05 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-05.har` | Valid         | —                | —                       |
| M-NW-V3B-06 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-06.har` | Valid         | —                | —                       |
| M-NW-V3B-07 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-07.har` | Valid         | —                | —                       |
| M-NW-V3B-08 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-08.har` | Valid         | —                | —                       |
| M-NW-V3B-09 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-09.har` | Valid         | —                | —                       |
| M-NW-V3B-10 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-10.har` | Valid         | —                | —                       |

### Mobile V3B — Performance

| Sample ID   | Status   | Artifact path                                                                         | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | ------------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| M-PF-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-01.json` | Valid         | —                | pre-existing first pass |
| M-PF-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-02.json` | Valid         | —                | —                       |
| M-PF-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-m/variant-v3b/performance/M-PF-V3B-03.json` | Valid         | —                | —                       |

## Profile D — Desktop

### Desktop V1 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-LH-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-01 .json` | Valid         | —                | pre-existing first pass |
| D-LH-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-02.json`  | Valid         | —                | —                       |
| D-LH-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-03.json`  | Valid         | —                | —                       |
| D-LH-V1-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-04.json`  | Valid         | —                | —                       |
| D-LH-V1-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-05.json`  | Valid         | —                | —                       |
| D-LH-V1-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-06.json`  | Valid         | —                | —                       |
| D-LH-V1-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-07.json`  | Valid         | —                | —                       |
| D-LH-V1-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-08.json`  | Valid         | —                | —                       |
| D-LH-V1-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-09.json`  | Valid         | —                | —                       |
| D-LH-V1-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/lighthouse/D-LH-V1-10.json`  | Valid         | —                | —                       |

### Desktop V1 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| D-NW-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-01.har` | Valid         | —                | pre-existing first pass |
| D-NW-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-02.har` | Valid         | —                | —                       |
| D-NW-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-03.har` | Valid         | —                | —                       |
| D-NW-V1-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-04.har` | Valid         | —                | —                       |
| D-NW-V1-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-05.har` | Valid         | —                | —                       |
| D-NW-V1-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-06.har` | Valid         | —                | —                       |
| D-NW-V1-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-07.har` | Valid         | —                | —                       |
| D-NW-V1-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-08.har` | Valid         | —                | —                       |
| D-NW-V1-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-09.har` | Valid         | —                | —                       |
| D-NW-V1-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/network/D-NW-V1-10.har` | Valid         | —                | —                       |

### Desktop V1 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-PF-V1-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-01.json` | Valid         | —                | pre-existing first pass |
| D-PF-V1-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-02.json` | Valid         | —                | —                       |
| D-PF-V1-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v1/performance/D-PF-V1-03.json` | Valid         | —                | —                       |

### Desktop V2 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                      | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-LH-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-01.json` | Valid         | —                | pre-existing first pass |
| D-LH-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-02.json` | Valid         | —                | —                       |
| D-LH-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-03.json` | Valid         | —                | —                       |
| D-LH-V2-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-04.json` | Valid         | —                | —                       |
| D-LH-V2-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-05.json` | Valid         | —                | —                       |
| D-LH-V2-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-06.json` | Valid         | —                | —                       |
| D-LH-V2-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-07.json` | Valid         | —                | —                       |
| D-LH-V2-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-08.json` | Valid         | —                | —                       |
| D-LH-V2-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-09.json` | Valid         | —                | —                       |
| D-LH-V2-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/lighthouse/D-LH-V2-10.json` | Valid         | —                | —                       |

### Desktop V2 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| D-NW-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-01.har` | Valid         | —                | pre-existing first pass |
| D-NW-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-02.har` | Valid         | —                | —                       |
| D-NW-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-03.har` | Valid         | —                | —                       |
| D-NW-V2-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-04.har` | Valid         | —                | —                       |
| D-NW-V2-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-05.har` | Valid         | —                | —                       |
| D-NW-V2-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-06.har` | Valid         | —                | —                       |
| D-NW-V2-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-07.har` | Valid         | —                | —                       |
| D-NW-V2-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-08.har` | Valid         | —                | —                       |
| D-NW-V2-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-09.har` | Valid         | —                | —                       |
| D-NW-V2-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/network/D-NW-V2-10.har` | Valid         | —                | —                       |

### Desktop V2 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-PF-V2-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-01.json` | Valid         | —                | pre-existing first pass |
| D-PF-V2-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-02.json` | Valid         | —                | —                       |
| D-PF-V2-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-03.json` | Valid         | —                | —                       |

### Desktop V3 — Lighthouse

| Sample ID  | Status   | Artifact path                                                                      | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-LH-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-01.json` | Valid         | —                | pre-existing first pass |
| D-LH-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-02.json` | Valid         | —                | —                       |
| D-LH-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-03.json` | Valid         | —                | —                       |
| D-LH-V3-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-04.json` | Valid         | —                | —                       |
| D-LH-V3-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-05.json` | Valid         | —                | —                       |
| D-LH-V3-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-06.json` | Valid         | —                | —                       |
| D-LH-V3-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-07.json` | Valid         | —                | —                       |
| D-LH-V3-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-08.json` | Valid         | —                | —                       |
| D-LH-V3-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-09.json` | Valid         | —                | —                       |
| D-LH-V3-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/lighthouse/D-LH-V3-10.json` | Valid         | —                | —                       |

### Desktop V3 — Network

| Sample ID  | Status   | Artifact path                                                                  | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| D-NW-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-01.har` | Valid         | —                | pre-existing first pass |
| D-NW-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-02.har` | Valid         | —                | —                       |
| D-NW-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-03.har` | Valid         | —                | —                       |
| D-NW-V3-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-04.har` | Valid         | —                | —                       |
| D-NW-V3-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-05.har` | Valid         | —                | —                       |
| D-NW-V3-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-06.har` | Valid         | —                | —                       |
| D-NW-V3-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-07.har` | Valid         | —                | —                       |
| D-NW-V3-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-08.har` | Valid         | —                | —                       |
| D-NW-V3-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-09.har` | Valid         | —                | —                       |
| D-NW-V3-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/network/D-NW-V3-10.har` | Valid         | —                | —                       |

### Desktop V3 — Performance

| Sample ID  | Status   | Artifact path                                                                       | Valid/Invalid | Exclusion reason | Notes                   |
| ---------- | -------- | ----------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-PF-V3-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-01.json` | Valid         | —                | pre-existing first pass |
| D-PF-V3-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-02.json` | Valid         | —                | —                       |
| D-PF-V3-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3/performance/D-PF-V3-03.json` | Valid         | —                | —                       |

### Desktop V3B — Lighthouse

| Sample ID   | Status   | Artifact path                                                                        | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | ------------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------- |
| D-LH-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-01.json` | Valid         | —                | pre-existing first pass |
| D-LH-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-02.json` | Valid         | —                | —                       |
| D-LH-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-03.json` | Valid         | —                | —                       |
| D-LH-V3B-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-04.json` | Valid         | —                | —                       |
| D-LH-V3B-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-05.json` | Valid         | —                | —                       |
| D-LH-V3B-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-06.json` | Valid         | —                | —                       |
| D-LH-V3B-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-07.json` | Valid         | —                | —                       |
| D-LH-V3B-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-08.json` | Valid         | —                | —                       |
| D-LH-V3B-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-09.json` | Valid         | —                | —                       |
| D-LH-V3B-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/lighthouse/D-LH-V3B-10.json` | Valid         | —                | —                       |

### Desktop V3B — Network

| Sample ID   | Status   | Artifact path                                                                    | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | -------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-NW-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-01.har` | Valid         | —                | pre-existing first pass |
| D-NW-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-02.har` | Valid         | —                | —                       |
| D-NW-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-03.har` | Valid         | —                | —                       |
| D-NW-V3B-04 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-04.har` | Valid         | —                | —                       |
| D-NW-V3B-05 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-05.har` | Valid         | —                | —                       |
| D-NW-V3B-06 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-06.har` | Valid         | —                | —                       |
| D-NW-V3B-07 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-07.har` | Valid         | —                | —                       |
| D-NW-V3B-08 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-08.har` | Valid         | —                | —                       |
| D-NW-V3B-09 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-09.har` | Valid         | —                | —                       |
| D-NW-V3B-10 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/network/D-NW-V3B-10.har` | Valid         | —                | —                       |

### Desktop V3B — Performance

| Sample ID   | Status   | Artifact path                                                                         | Valid/Invalid | Exclusion reason | Notes                   |
| ----------- | -------- | ------------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| D-PF-V3B-01 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-01.json` | Valid         | —                | pre-existing first pass |
| D-PF-V3B-02 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-02.json` | Valid         | —                | —                       |
| D-PF-V3B-03 | RECORDED | `docs/measurements/experiment-001/profile-d/variant-v3b/performance/D-PF-V3B-03.json` | Valid         | —                | —                       |
