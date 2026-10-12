import { Link, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { logout } from '@/features/auth/server/logout'
import { useLandingCurrentUser } from '@/features/landing/hooks/use-landing-current-user'
import { clearUserQueryCache } from '@/integrations/tanstack-query/clear-user-cache'
import { cn } from '@/lib/utils'

type LandingAuthActionsProps = {
  size?: 'default' | 'sm'
  labels?: 'header' | 'hero'
  fullWidth?: boolean
  showLogout?: boolean
  onNavigate?: () => void
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
  const { data } = useLandingCurrentUser()
  const isLoggedIn = data?.isLoggedIn === true

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      clearUserQueryCache(queryClient)
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
