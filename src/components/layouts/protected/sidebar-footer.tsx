import { LogOut } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { logout } from '@/features/auth/server/logout'
import { clearUserQueryCache } from '@/integrations/tanstack-query/clear-user-cache'

export function ProtectedSidebarFooter() {
  const navigate = useNavigate()
  const router = useRouter()

  const queryClient = useQueryClient()
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      clearUserQueryCache(queryClient)
      await router.invalidate()
      await navigate({ to: '/login', search: { redirect: '/dashboard' } })
    },
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut />
          <span>
            {logoutMutation.isPending ? 'Odjava u tijeku...' : 'Odjavi se'}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
