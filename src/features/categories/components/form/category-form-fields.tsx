import { FormField, getFormFieldAriaProps } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import type { CategoryFormApi } from '@/features/categories/hooks/use-category-form'
import { CATEGORY_COLOR_PRESETS } from '@/features/categories/lib/category-form'
import { cn } from '@/lib/utils'

type CategoryFormFieldsProps = {
  form: CategoryFormApi
}

export function CategoryFormFields({ form }: CategoryFormFieldsProps) {
  return (
    <>
      <form.Field name="name">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Naziv"
              errors={field.state.meta.errors}
            >
              <Input
                id={field.name}
                type="text"
                placeholder="Npr. Namirnice"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={aria['aria-invalid']}
                aria-describedby={aria['aria-describedby']}
              />
            </FormField>
          )
        }}
      </form.Field>

      <form.Field name="color">
        {(field) => {
          const aria = getFormFieldAriaProps(field.name, field.state.meta.errors)

          return (
            <FormField
              id={field.name}
              label="Boja"
              errors={field.state.meta.errors}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    id={field.name}
                    type="color"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-10 w-14 shrink-0 cursor-pointer p-1"
                    aria-invalid={aria['aria-invalid']}
                    aria-describedby={aria['aria-describedby']}
                  />
                  <Input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-w-0 flex-1"
                    aria-label="Hex kod boje"
                    aria-invalid={aria['aria-invalid']}
                    aria-describedby={aria['aria-describedby']}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLOR_PRESETS.map((presetColor) => {
                    const isSelected = field.state.value === presetColor

                    return (
                      <button
                        key={presetColor}
                        type="button"
                        className={cn(
                          'inline-flex size-8 items-center justify-center rounded-full border border-border transition-transform hover:scale-105',
                          isSelected && 'ring-2 ring-ring ring-offset-2',
                        )}
                        style={{ backgroundColor: presetColor }}
                        aria-label={`Odaberi boju ${presetColor}`}
                        aria-pressed={isSelected}
                        onClick={() => field.handleChange(presetColor)}
                      />
                    )
                  })}
                </div>
              </div>
            </FormField>
          )
        }}
      </form.Field>
    </>
  )
}
