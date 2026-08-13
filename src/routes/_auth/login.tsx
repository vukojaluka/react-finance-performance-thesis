import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/login-form'
import { sanitizeRedirect } from '@/features/auth/lib/sanitize-redirect'
import { getCurrentUser } from '@/features/auth/server/get-current-user'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  beforeLoad: async ({ search }) => {
    const user = await getCurrentUser()

    if (user) {
      throw redirect({ to: search.redirect })
    }
  },
  component: LoginPage,
  head: () => ({
    meta: [
      {
        title: 'Prijavi se - MyFinance',
      },
    ],
  }),
})

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch()

  return <LoginForm redirectTo={redirectTo} />
}
