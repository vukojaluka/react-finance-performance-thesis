import { getFormFieldErrorMessage } from '@/lib/form-errors'
import { cn } from '@/lib/utils'

type FormFieldErrorProps = {
  id: string
  errors: unknown[]
  className?: string
}

export function FormFieldError({ id, errors, className }: FormFieldErrorProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <p
      id={id}
      role="alert"
      aria-atomic="true"
      className={cn(
        'whitespace-pre-line text-sm text-destructive motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-150',
        className,
      )}
    >
      {getFormFieldErrorMessage(errors)}
    </p>
  )
}
