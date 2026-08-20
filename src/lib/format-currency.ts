const bamFormatter = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'BAM',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatBam(value: number): string {
  return bamFormatter.format(value)
}
