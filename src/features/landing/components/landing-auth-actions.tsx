import { Link, useRouter } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { logout } from '@/features/auth/server/logout'
import { resetUserQueryCache } from '@/integrations/tanstack-query/clear-user-cache'
import { cn } from '@/lib/utils'

type LandingAuthActionsProps = {
  size?: 'default' | 'sm'
  labels?: 'header' | 'hero'
  fullWidth?: boolean
  showLogout?: boolean
  onNavigate?: () => void
}

type LandingAuthActionsFallbackProps = {
  size?: 'default' | 'sm'
  fullWidth?: boolean
}

export function LandingAuthActionsFallback({
  size = 'sm',
  fullWidth = false,
}: LandingAuthActionsFallbackProps) {
  const height = size === 'sm' ? 'h-9' : 'h-10'

  return (
    <>
      <span className="sr-only">Učitavanje</span>
      <Skeleton
        aria-hidden="true"
        className={cn(height, fullWidth ? 'w-full' : 'w-36')}
      />
      <Skeleton
        aria-hidden="true"
        className={cn(height, fullWidth ? 'w-full' : 'w-24')}
      />
    </>
  )
}

export function LandingAuthActions({
  size = 'sm',
  labels = 'header',
  fullWidth = false,
  showLogout = true,
  onNavigate,
}: LandingAuthActionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(currentUserQuery())
  const isLoggedIn = data.isLoggedIn

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      await resetUserQueryCache(queryClient)
      await router.invalidate()
      onNavigate?.()
    },
  })

  const buttonClassName = cn(fullWidth && 'w-full')

  if (isLoggedIn) {
    return (
      <>
        <Button
          nativeButton={false}
          size={size}
          className={buttonClassName}
          render={<Link to="/dashboard" />}
          onClick={onNavigate}
        >
          Nadzorna ploča
        </Button>
        {showLogout ? (
          <Button
            type="button"
            size={size}
            variant="outline"
            className={buttonClassName}
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? 'Odjava u tijeku...' : 'Odjava'}
          </Button>
        ) : null}
      </>
    )
  }

  const registerLabel = labels === 'hero' ? 'Registrirajte se' : 'Registracija'
  const loginLabel = labels === 'hero' ? 'Prijavite se' : 'Prijava'

  return (
    <>
      <Button
        nativeButton={false}
        size={size}
        className={buttonClassName}
        render={<Link to="/register" />}
        onClick={onNavigate}
      >
        {registerLabel}
      </Button>
      <Button
        nativeButton={false}
        size={size}
        variant="outline"
        className={buttonClassName}
        render={<Link to="/login" search={{ redirect: '/dashboard' }} />}
        onClick={onNavigate}
      >
        {loginLabel}
      </Button>
    </>
  )
}
