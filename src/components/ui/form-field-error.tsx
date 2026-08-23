import { getFormFieldErrorMessage } from '@/lib/form-errors'
import { cn } from '@/lib/utils'

type FormFieldErrorProps = {
  id: string
  errors: unknown[]
  className?: string
}

export function FormFieldError({ id, errors, className }: FormFieldErrorProps) {
  const hasErrors = errors.length > 0
  const message = hasErrors ? getFormFieldErrorMessage(errors) : ''

  return (
    <div
      data-visible={hasErrors}
      className={cn(
        'mt-0 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin-top] duration-150 ease-out data-[visible=true]:mt-2 data-[visible=true]:grid-rows-[1fr] data-[visible=true]:opacity-100',
        className,
      )}
    >
      <p
        id={id}
        role={hasErrors ? 'alert' : undefined}
        aria-atomic="true"
        aria-hidden={!hasErrors}
        className="min-h-0 overflow-hidden whitespace-pre-line text-xs text-destructive"
      >
        {message}
      </p>
    </div>
  )
}
