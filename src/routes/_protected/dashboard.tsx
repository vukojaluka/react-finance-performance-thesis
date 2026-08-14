import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
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
import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { logout } from '@/features/auth/server/logout'
import { DEFAULT_POST_AUTH_REDIRECT } from '@/lib/constants'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: 'Nadzorna ploča - MyFinance',
      },
    ],
  }),
})

function DashboardPage() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const logoutFn = useServerFn(logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      await logoutFn()
      queryClient.removeQueries({ queryKey: currentUserQuery().queryKey })
      await router.invalidate()
      await navigate({
        to: '/login',
        search: { redirect: DEFAULT_POST_AUTH_REDIRECT },
      })
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : 'Odjava nije uspjela. Pokušajte ponovno.',
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Zaštićeno područje</CardTitle>
          <CardDescription>
            Prijavljeni ste kao {user.email}. Poslovne funkcionalnosti bit će
            dodane u sljedećim koracima.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ova zaštićena ruta potvrđuje da autentifikacija radi. Sigurnosna
            granica baze podataka ostaje Supabase Auth uz PostgreSQL RLS.
          </p>

          {logoutError ? (
            <p className="text-sm text-destructive">{logoutError}</p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Odjava u tijeku...' : 'Odjava'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
