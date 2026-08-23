import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { CalendarIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormFieldError } from '@/components/ui/form-field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import {
  formatTransactionDate,
  parseISODate,
  toISODate,
} from '@/features/transactions/lib/format-transaction'
import { transactionSchema } from '@/features/transactions/schemas/transaction-form.schema'
import type { TransactionInput } from '@/features/transactions/schemas/transaction-form.schema'
import { createTransaction } from '@/features/transactions/server/create-transaction'
import { fieldErrorId } from '@/lib/form-errors'
import { cn } from '@/lib/utils'

const TYPE_ITEMS = {
  income: 'Prihod',
  expense: 'Rashod',
} as const

function FormField({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function TransactionForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createTransactionFn = useServerFn(createTransaction)
  const { data: categories = [] } = useQuery(categoriesQuery())
  const [formError, setFormError] = useState<string | null>(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const categoryItems = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category.id, category.name]),
      ),
    [categories],
  )

  const mutation = useMutation({
    mutationFn: (input: TransactionInput) =>
      createTransactionFn({ data: input }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
      await navigate({ to: '/transactions', search: { page: 1 } })
    },
  })

  const form = useForm({
    defaultValues: {
      type: 'expense' as 'income' | 'expense',
      amount: '' as string | number,
      title: '',
      category_id: '',
      transaction_date: toISODate(new Date()),
    },
    validators: {
      onChange: transactionSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        const parsed = transactionSchema.parse(value)
        await mutation.mutateAsync(parsed)
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Došlo je do greške. Pokušajte ponovno.',
        )
      }
    },
  })

  const hasCategories = categories.length > 0
  const isPending = mutation.isPending

  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case flex flex-col gap-1">
          NOVA TRANSAKCIJA
          <span className="text-xs text-muted-foreground">
            Dodajte novi prihod ili rashod.
          </span>
        </CardTitle>
      </CardHeader>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <CardContent className="space-y-4">
          <form.Field name="type">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = fieldErrorId(field.name)

              return (
                <FormField id={field.name} label="Tip">
                  <Select
                    value={field.state.value}
                    items={TYPE_ITEMS}
                    onValueChange={(value) => {
                      if (value === 'income' || value === 'expense') {
                        field.handleChange(value)
                      }
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Prihod</SelectItem>
                      <SelectItem value="expense">Rashod</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormFieldError
                    id={errorId}
                    errors={field.state.meta.errors}
                  />
                </FormField>
              )
            }}
          </form.Field>

          <form.Field name="amount">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = fieldErrorId(field.name)

              return (
                <FormField id={field.name} label="Iznos">
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="decimal"
                      placeholder="0,00"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                      className="pr-14"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-sm text-muted-foreground">
                      BAM
                    </span>
                  </div>
                  <FormFieldError
                    id={errorId}
                    errors={field.state.meta.errors}
                  />
                </FormField>
              )
            }}
          </form.Field>

          <form.Field name="title">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = fieldErrorId(field.name)

              return (
                <FormField id={field.name} label="Opis">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Unesite opis transakcije"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                  />
                  <FormFieldError
                    id={errorId}
                    errors={field.state.meta.errors}
                  />
                </FormField>
              )
            }}
          </form.Field>

          <form.Field name="category_id">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorId = fieldErrorId(field.name)

              return (
                <FormField id={field.name} label="Kategorija">
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
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
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
                  <FormFieldError
                    id={errorId}
                    errors={field.state.meta.errors}
                  />
                </FormField>
              )
            }}
          </form.Field>

          <form.Field name="transaction_date">
            {(field) => {
              const selectedDate = parseISODate(field.state.value)
              const hasError = field.state.meta.errors.length > 0
              const errorId = fieldErrorId(field.name)

              return (
                <FormField id={field.name} label="Datum">
                  <div>
                    <Popover
                      open={datePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            id={field.name}
                            type="button"
                            variant="outline"
                            className="w-full px-0 justify-start font-normal text-sm normal-case tracking-normal border-t-0 border-x-0 focus-ring-0 focus-ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-within:ring-0 focus-within:ring-offset-0"
                            aria-invalid={hasError}
                            aria-describedby={hasError ? errorId : undefined}
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
                  <FormFieldError
                    id={errorId}
                    errors={field.state.meta.errors}
                  />
                </FormField>
              )
            }}
          </form.Field>

          {formError ? (
            <p
              role="alert"
              aria-atomic="true"
              className="text-sm text-destructive motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-150"
            >
              {formError}
            </p>
          ) : null}
        </CardContent>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                nativeButton={false}
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending}
                render={<Link to="/transactions" search={{ page: 1 }} />}
              >
                Odustani
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending || !hasCategories}
              >
                {isSubmitting || isPending
                  ? 'Spremanje...'
                  : 'Spremi transakciju'}
              </Button>
            </CardFooter>
          )}
        </form.Subscribe>
      </form>
    </Card>
  )
}
