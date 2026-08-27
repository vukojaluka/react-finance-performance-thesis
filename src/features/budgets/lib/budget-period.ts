export type BudgetPeriod = {
  month: number
  year: number
}

export type BudgetMonthOption = {
  value: number
  label: string
}

const monthLabelFormatter = new Intl.DateTimeFormat('hr-HR', {
  month: 'long',
  year: 'numeric',
})

const monthOptionLabelFormatter = new Intl.DateTimeFormat('hr-HR', {
  month: 'long',
})

export function getCurrentBudgetPeriod(): BudgetPeriod {
  const now = new Date()

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
}

export function formatBudgetPeriodLabel({ month, year }: BudgetPeriod): string {
  return monthLabelFormatter.format(new Date(year, month - 1, 1))
}

export function getPreviousBudgetPeriod({
  month,
  year,
}: BudgetPeriod): BudgetPeriod {
  if (month === 1) {
    return { month: 12, year: year - 1 }
  }

  return { month: month - 1, year }
}

export function getNextBudgetPeriod({
  month,
  year,
}: BudgetPeriod): BudgetPeriod {
  if (month === 12) {
    return { month: 1, year: year + 1 }
  }

  return { month: month + 1, year }
}

export function getMonthOptions(): BudgetMonthOption[] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1

    return {
      value: month,
      label: monthOptionLabelFormatter.format(new Date(2026, index, 1)),
    }
  })
}

export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear()

  return Array.from({ length: 7 }, (_, index) => currentYear - 2 + index)
}

export function getMonthDateRange({ month, year }: BudgetPeriod): {
  start: string
  end: string
} {
  const monthString = String(month).padStart(2, '0')
  const lastDay = new Date(year, month, 0).getDate()

  return {
    start: `${year}-${monthString}-01`,
    end: `${year}-${monthString}-${String(lastDay).padStart(2, '0')}`,
  }
}
