import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'

import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getProtectedNavLabel } from '@/components/layouts/protected/nav-links'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'

export function ProtectedSidebarInsetHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const currentLabel = getProtectedNavLabel(pathname)
  const isDashboard = pathname === '/'
  const { data } = useQuery(currentUserQuery())
  const user = data?.user

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-2" />
        <Breadcrumb>
          <BreadcrumbList>
            {isDashboard ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link to="/" />}>
                    Nadzorna ploča
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-center items-center ml-auto pr-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-b-full">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:grid flex-1 text-left text-xs leading-tight">
            <span className="truncate font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="truncate text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
