# Experiment 001 — Session log

Formal samples collected on the production preview. S1 for every tool and both profiles is the pre-existing `-01` first pass. This log covers S2–S10 for Lighthouse and Network, and S2–S3 for Performance.

| Field | Value |
| ----- | ----- |
| Build SHA | `8c8df0b3266b32b841735126151e9b1b1b2b94ba` |
| Branch | `test/performance-experiment-001` |
| package-lock.json SHA-256 | `dd1a081b687172337efc8a65c283af4bdead43bb7f0be94c835f295bdf48a1de` |
| Preview | `npm run build` then `npm run preview -- --port 3000 --strictPort` |
| URL origin | `http://localhost:3000` |
| Chrome | Google Chrome 148.0.7778.96 |
| Node | v22.22.2 |
| Lighthouse | 13.4.1, `throttlingMethod: simulate`, performance category only, storage reset enabled |
| Date | 2026-09-30 |

Invalid or repeated measurement samples: none. One runner interruption happened after Mobile Lighthouse S5. The 16 samples already saved were kept and were not repeated. The run then continued at Mobile Lighthouse S6.

## Sessions

Each session below is one profile and one tool. Every listed sample passed validation and was saved.

| Session | Profile | Tool | Variant order | Successful samples |
| ------- | ------- | ---- | ------------- | ------------------ |
| S2 | Mobile | Lighthouse | V2 → V3 → V3B → V1 | M-LH-V2-02, M-LH-V3-02, M-LH-V3B-02, M-LH-V1-02 |
| S3 | Mobile | Lighthouse | V3 → V3B → V1 → V2 | M-LH-V3-03, M-LH-V3B-03, M-LH-V1-03, M-LH-V2-03 |
| S4 | Mobile | Lighthouse | V3B → V1 → V2 → V3 | M-LH-V3B-04, M-LH-V1-04, M-LH-V2-04, M-LH-V3-04 |
| S5 | Mobile | Lighthouse | V1 → V2 → V3 → V3B | M-LH-V1-05, M-LH-V2-05, M-LH-V3-05, M-LH-V3B-05 |
| S6 | Mobile | Lighthouse | V2 → V3 → V3B → V1 | M-LH-V2-06, M-LH-V3-06, M-LH-V3B-06, M-LH-V1-06 |
| S7 | Mobile | Lighthouse | V3 → V3B → V1 → V2 | M-LH-V3-07, M-LH-V3B-07, M-LH-V1-07, M-LH-V2-07 |
| S8 | Mobile | Lighthouse | V3B → V1 → V2 → V3 | M-LH-V3B-08, M-LH-V1-08, M-LH-V2-08, M-LH-V3-08 |
| S9 | Mobile | Lighthouse | V1 → V2 → V3 → V3B | M-LH-V1-09, M-LH-V2-09, M-LH-V3-09, M-LH-V3B-09 |
| S10 | Mobile | Lighthouse | V2 → V3 → V3B → V1 | M-LH-V2-10, M-LH-V3-10, M-LH-V3B-10, M-LH-V1-10 |
| S2 | Desktop | Lighthouse | V2 → V3 → V3B → V1 | D-LH-V2-02, D-LH-V3-02, D-LH-V3B-02, D-LH-V1-02 |
| S3 | Desktop | Lighthouse | V3 → V3B → V1 → V2 | D-LH-V3-03, D-LH-V3B-03, D-LH-V1-03, D-LH-V2-03 |
| S4 | Desktop | Lighthouse | V3B → V1 → V2 → V3 | D-LH-V3B-04, D-LH-V1-04, D-LH-V2-04, D-LH-V3-04 |
| S5 | Desktop | Lighthouse | V1 → V2 → V3 → V3B | D-LH-V1-05, D-LH-V2-05, D-LH-V3-05, D-LH-V3B-05 |
| S6 | Desktop | Lighthouse | V2 → V3 → V3B → V1 | D-LH-V2-06, D-LH-V3-06, D-LH-V3B-06, D-LH-V1-06 |
| S7 | Desktop | Lighthouse | V3 → V3B → V1 → V2 | D-LH-V3-07, D-LH-V3B-07, D-LH-V1-07, D-LH-V2-07 |
| S8 | Desktop | Lighthouse | V3B → V1 → V2 → V3 | D-LH-V3B-08, D-LH-V1-08, D-LH-V2-08, D-LH-V3-08 |
| S9 | Desktop | Lighthouse | V1 → V2 → V3 → V3B | D-LH-V1-09, D-LH-V2-09, D-LH-V3-09, D-LH-V3B-09 |
| S10 | Desktop | Lighthouse | V2 → V3 → V3B → V1 | D-LH-V2-10, D-LH-V3-10, D-LH-V3B-10, D-LH-V1-10 |
| S2 | Mobile | Network | V2 → V3 → V3B → V1 | M-NW-V2-02, M-NW-V3-02, M-NW-V3B-02, M-NW-V1-02 |
| S3 | Mobile | Network | V3 → V3B → V1 → V2 | M-NW-V3-03, M-NW-V3B-03, M-NW-V1-03, M-NW-V2-03 |
| S4 | Mobile | Network | V3B → V1 → V2 → V3 | M-NW-V3B-04, M-NW-V1-04, M-NW-V2-04, M-NW-V3-04 |
| S5 | Mobile | Network | V1 → V2 → V3 → V3B | M-NW-V1-05, M-NW-V2-05, M-NW-V3-05, M-NW-V3B-05 |
| S6 | Mobile | Network | V2 → V3 → V3B → V1 | M-NW-V2-06, M-NW-V3-06, M-NW-V3B-06, M-NW-V1-06 |
| S7 | Mobile | Network | V3 → V3B → V1 → V2 | M-NW-V3-07, M-NW-V3B-07, M-NW-V1-07, M-NW-V2-07 |
| S8 | Mobile | Network | V3B → V1 → V2 → V3 | M-NW-V3B-08, M-NW-V1-08, M-NW-V2-08, M-NW-V3-08 |
| S9 | Mobile | Network | V1 → V2 → V3 → V3B | M-NW-V1-09, M-NW-V2-09, M-NW-V3-09, M-NW-V3B-09 |
| S10 | Mobile | Network | V2 → V3 → V3B → V1 | M-NW-V2-10, M-NW-V3-10, M-NW-V3B-10, M-NW-V1-10 |
| S2 | Desktop | Network | V2 → V3 → V3B → V1 | D-NW-V2-02, D-NW-V3-02, D-NW-V3B-02, D-NW-V1-02 |
| S3 | Desktop | Network | V3 → V3B → V1 → V2 | D-NW-V3-03, D-NW-V3B-03, D-NW-V1-03, D-NW-V2-03 |
| S4 | Desktop | Network | V3B → V1 → V2 → V3 | D-NW-V3B-04, D-NW-V1-04, D-NW-V2-04, D-NW-V3-04 |
| S5 | Desktop | Network | V1 → V2 → V3 → V3B | D-NW-V1-05, D-NW-V2-05, D-NW-V3-05, D-NW-V3B-05 |
| S6 | Desktop | Network | V2 → V3 → V3B → V1 | D-NW-V2-06, D-NW-V3-06, D-NW-V3B-06, D-NW-V1-06 |
| S7 | Desktop | Network | V3 → V3B → V1 → V2 | D-NW-V3-07, D-NW-V3B-07, D-NW-V1-07, D-NW-V2-07 |
| S8 | Desktop | Network | V3B → V1 → V2 → V3 | D-NW-V3B-08, D-NW-V1-08, D-NW-V2-08, D-NW-V3-08 |
| S9 | Desktop | Network | V1 → V2 → V3 → V3B | D-NW-V1-09, D-NW-V2-09, D-NW-V3-09, D-NW-V3B-09 |
| S10 | Desktop | Network | V2 → V3 → V3B → V1 | D-NW-V2-10, D-NW-V3-10, D-NW-V3B-10, D-NW-V1-10 |
| S2 | Mobile | Performance | V2 → V3 → V3B → V1 | M-PF-V2-02, M-PF-V3-02, M-PF-V3B-02, M-PF-V1-02 |
| S3 | Mobile | Performance | V3 → V3B → V1 → V2 | M-PF-V3-03, M-PF-V3B-03, M-PF-V1-03, M-PF-V2-03 |
| S2 | Desktop | Performance | V2 → V3 → V3B → V1 | D-PF-V2-02, D-PF-V3-02, D-PF-V3B-02, D-PF-V1-02 |
| S3 | Desktop | Performance | V3 → V3B → V1 → V2 | D-PF-V3-03, D-PF-V3B-03, D-PF-V1-03, D-PF-V2-03 |

## Capture method

Lighthouse used Lighthouse 13.4.1 against a fresh Chrome profile. Mobile used simulated Slow 4G (`rttMs` 150, `throughputKbps` 1638.4, CPU 4×) and a 412×823 viewport at device scale 1.75. Desktop used simulated Dense 4G (`rttMs` 40, `throughputKbps` 10240, CPU 1×) and a 1350×940 viewport at device scale 1. DevTools network and CPU throttling were not applied during Lighthouse.

Network and Performance used Chrome DevTools Protocol emulation with the custom profiles from the existing traces: Mobile 204750 bytes/s down and up, 150 ms latency, CPU 4×; Desktop 1280000 bytes/s down and up, 40 ms latency, no CPU throttle. Cache was disabled. Each network sample is the hard reload after a discarded first load in a new browser context. Each performance sample is one traced cold navigation, stopped 2 seconds after `data-exp-complete=true`.

Network HAR files are HAR 1.2 with response bodies. No individual Server Function RPC rows were present; that limitation is recorded in each sample's `.notes.md`. Performance traces contain User Timing marks `exp-milestone-A` through `exp-milestone-F`.
