export function calculateBudgetPercentage(
  spentAmount: number,
  budgetAmount: number,
): number {
  if (!Number.isFinite(spentAmount) || !Number.isFinite(budgetAmount)) {
    return 0
  }

  if (budgetAmount <= 0) {
    return spentAmount > 0 ? 100 : 0
  }

  const percentage = (spentAmount / budgetAmount) * 100

  return Number.isFinite(percentage) ? percentage : 0
}

export function calculateBudgetRemaining(
  budgetAmount: number,
  spentAmount: number,
): number {
  if (!Number.isFinite(budgetAmount) || !Number.isFinite(spentAmount)) {
    return 0
  }

  return budgetAmount - spentAmount
}

export function clampProgressValue(percentage: number): number {
  if (!Number.isFinite(percentage)) {
    return 0
  }

  return Math.min(Math.max(percentage, 0), 100)
}
