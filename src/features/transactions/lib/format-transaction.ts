const dateFormatter = new Intl.DateTimeFormat('hr-HR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatTransactionDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function getTransactionTypeLabel(type: 'income' | 'expense'): string {
  return type === 'income' ? 'Prihod' : 'Rashod'
}
