import { Link } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LandingAuthActions } from '@/features/landing/components/landing-auth-actions'
import { useLandingCurrentUser } from '@/features/landing/hooks/use-landing-current-user'

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

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data } = useLandingCurrentUser()
  const isLoggedIn = data?.isLoggedIn === true
  const navLabel = isLoggedIn
    ? 'Nadzorna ploča i odjava'
    : 'Prijava i registracija'

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <BrandMark />

        <nav
          aria-label={navLabel}
          className="hidden items-center gap-2 md:flex"
        >
          <LandingAuthActions size="sm" />
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
                <SheetDescription>{navLabel}</SheetDescription>
              </SheetHeader>
              <nav
                aria-label={navLabel}
                className="flex flex-col gap-2 px-8 pb-8"
              >
                <LandingAuthActions fullWidth onNavigate={closeMenu} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
