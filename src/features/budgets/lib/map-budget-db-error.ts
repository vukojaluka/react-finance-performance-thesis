const DUPLICATE_BUDGET_MESSAGE =
  'Za ovu kategoriju već postoji budžet za odabrani mjesec.'

type SupabaseErrorLike = {
  code?: string
  message?: string
}

export function mapBudgetDbError(
  error: SupabaseErrorLike,
  fallback: string,
): string {
  if (error.code === '23505') {
    return DUPLICATE_BUDGET_MESSAGE
  }

  return fallback
}
