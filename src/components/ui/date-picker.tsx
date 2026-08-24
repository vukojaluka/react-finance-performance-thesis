'use client'

import { CalendarIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatISODate, parseISODate, toISODate } from '@/lib/format-date'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  closeOnSelect?: boolean
  className?: string
} & Pick<ComponentProps<typeof Button>, 'aria-invalid' | 'aria-describedby'>

export function DatePicker({
  id,
  value,
  onValueChange,
  placeholder = 'Odaberite datum',
  disabled,
  closeOnSelect = true,
  className,
  ...aria
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseISODate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start gap-2 px-0 font-normal text-sm normal-case tracking-normal border-t-0 border-x-0 focus-ring-0 focus-ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-within:ring-0 focus-within:ring-offset-0',
              !selectedDate && 'text-muted-foreground',
              className,
            )}
            {...aria}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0" />
        {selectedDate ? formatISODate(value) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          value={selectedDate ?? undefined}
          onValueChange={(date) => {
            onValueChange(toISODate(date))

            if (closeOnSelect) {
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
