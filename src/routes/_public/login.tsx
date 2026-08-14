import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/login-form'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { sanitizeRedirect } from '@/lib/utils'

export const Route = createFileRoute('/_public/login')({
  validateSearch: (search) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  beforeLoad: async ({ search, context }) => {
    const { isLoggedIn } =
      await context.queryClient.fetchQuery(currentUserQuery())

    if (isLoggedIn) {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <LoginForm redirectTo={redirectTo} />
    </div>
  )
}
