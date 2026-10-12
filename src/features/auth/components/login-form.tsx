import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormField, getFormFieldAriaProps } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/features/auth/schemas/login.schema'
import { login } from '@/features/auth/server/login'
import { resetUserQueryCache } from '@/integrations/tanstack-query/clear-user-cache'

type LoginFormProps = {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const loginFn = useServerFn(login)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await loginFn({ data: value })
        await resetUserQueryCache(queryClient)
        await router.invalidate()
        await navigate({ to: redirectTo })
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Došlo je do greške. Pokušajte ponovno.',
        )
      }
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Prijava</CardTitle>
        <CardDescription>
          Koristite e-mail i lozinku za pristup aplikaciji.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name="email">
            {(field) => {
              const aria = getFormFieldAriaProps(
                field.name,
                field.state.meta.errors,
              )

              return (
                <FormField
                  id={field.name}
                  label="E-mail"
                  errors={field.state.meta.errors}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
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

          <form.Field name="password">
            {(field) => {
              const aria = getFormFieldAriaProps(
                field.name,
                field.state.meta.errors,
              )

              return (
                <FormField
                  id={field.name}
                  label="Lozinka"
                  errors={field.state.meta.errors}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="current-password"
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

          {formError ? (
            <p role="alert" aria-atomic="true" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Prijava u tijeku...' : 'Prijava'}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-sm text-muted-foreground">
            Nemate račun?{' '}
            <Link
              to="/register"
              className="text-foreground underline underline-offset-4"
            >
              Registrirajte se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
