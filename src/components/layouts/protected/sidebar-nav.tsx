import { Link, useRouterState } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  isProtectedNavLinkActive,
  protectedNavLinks,
} from '@/components/layouts/protected/nav-links'

export function ProtectedSidebarNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="normal-case font-medium">
        Navigacija
      </SidebarGroupLabel>
      <SidebarMenu>
        {protectedNavLinks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              isActive={isProtectedNavLinkActive(pathname, item.path)}
              tooltip={item.name}
              render={<Link to={item.path as '/dashboard' | '/transactions'} />}
              onClick={() => setOpenMobile(false)}
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
