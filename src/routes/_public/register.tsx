import { createFileRoute, redirect } from '@tanstack/react-router'

import { RegisterForm } from '@/features/auth/components/register-form'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { DEFAULT_POST_AUTH_REDIRECT } from '@/lib/constants'

export const Route = createFileRoute('/_public/register')({
  beforeLoad: async ({ context }) => {
    const { isLoggedIn } =
      await context.queryClient.fetchQuery(currentUserQuery())

    if (isLoggedIn) {
      throw redirect({ to: DEFAULT_POST_AUTH_REDIRECT })
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <RegisterForm />
    </div>
  )
}
