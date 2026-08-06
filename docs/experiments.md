# Experiments

This document contains implementation experiments performed during the development of the application.

Each experiment evaluates a specific rendering strategy, data fetching strategy or performance optimization used throughout the project.

The goal is to validate architectural decisions using measurable results instead of assumptions.

---

# Experiment Template

## Goal

Describe what is being tested.

---

## Background

Why is this experiment important?

---

## Hypothesis

Expected outcome before implementation.

---

## Implementation

Describe how the experiment is implemented.

---

## Measurements

Metrics to collect.

- Lighthouse
- Core Web Vitals
- React Profiler
- Network Waterfall
- Bundle Size
- User Experience

---

## Results

Measured values.

---

## Conclusion

Was the hypothesis correct?

---

# Experiment 001

## Title

Prefetch Query + Suspense

## Goal

Verify whether `queryClient.prefetchQuery()` called inside a route loader without `await` starts the request immediately and allows `useSuspenseQuery()` to reuse the same pending Promise after hydration.

## Background

TanStack Query stores pending queries inside the Query Cache.

The objective is to determine whether the Suspense component can attach to the existing Promise instead of creating another network request.

## Hypothesis

- Loader starts the request immediately.
- SSR is not blocked.
- Suspense receives the existing Promise.
- Only one Server Function request is executed.

## Implementation

TODO

## Measurements

- Number of network requests
- Server Function execution count
- Waterfall timing
- Suspense reveal timing
- React Profiler

## Results

TODO

## Conclusion

TODO

---

# Experiment 002

## Title

Blocking SSR vs Streaming SSR

Status

Planned

---

# Experiment 003

## Title

ensureQueryData vs prefetchQuery

Status

Planned

---

# Experiment 004

## Title

Route Code Splitting

Status

Planned

---

# Experiment 005

## Title

Suspense Boundary Placement

Status

Planned

---

# Experiment 006

## Title

TanStack Query Cache Behaviour

Status

Planned

---

# Experiment 007

## Title

React startTransition

Status

Planned

---

# Experiment 008

## Title

Transaction List Virtualization

Status

Planned

---

# Experiment 009

## Title

Bundle Size Analysis

Status

Planned

---

# Experiment 010

## Title

Lighthouse Performance Comparison

Status

Planned
