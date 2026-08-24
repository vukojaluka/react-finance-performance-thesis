export {
  formatISODate as formatTransactionDate,
  isRealCalendarDate,
  parseISODate,
  toISODate,
} from '@/lib/format-date'

export function getTransactionTypeLabel(type: 'income' | 'expense'): string {
  return type === 'income' ? 'Prihod' : 'Rashod'
}
