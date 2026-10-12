import { Suspense, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MenuIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  LandingAuthActions,
  LandingAuthActionsFallback,
} from '@/features/landing/components/landing-auth-actions'
import { currentUserQuery } from '@/features/auth/queries/current-user.query'

function BrandMark() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
    >
      <span className="flex size-8 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
        MF
      </span>
      <span className="font-bold">MyFinance</span>
    </Link>
  )
}

function LandingSheetDescription() {
  const { data } = useSuspenseQuery(currentUserQuery())

  return (
    <SheetDescription>
      {data.isLoggedIn ? 'Nadzorna ploča i odjava' : 'Prijava i registracija'}
    </SheetDescription>
  )
}

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <BrandMark />

        <nav
          aria-label="Korisnički izbornik"
          className="hidden items-center gap-2 md:flex"
        >
          <Suspense fallback={<LandingAuthActionsFallback size="sm" />}>
            <LandingAuthActions size="sm" />
          </Suspense>
        </nav>

        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={(props) => (
                <Button
                  {...props}
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Otvori izbornik"
                >
                  <MenuIcon />
                </Button>
              )}
            />
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-72 max-w-[calc(100vw-2rem)]"
            >
              <SheetClose
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-4 right-4 bg-secondary"
                    aria-label="Zatvori izbornik"
                  />
                }
              >
                <XIcon />
                <span className="sr-only">Zatvori izbornik</span>
              </SheetClose>
              <SheetHeader>
                <SheetTitle>Izbornik</SheetTitle>
                <Suspense fallback={<Skeleton className="h-4 w-40" />}>
                  <LandingSheetDescription />
                </Suspense>
              </SheetHeader>
              <nav
                aria-label="Korisnički izbornik"
                className="flex flex-col gap-2 px-8 pb-8"
              >
                <Suspense fallback={<LandingAuthActionsFallback fullWidth />}>
                  <LandingAuthActions fullWidth onNavigate={closeMenu} />
                </Suspense>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
