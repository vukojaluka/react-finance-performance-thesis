import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  formatBudgetPeriodLabel,
  getNextBudgetPeriod,
  getPreviousBudgetPeriod,
} from '@/features/budgets/lib/budget-period'

export function BudgetsPeriodNavigation() {
  const search = useSearch({ from: '/_protected/budgets/' })
  const navigate = useNavigate({ from: '/budgets' })
  const periodLabel = formatBudgetPeriodLabel(search)

  function goToPreviousMonth() {
    const previous = getPreviousBudgetPeriod(search)

    void navigate({
      search: (prev) => ({
        ...prev,
        month: previous.month,
        year: previous.year,
      }),
    })
  }

  function goToNextMonth() {
    const next = getNextBudgetPeriod(search)

    void navigate({
      search: (prev) => ({
        ...prev,
        month: next.month,
        year: next.year,
      }),
    })
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={goToPreviousMonth}
        aria-label="Prethodni mjesec"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <p className="min-w-36 text-center text-sm font-medium capitalize">
        {periodLabel}
      </p>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={goToNextMonth}
        aria-label="Sljedeći mjesec"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}
