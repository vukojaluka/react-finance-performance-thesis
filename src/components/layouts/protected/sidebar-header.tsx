import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '../../ui/button'

export function ProtectedSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            MF
          </div>
          <span className="truncate font-bold">MyFinance</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem className="mt-2">
        <Button
          nativeButton={false}
          size="sm"
          variant="default"
          className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
          render={<Link to="/transactions/new" />}
        >
          <span className="group-data-[collapsible=icon]:hidden">
            Nova transakcija
          </span>
          <PlusIcon className="size-4" />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
