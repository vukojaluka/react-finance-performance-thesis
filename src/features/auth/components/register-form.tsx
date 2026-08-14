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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { getFieldErrorMessage } from '@/features/auth/lib/field-error-message'
import { registerSchema } from '@/features/auth/schemas/register.schema'
import { register } from '@/features/auth/server/register'

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
          queryClient.removeQueries({ queryKey: currentUserQuery().queryKey })
          await router.invalidate()
          await navigate({ to: '/' })
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

  console.log(form.state.errors)

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
            {(field) => (
              <div className="space-y-0">
                <Label htmlFor={field.name}>Ime</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="given-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive mt-1">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="lastName">
            {(field) => (
              <div className="space-y-0">
                <Label htmlFor={field.name}>Prezime</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="family-name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive mt-1">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-0">
                <Label htmlFor={field.name}>E-mail</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive mt-1">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-0">
                <Label htmlFor={field.name}>Lozinka</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive mt-1">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div className="space-y-0">
                <Label htmlFor={field.name}>Potvrda lozinke</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive mt-1">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-muted-foreground">{successMessage}</p>
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
