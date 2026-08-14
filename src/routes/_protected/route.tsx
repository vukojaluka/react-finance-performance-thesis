import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import type { SafeUser } from '@/features/auth/lib/safe-user'
import { ProtectedSidebar } from '@/components/layouts/protected/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ProtectedSidebarInsetHeader } from '@/components/layouts/protected/sidebar-inset-header'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location, context }) => {
    const { isLoggedIn, user } =
      await context.queryClient.fetchQuery(currentUserQuery())

    if (!isLoggedIn) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    return { user } satisfies { user: SafeUser }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <SidebarProvider>
      <ProtectedSidebar />
      <SidebarInset>
        <ProtectedSidebarInsetHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
