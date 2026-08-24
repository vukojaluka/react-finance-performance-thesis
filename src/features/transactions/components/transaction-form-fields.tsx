import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormField, getFormFieldAriaProps } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CategoryListItem } from '@/features/categories/server/get-categories'
import type { useTransactionForm } from '@/features/transactions/hooks/use-transaction-form'
import { TRANSACTION_TYPE_ITEMS } from '@/features/transactions/lib/transaction-form'
import {
  formatTransactionDate,
  parseISODate,
  toISODate,
} from '@/features/transactions/lib/format-transaction'

type TransactionFormApi = ReturnType<typeof useTransactionForm>['form']

type TransactionFormFieldsProps = {
  form: TransactionFormApi
  categories: CategoryListItem[]
  categoryItems: Record<string, string>
  hasCategories: boolean
}

export function TransactionFormFields({
  form,
  categories,
  categoryItems,
  hasCategories,
}: TransactionFormFieldsProps) {
  return (
    <>
      <form.Field name="type">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Tip"
              errors={field.state.meta.errors}
            >
              <Select
                value={field.state.value}
                items={TRANSACTION_TYPE_ITEMS}
                onValueChange={(value) => {
                  if (value === 'income' || value === 'expense') {
                    field.handleChange(value)
                  }
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full"
                  aria-invalid={aria['aria-invalid']}
                  aria-describedby={aria['aria-describedby']}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Prihod</SelectItem>
                  <SelectItem value="expense">Rashod</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          )
        }}
      </form.Field>

      <form.Field name="amount">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Iznos"
              errors={field.state.meta.errors}
            >
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  inputMode="decimal"
                  placeholder="0,00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={aria['aria-invalid']}
                  aria-describedby={aria['aria-describedby']}
                  className="pr-14"
                />
                <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-sm text-muted-foreground">
                  BAM
                </span>
              </div>
            </FormField>
          )
        }}
      </form.Field>

      <form.Field name="title">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Opis"
              errors={field.state.meta.errors}
            >
              <Input
                id={field.name}
                name={field.name}
                type="text"
                placeholder="Unesite opis transakcije"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={aria['aria-invalid']}
                aria-describedby={aria['aria-describedby']}
              />
            </FormField>
          )
        }}
      </form.Field>

      <form.Field name="category_id">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Kategorija"
              errors={field.state.meta.errors}
            >
              <Select
                value={field.state.value || null}
                items={categoryItems}
                disabled={!hasCategories}
                onValueChange={(value) => {
                  if (value) {
                    field.handleChange(value)
                  }
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full"
                  aria-invalid={aria['aria-invalid']}
                  aria-describedby={aria['aria-describedby']}
                >
                  <SelectValue
                    placeholder={
                      hasCategories
                        ? 'Odaberite kategoriju'
                        : 'Nemate kategorija.'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="block size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="block">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )
        }}
      </form.Field>

      <TransactionDateField form={form} />
    </>
  )
}

function TransactionDateField({ form }: { form: TransactionFormApi }) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  return (
    <form.Field name="transaction_date">
      {(field) => {
        const selectedDate = parseISODate(field.state.value)
        const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

        return (
          <FormField
            id={field.name}
            label="Datum"
            errors={field.state.meta.errors}
          >
            <div>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      id={field.name}
                      type="button"
                      variant="outline"
                      className="w-full px-0 justify-start font-normal text-sm normal-case tracking-normal border-t-0 border-x-0 focus-ring-0 focus-ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-within:ring-0 focus-within:ring-offset-0"
                      aria-invalid={aria['aria-invalid']}
                      aria-describedby={aria['aria-describedby']}
                    />
                  }
                >
                  <CalendarIcon className="size-4" />
                  {formatTransactionDate(field.state.value)}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={selectedDate ?? undefined}
                    onValueChange={(date) => {
                      field.handleChange(toISODate(date))
                      setDatePickerOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormField>
        )
      }}
    </form.Field>
  )
}
