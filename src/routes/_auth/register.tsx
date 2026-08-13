import { createFileRoute, redirect } from '@tanstack/react-router'

import { RegisterForm } from '@/features/auth/components/register-form'
import { getCurrentUser } from '@/features/auth/server/get-current-user'

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (user) {
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
