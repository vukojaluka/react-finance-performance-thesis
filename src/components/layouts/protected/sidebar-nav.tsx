import { Link, useRouterState } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  isProtectedNavLinkActive,
  protectedNavLinks,
} from '@/components/layouts/protected/nav-links'

export function ProtectedSidebarNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <SidebarGroup>
      <SidebarMenu>
        {protectedNavLinks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              isActive={isProtectedNavLinkActive(pathname, item.path)}
              tooltip={item.name}
              render={
                <Link to={item.path as '/dashboard' | '/transactions'} />
              }
            >
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
