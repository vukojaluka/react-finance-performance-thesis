# Experiment 001 — Final Measurement Checklist

Manual procedure for the **final thesis measurement**.

Do not execute this checklist during preparation. Do not copy a pilot / preliminary measurement into these steps, the tracker, or the results template.

Authority: [`../../experiment-001-measurement-protocol.md`](../../experiment-001-measurement-protocol.md). If this checklist and the protocol disagree, follow the protocol and record the disagreement before continuing.

Tracker: [final-measurement-tracker.md](./final-measurement-tracker.md).

Workbook: [`../../experiment-001-results-template.md`](../../experiment-001-results-template.md).

---

## Pilot / preliminary measurement

The earlier automated campaign is a **pilot / preliminary measurement**. It is not the final dataset.

| Field  | Value                                                                            |
| ------ | -------------------------------------------------------------------------------- |
| Branch | `origin/cursor/experiment-001-optimization-results-c674`                         |
| Commit | `0e1accdf8392547b63420e2e40c37e2a3fee102f`                                       |
| Parent | `643de696b06169326dfdaefe8e391ea965b5d9f4`                                       |
| Audit  | [`../../experiment-001-results-audit.md`](../../experiment-001-results-audit.md) |

On that commit only:

| Path                                                               | What it is                                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `docs/measurements/experiment-001/lighthouse/*.json`               | 24 Lighthouse JSON files, n=3, no HTML                                   |
| `docs/measurements/experiment-001/network/*.json`                  | 24 custom Network JSON files for M/D, plus 12 unthrottled `U-NW-*` files |
| `docs/measurements/experiment-001/raw/summary.json`                | Harness aggregate                                                        |
| `docs/measurements/experiment-001/raw/unthrottled-milestones.json` | Unthrottled aggregate                                                    |
| `docs/experiment-001-results.md`                                   | Narrative means from that pilot                                          |
| `scripts/measure-experiment-001.mjs`                               | Automated harness                                                        |
| `scripts/measure-milestones-unthrottled.mjs`                       | Extra unthrottled harness                                                |

Those files are not in the working tree of `test/performance-experiment-001`. Do not merge or cherry-pick that commit. Do not copy those JSON files into `profile-m/` or `profile-d/`.

Final Network evidence is a HAR file. The pilot custom JSON format is not final Network evidence.

---

## Required valid samples

| Tool        | Session | Build                   | Per variant per profile | Profiles × variants |   Total |
| ----------- | ------- | ----------------------- | ----------------------: | ------------------- | ------: |
| Lighthouse  | P       | `npm run build`         |                      10 | 2 × 4               |      80 |
| Network     | P       | same production preview |                      10 | 2 × 4               |      80 |
| Performance | P       | same production preview |                       3 | 2 × 4               |      24 |
| **Total**   |         |                         |                         |                     | **184** |

`M-LH-V1-01` and `M-NW-V1-01` are different page loads. Each tool has its own passes.

---

## Sample IDs and paths

Profile letter: `M` or `D`. Tool letter: `LH`, `NW`, `PF`. Variant: `V1`, `V2`, `V3`, `V3B`. Index: `01`–`10` or `01`–`03`.

```text
M-LH-V1-01 … M-LH-V1-10
M-NW-V1-01 … M-NW-V1-10
M-PF-V1-01 … M-PF-V1-03
```

Repeat that pattern for `V2`, `V3`, and `V3B`, then the same IDs with the `D-` prefix.

| Sample ID     | Directory                                                                       |
| ------------- | ------------------------------------------------------------------------------- |
| `M-LH-V1-01`  | `docs/measurements/experiment-001/profile-m/variant-v1/lighthouse/M-LH-V1-01/`  |
| `M-NW-V3B-10` | `docs/measurements/experiment-001/profile-m/variant-v3b/network/M-NW-V3B-10/`   |
| `D-PF-V2-03`  | `docs/measurements/experiment-001/profile-d/variant-v2/performance/D-PF-V2-03/` |

Folder names are lowercase (`profile-m`, `variant-v3b`). Sample IDs keep `V3B`.

| Tool        | Files inside the sample directory    |
| ----------- | ------------------------------------ |
| Lighthouse  | `lighthouse.json`, `lighthouse.html` |
| Network     | `network.har`, `notes.md`            |
| Performance | `performance.json`                   |

Create the sample directory only when that sample passes validation.

---

## Latin square

Use this order for every tool and both profiles. Do not replace it with another order.

| Pass inside one tool and one profile | Square | Variant order      |
| ------------------------------------ | ------ | ------------------ |
| 1, 5, 9                              | S1     | V1 → V2 → V3 → V3B |
| 2, 6, 10                             | S2     | V2 → V3 → V3B → V1 |
| 3, 7                                 | S3     | V3 → V3B → V1 → V2 |
| 4, 8                                 | S4     | V3B → V1 → V2 → V3 |

One cold navigation of one variant is one sample for the current tool.

- Lighthouse and Network each need 10 successful passes per profile (S1 through S4 twice, then S1 and S2 again).
- Performance needs 3 successful passes per profile (S1, S2, S3). Stop there.
- The pass index is the sample index. Pass 1 fills `…-01` for every variant. Pass 2 fills `…-02`. On S2, V2 is visited first and that navigation is still V2’s `…-02` when `…-01` already exists.
- Run the square separately for each tool. Lighthouse pass 1 is not Network pass 1.
- Run the square separately for Mobile and Desktop.

If a navigation fails validation, repeat that variant before moving to the next variant in the same pass. The repeat still belongs to the current sample index. Do not skip ahead, do not renumber later variants, and do not start the next pass while any variant is still missing that index.

Resume later by reading the tracker. The next pass is the first index that is still `PENDING` for that profile, variant, and tool. Do not repeat a `Valid` sample.

### URLs

```text
http://127.0.0.1:3000/experiments/experiment-001?variant=v1
http://127.0.0.1:3000/experiments/experiment-001?variant=v2
http://127.0.0.1:3000/experiments/experiment-001?variant=v3
http://127.0.0.1:3000/experiments/experiment-001?variant=v3b
```

After each load, `code[data-exp-variant]` must show `v1`, `v2`, `v3`, or `v3b` matching the URL.

### Between variants

Close the tab. Open a new Incognito tab. Re-apply the tool’s viewport and throttling before the next measured navigation. Do not restart the preview process. Do not hover navigation links. Do not reuse a tab that already loaded the experiment within 60 seconds.

---

## Shared environment

Record these in the results template before the first sample:

- Experimenter, date, machine model, CPU, RAM, OS version, display resolution and scaling
- Chrome stable version string
- Node version, npm version
- Branch `test/performance-experiment-001`
- Full git commit SHA of the build you are measuring
- `shasum -a 256 package-lock.json`

Machine rules from the protocol:

- Power adapter connected
- Sleep disabled for the session
- Other applications closed
- Chrome Incognito
- Extensions disabled
- DevTools undocked, or docked in the same place for every run
- Remote debugging off
- One preview process for the whole session; do not restart it between samples

---

## Session P — production build

Tools, in this order: Lighthouse, then Network, then Performance.

Complete both profiles for one tool before starting the next tool. Finish Mobile, then Desktop. That keeps DevTools throttling off for the whole Lighthouse block.

### Start the production server

From a clean working tree on the measurement commit:

```bash
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 3000 --strictPort
```

On this Mac, `npm run preview -- --port 3000 --strictPort` without `--host` listens on `[::1]` only, and `http://127.0.0.1:3000` is refused. `--host 127.0.0.1` is the local bind that serves the protocol URL. Use it for the production preview. Do not use `npm run dev`.

Protocol Section 9 still asks for a once-per-day check that server logs show summary at 1 s, chart at 2.5 s, budgets at 3 s, and transactions at 3.5 s, with no duplicate Server Function pair on one cold V3B navigation. That check uses `VITE_EXPERIMENT_001_LOGGING=true npm run build`. It is not a recorded sample. After it, rebuild with plain `npm run build` and serve that output. The logging build is not the build under test.

Confirm once, before any recorded sample:

- [ ] `http://127.0.0.1:3000/experiments/experiment-001?variant=v1` shows `v1`
- [ ] `?variant=v2` shows `v2`
- [ ] `?variant=v3` shows `v3`
- [ ] `?variant=v3b` shows `v3b`
- [ ] View Source contains the experiment shell (`Experiment 001`, `data-exp-milestone="shell"`)
- [ ] TanStack Devtools panel is absent
- [ ] Application panel shows no controlling service worker

Leave this preview process running through Lighthouse, Network, and Performance.

### Discarded warm-up

Load any variant once in Incognito. Close that tab. Do not run Lighthouse on it, do not export a HAR, and do not fill a tracker row.

One discarded warm-up covers the whole type-P session, including Network and Performance. Take a new discarded warm-up only if you stop and start the preview process again.

---

### 1. Lighthouse

Do this block before any DevTools network or CPU throttle is enabled.

#### Mobile

| Setting                          | Value                                                                 |
| -------------------------------- | --------------------------------------------------------------------- |
| Mode                             | Navigation                                                            |
| Device                           | Mobile                                                                |
| Viewport applied by Lighthouse   | 412 × 823, `deviceScaleFactor` 1.75, `mobile: true`                   |
| Throttling applied by Lighthouse | Simulated Slow 4G — RTT 150 ms, throughput 1638 Kbps, CPU slowdown 4× |
| Clear storage                    | Enabled                                                               |
| Categories                       | Performance included                                                  |

#### Desktop

| Setting                          | Value                                                                  |
| -------------------------------- | ---------------------------------------------------------------------- |
| Mode                             | Navigation                                                             |
| Device                           | Desktop                                                                |
| Viewport applied by Lighthouse   | 1350 × 940, `deviceScaleFactor` 1, `mobile: false`                     |
| Throttling applied by Lighthouse | Simulated Dense 4G — RTT 40 ms, throughput 10240 Kbps, CPU slowdown 1× |
| Clear storage                    | Enabled                                                                |
| Categories                       | Performance included                                                   |

#### Rules

- Incognito window. Extensions off.
- DevTools device toolbar off.
- DevTools Network throttling: **No throttling**.
- DevTools CPU throttling: **No throttling**.
- Lighthouse applies its own simulated throttling. Do not add DevTools throttling on the same run.
- Clear storage stays enabled on every audit.
- One Lighthouse navigation per variant per pass.
- Walk the Latin square until 10 valid audits exist for each of V1, V2, V3, and V3B.
- Then switch the Lighthouse device and repeat the 10 passes for the other profile.
- Do not restart preview between those audits.

#### Export

From the finished report, save HTML and JSON into the sample directory:

- `lighthouse.html`
- `lighthouse.json`

#### Lighthouse validation

A sample is valid when:

- URL `variant` matches the intended variant
- Visible `data-exp-variant` matches that variant
- Device and Clear storage match the table above
- DevTools throttling was off
- Session is production preview, not `npm run dev`
- No scroll, hover, or click on the page during the audit
- No devtools overlay
- Both JSON and HTML exist in the sample directory
- INP is left `N/A`

Milestone marks are not the validity gate for a Lighthouse sample.

---

### 2. Network

Start this block only after the Lighthouse block for both profiles is complete.

#### DevTools custom profiles

Create these once. Chrome requires an upload value. The protocol defines download and latency only, so set upload equal to the prescribed download and write the exact three numbers in the results template.

| Profile |   Download | Upload (recorded choice) | Latency | CPU                | Viewport            |
| ------- | ---------: | -----------------------: | ------: | ------------------ | ------------------- |
| Mobile  |  1638 Kbps |                1638 Kbps |  150 ms | 4× slowdown        | 412 × 823, DPR 1.75 |
| Desktop | 10240 Kbps |               10240 Kbps |   40 ms | No throttling (1×) | 1350 × 940, DPR 1   |

Do not substitute the stock presets named “Slow 4G” or “Fast 4G”. Those numbers are different from this table. If a custom profile cannot be created, stop and record the exact stock preset name and its displayed numbers in the results template before continuing.

#### Each sample

1. New Incognito tab. Open DevTools before the measured reload.
2. Network panel: **Disable cache** on, **Preserve log** on.
3. Select the custom network profile, CPU throttle, and viewport for the active profile.
4. Clear the Network log so the recording contains one navigation.
5. Open the variant URL.
6. Right-click the reload button → **Empty Cache and Hard Reload**. That reload is the sample.
7. Do not scroll, hover, or click the page.
8. Wait until milestone F. The shell root `data-exp-complete` is `true`.
9. In the Console, copy User Timing A–F. Console evaluation is part of the procedure.

```js
for (const id of ['A', 'B', 'C', 'D', 'E', 'F']) {
  const mark = performance.getEntriesByName(`exp-milestone-${id}`, 'mark')[0]
  console.log(id, mark ? mark.startTime : 'MISSING')
}
```

10. Export the HAR: Network panel download control → **Save all as HAR with content**. Save as `network.har`.
11. Write `notes.md` in the same directory.

One recording per variant per pass. Repeat the Latin square until each variant has 10 valid HARs on Mobile, then do the same on Desktop.

#### `notes.md`

```md
# SAMPLE-ID

- Variant label:
- Profile:
- Build: production dist
- User Timing startTime (ms from navigation):
  - A:
  - B:
  - C:
  - D:
  - E:
  - F:
- Server Function RPC count:
- Duplicate Server Function URLs:
- N/A reasons:
```

If a per-query Network row is absent, write `N/A` and the reason (for example dehydrated or streamed during SSR). Still record the User Timing marks from this navigation.

#### Network validation

- Milestones A–F are present, or the sample is excluded
- HAR is `network.har`, not a custom JSON summary
- Throttling and viewport match the custom profile table
- Production preview
- No page interaction during the reload

---

### 3. Performance

Diagnostic only. These traces do not replace Lighthouse or Network samples, and they do not share sample IDs with those tools.

Use the same production preview and the same custom DevTools profiles as Network.

1. Performance panel.
2. Enable screenshots.
3. Set CPU and the custom network profile for the active device profile.
4. **Record and reload**.
5. Stop the recording after milestone F and then 2 seconds of idle.
6. Save the trace as `performance.json` in the sample directory.

n=3 valid traces per variant per profile. Latin-square passes S1, S2, and S3 only.

Collect from the trace, when you later fill the workbook: navigation start, DOMContentLoaded, load event end, trace FCP, trace LCP, scripting, rendering, painting, long-task count and max duration, marks A–F, and the gap from last network activity to milestone F.

If marks A–F are missing from the trace, exclude the sample and repeat it.

---

## Validation checklist

Set a tracker row to `RECORDED` / `Valid` only when every item below is true.

- [ ] Correct variant: URL `variant` and `data-exp-variant` match the sample ID
- [ ] Correct profile: Mobile or Desktop settings match the sample ID prefix `M` or `D`
- [ ] Correct tool and session: Lighthouse, Network, and Performance came from the production preview
- [ ] Correct URL: `http://127.0.0.1:3000/experiments/experiment-001?variant=` plus `v1`, `v2`, `v3`, or `v3b`
- [ ] Correct build: `npm run build` and `npm run preview`
- [ ] Correct throttling: Lighthouse used only its simulated device preset. Network and Performance used the custom DevTools profile for that device
- [ ] No manual interaction: no scroll, hover, or click on the page during the measured load
- [ ] No DevTools interference: no second throttle on a Lighthouse run, no TanStack Devtools panel, no remote debugging, no extra extension
- [ ] Required artifact exported: Lighthouse JSON and HTML, or `network.har` plus `notes.md`, or `performance.json`
- [ ] Required milestones available: Network and Performance have User Timing A–F. Lighthouse does not use milestones as its validity gate
- [ ] No invalidation reason: no error boundary, no wrong label, no warm tab inside the 60 second `staleTime`, no restarted preview in the middle of a recorded sample, no mixed build

Invalid samples are excluded and repeated. A `Valid` sample is never replaced and its files are never overwritten.

Log each failed attempt here. Do not store the failed export in the final sample directory.

| When | Sample ID | Tool | Profile | Reason | Repeated as same ID? |
| ---- | --------- | ---- | ------- | ------ | -------------------- |
|      |           |      |         |        |                      |

---

## After the last valid sample

1. Stop the production preview.
2. Confirm the tracker has 184 `Valid` rows and no remaining `PENDING` rows.
3. Enter values from the artifacts into `docs/experiment-001-results-template.md`.
4. Leave pilot / preliminary measurement numbers out of that workbook.
5. Compute medians only after every valid sample for that variant, profile, and tool is entered.
