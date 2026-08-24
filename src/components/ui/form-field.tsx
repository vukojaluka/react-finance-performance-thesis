import type { ReactNode } from 'react'

import { FormFieldError } from '@/components/ui/form-field-error'
import { Label } from '@/components/ui/label'
import { fieldErrorId } from '@/lib/form-errors'
import { cn } from '@/lib/utils'

type FormFieldProps = {
  id: string
  label: string
  errors?: unknown[]
  className?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  errors = [],
  className,
  children,
}: FormFieldProps) {
  const errorId = fieldErrorId(id)

  return (
    <div className={cn('min-w-0', className)}>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      {children}
      <FormFieldError id={errorId} errors={errors} />
    </div>
  )
}

export function getFormFieldAriaProps(fieldName: string, errors: unknown[]) {
  const hasError = errors.length > 0
  const errorId = fieldErrorId(fieldName)

  return {
    hasError,
    errorId,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? errorId : undefined,
  } as const
}
