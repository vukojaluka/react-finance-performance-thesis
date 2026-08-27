import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { FormField, getFormFieldAriaProps } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import type { CategoryListItem } from '@/features/categories/server/get-categories'
import { budgetsQuery } from '@/features/budgets/queries/budgets.query'
import type { useBudgetForm } from '@/features/budgets/hooks/use-budget-form'

type BudgetFormApi = ReturnType<typeof useBudgetForm>['form']

type BudgetFormFieldsProps = {
  form: BudgetFormApi
  mode: 'create' | 'edit'
  budgetId?: string
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  const label = new Intl.DateTimeFormat('hr-HR', { month: 'long' }).format(
    new Date(2026, index, 1),
  )

  return { value: month, label }
})

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear()

  return Array.from({ length: 7 }, (_, index) => currentYear - 2 + index)
}

function getAvailableCategories(
  categories: CategoryListItem[],
  occupiedCategoryIds: Set<string>,
  selectedCategoryId: string,
) {
  return categories.filter(
    (category) =>
      category.id === selectedCategoryId ||
      !occupiedCategoryIds.has(category.id),
  )
}

type BudgetFormFieldsContentProps = {
  form: BudgetFormApi
  mode: 'create' | 'edit'
  budgetId?: string
  month: number
  year: number
  categoryId: string
}

function BudgetFormFieldsContent({
  form,
  mode,
  budgetId,
  month,
  year,
  categoryId,
}: BudgetFormFieldsContentProps) {
  const { data: categories = [] } = useQuery(categoriesQuery())
  const { data: overview } = useQuery({
    ...budgetsQuery({ month, year }),
    enabled: month >= 1 && year >= 1000,
  })
  const yearOptions = useMemo(() => getYearOptions(), [])

  const occupiedCategoryIds = new Set(
    (overview?.categories ?? [])
      .filter((budget) => budget.budgetId !== budgetId)
      .map((budget) => budget.categoryId),
  )

  const availableCategories = getAvailableCategories(
    categories,
    occupiedCategoryIds,
    categoryId,
  )

  const hasCategories = categories.length > 0
  const hasAvailableCategories = availableCategories.length > 0
  const allCategoriesBudgeted =
    hasCategories && !hasAvailableCategories && mode === 'create'

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="month">
          {(field) => {
            const aria = getFormFieldAriaProps(
              field.name,
              field.state.meta.errors,
            )

            return (
              <FormField
                id={field.name}
                label="Mjesec"
                errors={field.state.meta.errors}
              >
                <Select
                  value={field.state.value}
                  items={Object.fromEntries(
                    MONTH_OPTIONS.map((option) => [option.value, option.label]),
                  )}
                  onValueChange={(value) => {
                    if (value) {
                      field.handleChange(Number(value))
                    }
                  }}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full capitalize"
                    aria-invalid={aria['aria-invalid']}
                    aria-describedby={aria['aria-describedby']}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="capitalize"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )
          }}
        </form.Field>

        <form.Field name="year">
          {(field) => {
            const aria = getFormFieldAriaProps(
              field.name,
              field.state.meta.errors,
            )

            return (
              <FormField
                id={field.name}
                label="Godina"
                errors={field.state.meta.errors}
              >
                <Select
                  value={field.state.value}
                  items={Object.fromEntries(
                    yearOptions.map((yearOption) => [
                      yearOption,
                      String(yearOption),
                    ]),
                  )}
                  onValueChange={(value) => {
                    if (value) {
                      field.handleChange(Number(value))
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
                    {yearOptions.map((yearOption) => (
                      <SelectItem key={yearOption} value={yearOption}>
                        {yearOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )
          }}
        </form.Field>
      </div>

      <form.Field name="category_id">
        {(field) => {
          const aria = getFormFieldAriaProps(
            field.name,
            field.state.meta.errors,
          )

          return (
            <FormField
              id={field.name}
              label="Kategorija"
              errors={field.state.meta.errors}
            >
              <Select
                value={field.state.value || null}
                items={Object.fromEntries(
                  availableCategories.map((category) => [
                    category.id,
                    category.name,
                  ]),
                )}
                disabled={!hasAvailableCategories}
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
                      !hasCategories
                        ? 'Nemate kategorija.'
                        : allCategoriesBudgeted
                          ? 'Sve kategorije već imaju budžet za odabrani mjesec.'
                          : 'Odaberite kategoriju'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
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

      <form.Field name="amount">
        {(field) => {
          const aria = getFormFieldAriaProps(
            field.name,
            field.state.meta.errors,
          )

          return (
            <FormField
              id={field.name}
              label="Iznos budžeta"
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
    </>
  )
}

export function BudgetFormFields({
  form,
  mode,
  budgetId,
}: BudgetFormFieldsProps) {
  return (
    <form.Subscribe
      selector={(state) => ({
        month: state.values.month,
        year: state.values.year,
        categoryId: state.values.category_id,
      })}
    >
      {(values) => (
        <BudgetFormFieldsContent
          form={form}
          mode={mode}
          budgetId={budgetId}
          month={values.month}
          year={values.year}
          categoryId={values.categoryId}
        />
      )}
    </form.Subscribe>
  )
}
