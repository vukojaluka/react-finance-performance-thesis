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
import { registerSchema } from '@/features/auth/schemas/register.schema'
import { register } from '@/features/auth/server/register'
import { resetUserQueryCache } from '@/integrations/tanstack-query/clear-user-cache'

export function RegisterForm() {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const registerFn = useServerFn(register)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setSuccessMessage(null)

      try {
        const result = await registerFn({ data: value })

        if (result.status === 'authenticated') {
          await resetUserQueryCache(queryClient)
          await router.invalidate()
          await navigate({ to: '/dashboard' })
          return
        }

        setSuccessMessage(
          'Račun je kreiran. Provjerite e-mail kako biste potvrdili adresu, zatim se prijavite.',
        )
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
        <CardTitle>Registracija</CardTitle>
        <CardDescription>
          Registrirajte se e-mailom i lozinkom kako biste započeli.
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
          <form.Field name="firstName">
            {(field) => {
              const aria = getFormFieldAriaProps(
                field.name,
                field.state.meta.errors,
              )

              return (
                <FormField
                  id={field.name}
                  label="Ime"
                  errors={field.state.meta.errors}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    autoComplete="given-name"
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

          <form.Field name="lastName">
            {(field) => {
              const aria = getFormFieldAriaProps(
                field.name,
                field.state.meta.errors,
              )

              return (
                <FormField
                  id={field.name}
                  label="Prezime"
                  errors={field.state.meta.errors}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    autoComplete="family-name"
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
                    autoComplete="new-password"
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

          <form.Field name="confirmPassword">
            {(field) => {
              const aria = getFormFieldAriaProps(
                field.name,
                field.state.meta.errors,
              )

              return (
                <FormField
                  id={field.name}
                  label="Potvrda lozinke"
                  errors={field.state.meta.errors}
                >
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="new-password"
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

          {successMessage ? (
            <p role="status" aria-atomic="true" className="text-sm text-muted-foreground">
              {successMessage}
            </p>
          ) : null}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Kreiranje računa...' : 'Kreiraj račun'}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-sm text-muted-foreground">
            Već imate račun?{' '}
            <Link
              to="/login"
              search={{ redirect: '/dashboard' }}
              className="text-foreground underline underline-offset-4"
            >
              Prijavite se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
