# Experiment 001 — final measurement artifacts

This directory is the **final thesis measurement** tree defined by [`../../experiment-001-measurement-protocol.md`](../../experiment-001-measurement-protocol.md) Section 14.1.

It does not contain a pilot / preliminary measurement.

## Campaign documents

- [final-measurement-checklist.md](./final-measurement-checklist.md) — manual procedure
- [final-measurement-tracker.md](./final-measurement-tracker.md) — one row per required sample; all 184 rows are `RECORDED`
- [performance-capture-method-audit.md](./performance-capture-method-audit.md) — S1 DevTools versus S2–S3 CDP capture difference
- [../../experiment-001-results-template.md](../../experiment-001-results-template.md) — blank workbook for values after samples exist

## Pilot / preliminary measurement

The earlier automated n=3 Lighthouse and Network campaign is **not** stored here.

| Field                 | Value                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| Branch                | `origin/cursor/experiment-001-optimization-results-c674`                         |
| Commit                | `0e1accdf8392547b63420e2e40c37e2a3fee102f`                                       |
| Layout on that commit | Flat `docs/measurements/experiment-001/lighthouse/*.json` and `network/*.json`   |
| Audit                 | [`../../experiment-001-results-audit.md`](../../experiment-001-results-audit.md) |

Do not merge, cherry-pick, or copy those files into `profile-m/` or `profile-d/`.

## Sample files

The campaign is complete. Each valid sample is a flat file in the tool directory. The sample ID is the filename stem:

```text
profile-m|profile-d/variant-v1|v2|v3|v3b/<tool>/<SAMPLE-ID>.<ext>
```

| Tool           | Files                                      |
| -------------- | ------------------------------------------ |
| `lighthouse/`  | `<sample-id>.json`, `<sample-id>.html`     |
| `network/`     | `<sample-id>.har`, `<sample-id>.notes.md`  |
| `performance/` | `<sample-id>.json`                         |
