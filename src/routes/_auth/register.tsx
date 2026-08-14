import { createFileRoute, redirect } from '@tanstack/react-router'

import { RegisterForm } from '@/features/auth/components/register-form'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: async ({ context }) => {
    const { isLoggedIn } =
      await context.queryClient.fetchQuery(currentUserQuery())

    if (isLoggedIn) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
  head: () => ({
    meta: [
      {
        title: 'Registriraj se - MyFinance',
      },
    ],
  }),
})

function RegisterPage() {
  return <RegisterForm />
}
