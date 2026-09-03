import { useEffect } from 'react'
import type { RefObject } from 'react'

import { experimentVariantSchema } from './experiment-config'
import type { ExperimentVariant } from './experiment-config'
import { experimentLog } from './experiment-logger'

const MILESTONE_IDS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

type MilestoneId = (typeof MILESTONE_IDS)[number]

function hasFallback(root: HTMLElement, widget: string): boolean {
  return Boolean(root.querySelector(`[data-exp-fallback="${widget}"]`))
}

function readMilestoneReadiness(
  root: HTMLElement,
  variant: ExperimentVariant,
): Record<MilestoneId, boolean> {
  const heading = root.querySelector('h1')
  const variantLabel = root.querySelector('[data-exp-variant]')
  const urlVariant = experimentVariantSchema.parse(
    new URLSearchParams(window.location.search).get('variant') ?? undefined,
  )

  const summary = root.querySelector('[data-exp-milestone="summary"]')
  const summaryValues = summary?.querySelectorAll('[data-exp-kpi-value]')
  const summaryReady = Boolean(
    summary &&
    summaryValues?.length === 4 &&
    Array.from(summaryValues).every((value) => {
      const numericValue = Number(value.getAttribute('data-exp-kpi-value'))
      return Number.isFinite(numericValue) && value.textContent.trim()
    }) &&
    !hasFallback(root, 'summary') &&
    !root.querySelector('[data-exp-widget-error="summary"]'),
  )

  const chart = root.querySelector('[data-exp-milestone="chart"]')
  const chartPointCount = Number(chart?.getAttribute('data-exp-chart-points'))
  const chartReady = Boolean(
    chart &&
    chart.querySelector('svg, canvas') &&
    chartPointCount >= 6 &&
    !hasFallback(root, 'chart') &&
    !root.querySelector('[data-exp-widget-error="chart"]'),
  )

  const transactions = root.querySelector('[data-exp-milestone="transactions"]')
  const transactionRows = transactions?.querySelectorAll(
    '[data-exp-transaction-row]',
  )
  const transactionsReady = Boolean(
    transactions &&
    (transactionRows?.length === 5 ||
      transactions.querySelector('[data-exp-empty-state="transactions"]')) &&
    !hasFallback(root, 'transactions') &&
    !root.querySelector('[data-exp-widget-error="transactions"]'),
  )

  const budgets = root.querySelector('[data-exp-milestone="budgets"]')
  const budgetRows = budgets?.querySelectorAll('[data-exp-budget-row]')
  const budgetsReady = Boolean(
    budgets &&
    ((budgetRows &&
      budgetRows.length >= 1 &&
      Array.from(budgetRows).every((row) =>
        row.querySelector('[data-exp-budget-progress]'),
      )) ||
      budgets.querySelector('[data-exp-empty-state="budgets"]')) &&
    !hasFallback(root, 'budgets') &&
    !root.querySelector('[data-exp-widget-error="budgets"]'),
  )

  const shellReady = Boolean(
    root.matches('[data-exp-milestone="shell"]') &&
    heading?.textContent.includes('Experiment 001') &&
    variantLabel?.textContent.trim() === variant &&
    urlVariant === variant,
  )

  return {
    A: shellReady,
    B: summaryReady,
    C: chartReady,
    D: transactionsReady,
    E: budgetsReady,
    F:
      summaryReady &&
      chartReady &&
      transactionsReady &&
      budgetsReady &&
      !root.querySelector('[data-exp-widget-error]') &&
      !root.querySelector('[data-exp-fallback]'),
  }
}

function markMilestoneOnce(
  id: MilestoneId,
  markedMilestones: Set<MilestoneId>,
): void {
  if (markedMilestones.has(id)) {
    return
  }

  const markName = `exp-milestone-${id}`

  if (performance.getEntriesByName(markName, 'mark').length === 0) {
    performance.mark(markName)
    experimentLog('Milestone committed', id)
  }

  markedMilestones.add(id)
}

/**
 * Observes the committed experiment DOM. It never infers readiness from the
 * configured delays, so streamed Suspense reveals and fully blocking SSR use
 * the same predicates.
 */
export function useExperimentMilestones(
  rootRef: RefObject<HTMLElement | null>,
  variant: ExperimentVariant,
): void {
  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const markedMilestones = new Set<MilestoneId>()

    for (const id of MILESTONE_IDS) {
      performance.clearMarks(`exp-milestone-${id}`)
    }

    root.setAttribute('data-exp-complete', 'false')

    const evaluate = () => {
      const readiness = readMilestoneReadiness(root, variant)

      for (const id of MILESTONE_IDS) {
        if (readiness[id]) {
          if (id === 'F') {
            root.setAttribute('data-exp-complete', 'true')
          }

          markMilestoneOnce(id, markedMilestones)
        }
      }
    }

    const observer = new MutationObserver(evaluate)
    observer.observe(root, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    evaluate()

    return () => {
      observer.disconnect()
    }
  }, [rootRef, variant])
}
