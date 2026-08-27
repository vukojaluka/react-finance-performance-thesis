import { FormField, getFormFieldAriaProps } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BudgetFormApi } from '@/features/budgets/hooks/use-budget-form'
import {
  getMonthOptions,
  getYearOptions,
} from '@/features/budgets/lib/budget-period'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

type BudgetFormFieldsProps = {
  form: BudgetFormApi
  availableCategories: CategoryListItem[]
  hasCategories: boolean
  hasAvailableCategories: boolean
  allCategoriesBudgeted: boolean
}

export function BudgetFormFields({
  form,
  availableCategories,
  hasCategories,
  hasAvailableCategories,
  allCategoriesBudgeted,
}: BudgetFormFieldsProps) {
  const monthOptions = getMonthOptions()
  const yearOptions = getYearOptions()

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
                    monthOptions.map((option) => [option.value, option.label]),
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
                    {monthOptions.map((option) => (
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
