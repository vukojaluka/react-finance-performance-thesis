import { CreditCard, Home, List, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ProtectedNavLink = {
  name: string
  path: '/dashboard' | '/transactions' | '/categories' | '/budgets'
  icon: LucideIcon
}

export type ProtectedBreadcrumbItem = {
  label: string
  to?: '/dashboard' | '/transactions' | '/categories'
}

function toBreadcrumbRoute(
  path: ProtectedNavLink['path'],
): ProtectedBreadcrumbItem['to'] {
  if (
    path === '/dashboard' ||
    path === '/transactions' ||
    path === '/categories'
  ) {
    return path
  }

  return undefined
}

const nestedPageLabels: Record<string, string> = {
  '/transactions/new': 'Nova transakcija',
  '/categories/new': 'Nova kategorija',
}

const TRANSACTION_EDIT_PATH =
  /^\/transactions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/edit$/i

const CATEGORY_EDIT_PATH =
  /^\/categories\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/edit$/i

function getNestedPageLabel(pathname: string): string | undefined {
  if (nestedPageLabels[pathname]) {
    return nestedPageLabels[pathname]
  }

  if (TRANSACTION_EDIT_PATH.test(pathname)) {
    return 'Uredi transakciju'
  }

  if (CATEGORY_EDIT_PATH.test(pathname)) {
    return 'Uredi kategoriju'
  }

  return undefined
}

export const protectedNavLinks = [
  {
    name: 'Nadzorna ploča',
    path: '/dashboard',
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

  const nestedLabel = getNestedPageLabel(pathname)

  if (nestedLabel) {
    return nestedLabel
  }

  const nested = protectedNavLinks.find((link) =>
    pathname.startsWith(`${link.path}/`),
  )

  return nested?.name ?? pathname
}

export function getProtectedBreadcrumbTrail(
  pathname: string,
): ProtectedBreadcrumbItem[] {
  if (pathname === '/dashboard') {
    return [{ label: 'Nadzorna ploča' }]
  }

  const nestedLabel = getNestedPageLabel(pathname)

  if (nestedLabel) {
    const parent = protectedNavLinks.find((link) =>
      pathname.startsWith(`${link.path}/`),
    )

    if (parent) {
      return [
        { label: 'Nadzorna ploča', to: '/dashboard' },
        { label: parent.name, to: toBreadcrumbRoute(parent.path) },
        { label: nestedLabel },
      ]
    }
  }

  const exact = protectedNavLinks.find((link) => link.path === pathname)

  if (exact) {
    return [
      { label: 'Nadzorna ploča', to: '/dashboard' },
      { label: exact.name },
    ]
  }

  const nested = protectedNavLinks.find((link) =>
    pathname.startsWith(`${link.path}/`),
  )

  if (nested) {
    return [
      { label: 'Nadzorna ploča', to: '/dashboard' },
      { label: nested.name },
    ]
  }

  return [{ label: pathname }]
}

export function isProtectedNavLinkActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}
