import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import type { BudgetFormCopy } from '@/features/budgets/lib/budget-form'

type BudgetFormFooterProps = {
  copy: BudgetFormCopy
  isPending: boolean
  isSubmitting: boolean
  canSubmit: boolean
  month: number
  year: number
  cancelSearch?: { month: number; year: number }
}

export function BudgetFormFooter({
  copy,
  isPending,
  isSubmitting,
  canSubmit,
  month,
  year,
  cancelSearch,
}: BudgetFormFooterProps) {
  return (
    <>
      <Button
        nativeButton={false}
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        disabled={isSubmitting || isPending}
        render={
          <Link
            to="/budgets"
            search={(prev) => ({
              ...prev,
              month: cancelSearch?.month ?? month,
              year: cancelSearch?.year ?? year,
            })}
          />
        }
      >
        Odustani
      </Button>
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting || isPending || !canSubmit}
      >
        {isSubmitting || isPending ? 'Spremanje...' : copy.submit}
      </Button>
    </>
  )
}
