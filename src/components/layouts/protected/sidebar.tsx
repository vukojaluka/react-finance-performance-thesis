import { ProtectedSidebarHeader } from '@/components/layouts/protected/sidebar-header'
import { ProtectedSidebarNav } from '@/components/layouts/protected/sidebar-nav'
import { ProtectedSidebarFooter } from '@/components/layouts/protected/sidebar-footer'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'

export function ProtectedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProtectedSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <ProtectedSidebarNav />
      </SidebarContent>
      <SidebarSeparator className="w-auto!" />
      <SidebarFooter>
        <ProtectedSidebarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
