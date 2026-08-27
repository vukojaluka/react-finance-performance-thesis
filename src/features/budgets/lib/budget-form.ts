import { getCurrentBudgetPeriod } from '@/features/budgets/lib/budget-period'
import type { BudgetDetail } from '@/features/budgets/server/get-budget'
import type { BudgetPeriodFilters } from '@/features/budgets/schemas/budget-search.schema'

export type BudgetFormMode = 'create' | 'edit'

export type BudgetFormValues = {
  category_id: string
  amount: string | number
  month: number
  year: number
}

export const BUDGET_FORM_COPY = {
  create: {
    title: 'NOVI BUDŽET',
    description: 'Postavite mjesečni budžet za odabranu kategoriju.',
    submit: 'Spremi budžet',
  },
  edit: {
    title: 'UREDI BUDŽET',
    description: 'Izmijenite podatke postojećeg budžeta.',
    submit: 'Spremi promjene',
  },
} as const

export type BudgetFormCopy =
  (typeof BUDGET_FORM_COPY)[keyof typeof BUDGET_FORM_COPY]

export function formatAmountForInput(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}

export function getCreateDefaultValues(
  period: BudgetPeriodFilters = getCurrentBudgetPeriod(),
): BudgetFormValues {
  return {
    category_id: '',
    amount: '',
    month: period.month,
    year: period.year,
  }
}

export function mapBudgetToFormValues(budget: BudgetDetail): BudgetFormValues {
  return {
    category_id: budget.category_id,
    amount: formatAmountForInput(budget.amount),
    month: budget.month,
    year: budget.year,
  }
}
