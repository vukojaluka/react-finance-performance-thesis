import { CreditCard, Home, List, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ProtectedNavLink = {
  name: string
  path: '/' | '/transactions' | '/categories' | '/budgets'
  icon: LucideIcon
}

export const protectedNavLinks = [
  {
    name: 'Nadzorna ploča',
    path: '/',
    icon: Home,
  },
  {
    name: 'Transakcije',
    path: '/transactions',
    icon: CreditCard,
  },
  {
    name: 'Kategorije',
    path: '/categories',
    icon: List,
  },
  {
    name: 'Budžeti',
    path: '/budgets',
    icon: Wallet,
  },
] as const satisfies readonly ProtectedNavLink[]

export function getProtectedNavLabel(pathname: string): string {
  const exact = protectedNavLinks.find((link) => link.path === pathname)

  if (exact) {
    return exact.name
  }

  const nested = protectedNavLinks.find(
    (link) => link.path !== '/' && pathname.startsWith(`${link.path}/`),
  )

  return nested?.name ?? pathname
}

export function isProtectedNavLinkActive(pathname: string, path: string) {
  if (path === '/') {
    return pathname === '/'
  }

  return pathname === path || pathname.startsWith(`${path}/`)
}
