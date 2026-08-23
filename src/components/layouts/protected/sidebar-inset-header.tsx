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
import { getProtectedBreadcrumbTrail } from '@/components/layouts/protected/nav-links'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'

export function ProtectedSidebarInsetHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const breadcrumbTrail = getProtectedBreadcrumbTrail(pathname)
  const { data } = useQuery(currentUserQuery())
  const user = data?.user

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-2" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbTrail.map((item, index) => {
              const isLast = index === breadcrumbTrail.length - 1
              const isIntermediate = !isLast

              return (
                <span key={`${item.label}-${index}`} className="contents">
                  {index > 0 ? (
                    <BreadcrumbSeparator
                      className={isIntermediate ? 'hidden md:block' : undefined}
                    />
                  ) : null}
                  <BreadcrumbItem
                    className={isIntermediate ? 'hidden md:block' : undefined}
                  >
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : item.to ? (
                      <BreadcrumbLink render={<Link to={item.to} />}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
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
