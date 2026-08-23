'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CalendarProps = {
  value?: Date
  onValueChange: (date: Date) => void
  className?: string
}

const monthFormatter = new Intl.DateTimeFormat('hr-HR', {
  month: 'long',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('hr-HR', { weekday: 'short' })

function getMondayFirstWeekdays(): Array<string> {
  const monday = new Date(2024, 0, 1)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + index,
    )
    return weekdayFormatter.format(date)
  })
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function Calendar({ value, onValueChange, className }: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = React.useState(
    value?.getFullYear() ?? today.getFullYear(),
  )
  const [viewMonth, setViewMonth] = React.useState(
    value?.getMonth() ?? today.getMonth(),
  )

  React.useEffect(() => {
    if (value) {
      setViewYear(value.getFullYear())
      setViewMonth(value.getMonth())
    }
  }, [value])

  const weekdays = React.useMemo(() => getMondayFirstWeekdays(), [])
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDayOffset = getFirstDayOfMonth(viewYear, viewMonth)

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((current) => current - 1)
      return
    }

    setViewMonth((current) => current - 1)
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((current) => current + 1)
      return
    }

    setViewMonth((current) => current + 1)
  }

  const cells: Array<{
    day: number
    date: Date
    currentMonth: boolean
  }> = []

  const previousMonth = viewMonth === 0 ? 11 : viewMonth - 1
  const previousYear = viewMonth === 0 ? viewYear - 1 : viewYear
  const previousMonthDays = getDaysInMonth(previousYear, previousMonth)

  for (let index = firstDayOffset - 1; index >= 0; index -= 1) {
    const day = previousMonthDays - index
    cells.push({
      day,
      date: new Date(previousYear, previousMonth, day),
      currentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      date: new Date(viewYear, viewMonth, day),
      currentMonth: true,
    })
  }

  const remaining = 42 - cells.length
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear

  for (let day = 1; day <= remaining; day += 1) {
    cells.push({
      day,
      date: new Date(nextYear, nextMonth, day),
      currentMonth: false,
    })
  }

  const viewDate = new Date(viewYear, viewMonth, 1)

  return (
    <div className={cn('p-3', className)}>
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={goToPrevMonth}
          aria-label="Prethodni mjesec"
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm font-medium capitalize">
          {monthFormatter.format(viewDate)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={goToNextMonth}
          aria-label="Sljedeći mjesec"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const selected = value ? isSameDay(cell.date, value) : false
          const isToday = isSameDay(cell.date, today)

          return (
            <Button
              key={cell.date.toISOString()}
              type="button"
              variant={selected ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn(
                !cell.currentMonth && 'text-muted-foreground opacity-50',
                isToday && !selected && 'border border-border',
              )}
              onClick={() => onValueChange(cell.date)}
            >
              {cell.day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
